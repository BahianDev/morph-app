"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { useSwipeable } from "react-swipeable";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from "lucide-react";
import abi from "@/contracts/MorphysNFTS.abi.json";
import votingBbi from "@/contracts/NFTVoting.json";
import {
  MEME_CONTRACT_ADDRESS,
  NFT_VOTING_CONTRACT_ADDRESS,
} from "@/constants";
import { config } from "@/app/wagmi";
import axios from "axios";

interface Meme {
  id: number;
  image: string;
}

interface PendingVote {
  memeId: number;
  type: "like" | "dislike";
}

export default function VotePage() {
  const { address, isConnected } = useAccount();
  const [currentMeme, setCurrentMeme] = useState<Meme | null>(null);
  const [memeSupply, setMemeSupply] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVotes, setPendingVotes] = useState<PendingVote[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    const loadSupply = async () => {
      try {
        const supply = Number(
          await readContract(config, {
            abi,
            address: MEME_CONTRACT_ADDRESS,
            functionName: "totalSupply",
          })
        );
        setMemeSupply(supply);
      } catch (error) {
        console.error("Failed to load meme supply:", error);
        toast.error("Failed to load memes");
      }
    };

    if (isConnected) loadSupply();
  }, [isConnected]);

  // Load current meme when index changes
  const loadMeme = useCallback(async (id: number) => {
    if (id < 1) return; // IDs start at 1

    setIsLoading(true);
    try {
      const uri = String(
        await readContract(config, {
          abi,
          address: MEME_CONTRACT_ADDRESS,
          functionName: "tokenURI",
          args: [id],
        })
      );
      const { data } = await axios.get(uri);
      setCurrentMeme({ id, image: data.image });
    } catch (error) {
      console.error(`Failed to load meme ${id}:`, error);
      toast.error(`Failed to load meme #${id}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load meme when index changes
  useEffect(() => {
    if (isConnected && currentIndex <= memeSupply) {
      loadMeme(currentIndex);
    }
  }, [currentIndex, memeSupply, isConnected, loadMeme]);

  const checkOwnership = useCallback(async () => {
    if (!address) return false;

    try {
      const balance = Number(
        await readContract(config, {
          abi,
          address: MEME_CONTRACT_ADDRESS,
          functionName: "balanceOf",
          args: [address],
        })
      );
      return balance > 0;
    } catch (error) {
      console.error("Ownership check failed:", error);
      return false;
    }
  }, [address]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= memeSupply) return 1; // Wrap around to first meme
      return prev + 1;
    });
  }, [memeSupply]);

  const submitVotes = useCallback(async () => {
    if (pendingVotes.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // const hasOwnership = await checkOwnership();
      // if (!hasOwnership) {
      //   toast.error("To vote, you need to Morph a Meme first!");
      //   return;
      // }

      // Group votes by type
      const positiveVotes = pendingVotes
        .filter((v) => v.type === "like")
        .map((v) => v.memeId);

      const negativeVotes = pendingVotes
        .filter((v) => v.type === "dislike")
        .map((v) => v.memeId);

      // Submit batch
      await writeContractAsync({
        address: NFT_VOTING_CONTRACT_ADDRESS,
        abi: votingBbi,
        functionName: "voteBatch",
        args: [positiveVotes, negativeVotes],
      });

      toast.success(`Submitted ${pendingVotes.length} votes!`);
      setPendingVotes([]);
    } catch (error) {
      console.error("Vote submission failed:", error);
      toast.error("Failed to submit votes");
    } finally {
      setIsSubmitting(false);
    }
  }, [pendingVotes, isSubmitting, checkOwnership, writeContractAsync]);

  const handleVote = useCallback(
    async (type: "like" | "dislike") => {
      if (!currentMeme) return;

      if (pendingVotes.length >= 10) {
        return submitVotes();
      }

      // Add to pending votes
      setPendingVotes((prev) => [...prev, { memeId: currentMeme.id, type }]);

      toast.success(
        `Voted ${type} on meme #${currentMeme.id} (${
          pendingVotes.length + 1
        }/10)`
      );

      goNext();
    },
    [currentMeme, goNext, pendingVotes.length]
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => handleVote("dislike"),
    onSwipedRight: () => handleVote("like"),
    trackMouse: true,
  });

  const progressPercentage = useMemo(() => {
    return (pendingVotes.length / 10) * 100;
  }, [pendingVotes.length]);

  return (
    <div className="bg-gray-100 min-h-screen sm:p-8 flex justify-center">
      <div className="bg-custom-gray rounded-xl p-6 w-full max-w-md text-center h-fit">
        <h2 className="text-4xl font-black">
          <span className="text-green-600">MORPH'D</span>{" "}
          <span className="text-white">MEMES</span>
        </h2>
        <span>To vote, you need to Morph a Meme first!</span>

        {pendingVotes.length > 0 && (
          <div className="mt-4 bg-primaryTransparent p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                Pending votes: {pendingVotes.length}/10
              </span>
              <button
                onClick={submitVotes}
                disabled={isSubmitting}
                className="bg-primary text-white px-3 py-1 rounded text-sm  disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Submit Now"
                )}
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {isConnected && currentMeme && (
          <>
            <div className="mt-10 flex items-center">
              <button
                onClick={() => handleVote("dislike")}
                className="text-white p-2"
                disabled={isLoading}
              >
                <ChevronLeft size={32} />
              </button>
              <div
                {...handlers}
                className="rounded-lg overflow-hidden w-80 h-80 flex items-center justify-center mx-auto relative"
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
                  </div>
                ) : (
                  <img
                    src={currentMeme.image}
                    alt={`Meme #${currentMeme.id}`}
                    className="object-contain w-full h-full"
                    onLoad={() => setIsLoading(false)}
                  />
                )}
              </div>
              <button
                onClick={() => handleVote("like")}
                className="text-white p-2"
                disabled={isLoading}
              >
                <ChevronRight size={32} />
              </button>
            </div>
            <div className="flex gap-10 justify-center mt-6">
              <button
                onClick={() => handleVote("dislike")}
                className="bg-red-500 text-white p-3 rounded-full hover:scale-105 disabled:opacity-50"
                disabled={isLoading}
              >
                <ThumbsDown size={24} />
              </button>
              <button
                onClick={() => handleVote("like")}
                className="bg-green-500 text-white p-3 rounded-full hover:scale-105 disabled:opacity-50"
                disabled={isLoading}
              >
                <ThumbsUp size={24} />
              </button>
            </div>
            <p className="italic text-sm mt-4">
              Swipe or click to vote on meme #{currentMeme.id}
            </p>
            <p className="text-xs mt-2">
              {currentIndex} of {memeSupply}
            </p>
          </>
        )}
        {isConnected && !currentMeme && memeSupply === 0 && (
          <p className="mt-10">No memes available to vote on yet</p>
        )}
        {!isConnected && (
          <p className="mt-10">Please connect your wallet to vote!</p>
        )}
      </div>
    </div>
  );
}

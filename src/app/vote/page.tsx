"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { useSwipeable } from "react-swipeable";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
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

export default function VotePage() {
  const { address } = useAccount();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [index, setIndex] = useState(0);

  const loadMemes = useCallback(async () => {
    if (!address) return;
    const supply = Number(
      await readContract(config, {
        abi,
        address: MEME_CONTRACT_ADDRESS,
        functionName: "totalSupply",
      })
    );

    const arr: Meme[] = [];
    for (let i = 1; i <= supply; i++) {
      const uri = String(
        await readContract(config, {
          abi,
          address: MEME_CONTRACT_ADDRESS,
          functionName: "tokenURI",
          args: [i],
        })
      );
      const { data } = await axios.get(uri);
      console.log(data);
      arr.push({ id: i, image: data.image });
    }
    setMemes(arr);
  }, [address]);

  useEffect(() => {
    loadMemes();
  }, [loadMemes]);

  const current = memes[index];

  const { writeContractAsync } = useWriteContract();

  const goNext = () =>
    setIndex((prev) => (prev + 1 >= memes.length ? 0 : prev + 1));

  const handleVote = async (type: "like" | "dislike") => {
    try {
      if (type === "like") {
        await writeContractAsync({
          address: NFT_VOTING_CONTRACT_ADDRESS,
          abi: votingBbi,
          functionName: "votePositive",
          args: [current?.id],
        });
      } else {
        await writeContractAsync({
          address: NFT_VOTING_CONTRACT_ADDRESS,
          abi: votingBbi,
          functionName: "voteNegative",
          args: [current?.id],
        });
      }
      toast.success(type);
      goNext();
    } catch (e) {
      console.log(e);
      toast.error("Tx failed");
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleVote("dislike"),
    onSwipedRight: () => handleVote("like"),
    trackMouse: true,
  });

  return (
    <div className="bg-gray-100 min-h-screen sm:p-8 flex items-center justify-center">
      <div className="bg-custom-gray rounded-xl p-6 w-full max-w-md text-center">
        <h2 className="text-4xl font-black">
          <span className="text-green-600">MORPH’D</span>{" "}
          <span className="text-white">MEMES</span>
        </h2>
        {current && (
          <>
            <div className="mt-10 flex">
              <button
                onClick={() => handleVote("dislike")}
                className="text-white p-2"
              >
                <ChevronLeft size={32} />
              </button>
              <div
                {...handlers}
                className="bg-sky-200 rounded-lg overflow-hidden w-80 h-80 flex items-center justify-center mx-auto"
              >
                <img
                  src={current.image}
                  alt={`Meme #${current.id}`}
                  className="object-contain w-full h-full"
                />
              </div>
              <button
                onClick={() => handleVote("like")}
                className="text-white p-2"
              >
                <ChevronRight size={32} />
              </button>
            </div>
            <div className="flex gap-10 justify-center mt-6">
              <button
                onClick={() => handleVote("dislike")}
                className="bg-red-500 text-white p-3 rounded-full hover:scale-105"
              >
                <ThumbsDown size={24} />
              </button>
              <button
                onClick={() => handleVote("like")}
                className="bg-green-500 text-white p-3 rounded-full hover:scale-105"
              >
                <ThumbsUp size={24} />
              </button>
            </div>
            <p className="italic text-sm mt-4">
              Swipe or click to vote on meme #{current.id}
            </p>
          </>
        )}
        {!current && <p>Loading memes…</p>}
      </div>
    </div>
  );
}

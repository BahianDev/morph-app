"use client";

import { useCallback, useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { BigNumberish } from "ethers";
import abi from "@/contracts/NFTVoting.json";
import { NFT_VOTING_CONTRACT_ADDRESS } from "@/constants";
import { config } from "@/app/wagmi";

interface Entry {
  address: string;
  score: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[] | null>(null);

  const getLeaderboard = useCallback(async () => {
    try {
      const [addresses, scores] = (await readContract(config, {
        address: NFT_VOTING_CONTRACT_ADDRESS,
        abi,
        functionName: "getLeaderboard",
      })) as [string[], BigNumberish[]];

      const data = addresses.map((addr, i) => ({
        address: addr,
        score: scores[i].toString(),
      }));
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  }, []);

  useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);

  if (!entries) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Loading leaderboard…</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen text-black p-4 sm:p-8">
      <main className="flex flex-col items-center">
        <div className="bg-custom-gray rounded-xl p-4 sm:p-6 w-full max-w-6xl">
          <h2 className="text-2xl sm:text-4xl font-black text-center">
            <span className="text-green-600">MORPH&apos;D</span>{" "}
            <span className="text-white">LEADERBOARD</span>
          </h2>

          <div className="mt-6 space-y-2">
            {entries.map((entry, idx) => {
              const rank = String(idx + 1).padStart(2, "0");
              const isTop = idx === 0;
              const abbr = `${entry.address.substring(
                0,
                6
              )}…${entry.address.slice(-4)}`;

              return (
                <div
                  key={entry.address}
                  className={`flex justify-between items-center p-4 rounded-md ${
                    isTop ? "bg-primary text-white" : "bg-tamber-gray"
                  }`}
                >
                  <div className="flex gap-4 sm:gap-5 items-center">
                    <span className="font-bold text-xl sm:text-3xl text-white">
                      {rank}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base font-bold uppercase text-white">
                        {abbr}
                      </span>
                    </div>
                  </div>
                  <span className="text-xl sm:text-3xl font-thin text-white">
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

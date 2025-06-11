"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api_backend } from "@/services/api";
import { useAccount } from "wagmi";

interface LeaderboardEntry {
  address: string;
  networkScore: number;
  backendPoints: number;
  totalScore: number;
}

/**
 * Busca leaderboard combinada do backend
 */
const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data } = await api_backend.get("memes/leaderboard");
  return data;
};

export default function Leaderboard() {
  const { isConnected, address } = useAccount();

  const {
    data: entries,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => fetchLeaderboard(),
    enabled: isConnected && !!address,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Loading leaderboard…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-red-500">Error: {(error as Error).message}</span>
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
            {entries?.map((entry, idx) => {
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
                    {entry.totalScore.toLocaleString()}
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

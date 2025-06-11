"use client";

import React from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api_backend } from '@/services/api';

// Formato do troféu vindo da API
interface ApiTrophy {
  id: string;
  type: string;
  createdAt: string;
}

interface UserWithTrophies {
  wallet: string;
  points: number;
  trophies: ApiTrophy[];
}

// Definição estática dos troféus disponíveis
const TROPHY_DEFINITIONS = [
  { id: 1, title: "Morph'd 1 Meme", type: 'firstMemeMinted' },
  { id: 2, title: "Morph’d 5 Memes", type: 'minted5Memes' },
  { id: 3, title: "Morph’d 10 Memes", type: 'minted10Memes' },
  { id: 4, title: "Morph’d 25 Memes", type: 'minted25Memes' },
  // { id: 5, title: "Most Upvotes On Meme", type: 'mostLikedMemeOfMonth' },
  { id: 6, title: "Most Downvotes On Meme", type: 'mostDislikedMeme' },
  // { id: 7, title: "Fastest to 100 Likes", type: 'fastestTo100Likes' },
  { id: 8, title: "Hold 1 Morphies", type: 'hold1Morphies' },
  { id: 9, title: "Hold 2–5 Morphies", type: 'hold2To5Morphies' },
  { id: 10, title: "Hold 6–10 Morphies", type: 'hold6To10Morphies' },
  { id: 11, title: "Hold 10+ Morphies", type: 'hold10PlusMorphies' },
  { id: 12, title: "Leaderboard #1", type: 'leaderboardFirstPlace' },
  { id: 13, title: "Leaderboard Top 10", type: 'leaderboardTop10' },
  { id: 14, title: "Most Memes in a Day", type: 'mostMemesInDay' },
  // { id: 15, title: "Most Memes Minted on Launch Day", type: 'mintedOnLaunchDay' },
  // { id: 16, title: "Most Liked Meme of Month", type: 'mostLikedMemeOfMonth' },
  { id: 17, title: "Liked 150 Memes", type: 'liked150Memes' },
  { id: 18, title: "Liked 500 Memes", type: 'liked500Memes' },
  { id: 19, title: "Liked 1000+ Memes", type: 'liked1000PlusMemes' },
];

/**
 * Busca usuário e troféus pela wallet
 */
const fetchUserTrophies = async (
  wallet: string
): Promise<UserWithTrophies> => {
  const { data } = await api_backend.get(`memes/user/${wallet}`);
  return data;
};

export default function Trophies() {
  const { isConnected, address } = useAccount();

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['userTrophies', address],
    queryFn: () => fetchUserTrophies(address!),
    enabled: isConnected && !!address,
    refetchOnWindowFocus: false,
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen text-black px-4 sm:p-8 flex justify-center items-center">
        <p className="text-center font-semibold">Please connect your wallet!</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="mt-10 text-center min-h-screen">Loading trophies...</div>;
  }

  if (isError) {
    return (
      <div className="mt-10 text-center text-black min-h-screen">
        User not found!
      </div>
    );
  }

  // Ordena: primeiro desbloqueados, depois bloqueados
  const sortedTrophies = [
    ...TROPHY_DEFINITIONS.filter(def =>
      userData?.trophies.some(t => t.type === def.type)
    ),
    ...TROPHY_DEFINITIONS.filter(def =>
      !userData?.trophies.some(t => t.type === def.type)
    ),
  ];

  return (
    <div className="min-h-screen text-black px-4 sm:p-8">
      <main className="flex flex-col items-center">
        <div className="bg-custom-gray rounded-xl p-6 w-full max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center">
            <span className="text-green-600">MORPH&apos;D</span>{' '}
            <span className="text-white">TROPHIES</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10">
            {sortedTrophies.map(({ id, title, type }) => {
              const unlocked = userData?.trophies.some(t => t.type === type);
              const icon = `/trophies/${type}.png`;
              return (
                <div
                  key={id}
                  className={`rounded-lg p-4 flex flex-col justify-center items-center h-40 w-full ${
                    unlocked ? 'bg-white' : 'bg-gray-500'
                  }`}
                >
                  <img
                    src={icon}
                    alt={title}
                    className={`h-20 mb-2 ${
                      unlocked ? '' : 'filter grayscale'
                    }`}
                  />
                  <div className="text-center font-bold text-sm text-black">
                    {title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

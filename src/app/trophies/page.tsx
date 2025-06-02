"use client";

import { useAccount } from "wagmi";

const trophies = [
  {
    id: 1,
    title: "MORPHD 1 Meme",
    unlocked: true,
    icon: "/trophies/trophy1.png",
  },
  { id: 2, title: "Morph’d 5 Memes", unlocked: false },
  { id: 3, title: "Morph’d 10 Memes", unlocked: false },
  { id: 4, title: "Morph’d 25 Memes", unlocked: false },
  { id: 5, title: "Most Upvotes On Meme", unlocked: false },
  { id: 6, title: "Most Downvotes On Meme", unlocked: false },
];

export default function Trophies() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen text-black px-4 sm:p-8">
      <main className="flex flex-col items-center">
        <div className="bg-custom-gray rounded-xl p-6 w-full max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center">
            <span className="text-green-600">MORPH&apos;D</span>{" "}
            <span className="text-white">TROPHIES</span>
          </h2>

          {isConnected ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10">
              {trophies.map((trophy) => (
                <div
                  key={trophy.id}
                  className={`rounded-lg p-4 flex flex-col justify-center items-center h-40 w-full ${
                    trophy.unlocked ? "bg-white" : "bg-gray-500 text-black/50"
                  }`}
                >
                  {trophy.unlocked ? (
                    <img src={trophy.icon} alt="Trophy" className="h-16 mb-2" />
                  ) : (
                    <div className="text-center font-bold text-sm">
                      {trophy.title}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center mt-10 min-h-[200px]">
              <p className="text-center font-semibold">
                Please connect your wallet!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

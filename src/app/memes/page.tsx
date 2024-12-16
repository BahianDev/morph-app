"use client";

import Image from "next/image";
import { useState } from "react";

export default function Memes() {
  const [tab, setTab] = useState("Background");

  const sections = ["Background", "Stickers", "Text", "GIFs"];

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen py-8">
      <main className="flex flex-col gap-8 items-start justify-start w-full">
        <span className="font-medium text-2xl self-start">
          Morph your Morphy, download or mint on-chain to rep on socials.
          Simple!
        </span>
        <div className="flex space-x-5 flex-col lg:flex-row w-full">
          <div className="flex flex-col lg:flex-row w-full gap-5">
            <div className="bg-custom-gray p-4 rounded-xl ">
              <Image
                src="/home/morphy.png"
                width={500}
                height={500}
                alt="MORPH"
              />
            </div>
            <div className="bg-custom-gray rounded-xl h-full lg:flex-1">
              <div className="flex overflow-x-scroll gap-8 items-center px-4 bg-tamber-gray h-16 w-full rounded-t-xl">
                {sections.map((section, key) => (
                  <div
                    onClick={() => setTab(section)}
                    key={key}
                    className={`${
                      tab === section
                        ? "text-white border-b-4 border-solid transition-all duration-300 "
                        : ""
                    } h-full flex items-center cursor-pointer`}
                  >
                    <span className="font-bold">{section}</span>
                  </div>
                ))}
                <button className="focus:outline-none text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg px-8 py-1">
                  RANDOMIZE
                </button>
              </div>
              <div className="px-4 py-8 flex gap-8 flex-wrap">
                <div className="bg-primary w-24 h-24 rounded-lg"></div>
                <div className="bg-yellow-300 w-24 h-24 rounded-lg"></div>
                <div className="bg-pink-400 w-24 h-24 rounded-lg"></div>
                <div className="bg-blue-500 w-24 h-24 rounded-lg"></div>
                <div className="bg-orange-500 w-24 h-24 rounded-lg"></div>
                <div className="bg-teal-800 w-24 h-24 rounded-lg"></div>
                <div className="bg-sky-400 w-24 h-24 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button className="focus:outline-none text-black border-2 border-black bg-transparent font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2">
            RESET
          </button>
          <button className="focus:outline-none text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2">
            DOWNLOAD
          </button>
          <button className="focus:outline-none text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2">
            MORPH
          </button>
        </div>
      </main>
    </div>
  );
}

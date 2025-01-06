"use client";
import Image from "next/image";
import { useState } from "react";

function Card() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-80 h-fit bg-white rounded-lg">
      <div className="bg-[#989898] p-2 rounded-t-lg">
        <span className="text-white font-bold text-lg">Morphy #1</span>
      </div>
      <div className="p-5">
        <Image
          src={"/mock1.jpg"}
          alt="morphy-card"
          width={384}
          height={384}
          className="rounded-lg"
        />
      </div>
      <div className="bg-white p-4 rounded-lg relative">
        <button
          onClick={toggleCollapse}
          className="text-start text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-8 py-1 mb-2 w-full"
        >
          Traits
        </button>
        <div
          className={`overflow-hidden bg-white w-full left-0  z-50 absolute flex flex-wrap gap-2 justify-center transition-all duration-500 ${
            isOpen ? "max-h-40 pb-4 rounded-b-lg" : "max-h-0"
          }`}
        >
            <div className="bg-[#AEAEAE] flex flex-col w-32 text-xs rounded-lg text-white">
                <div className="bg-[#989898] rounded-t-lg p-1 font-bold">Background</div>
                <div className="h-10 flex items-center px-1">Blue</div>
            </div>
            <div className="bg-[#AEAEAE] flex flex-col w-32 text-xs rounded-lg text-white">
                <div className="bg-[#989898] rounded-t-lg p-1 font-bold">Eyes</div>
                <div className="h-10 flex items-center px-1">Stern</div>
            </div>
            <div className="bg-[#AEAEAE] flex flex-col w-32 text-xs rounded-lg text-white">
                <div className="bg-[#989898] rounded-t-lg p-1 font-bold">Mouth</div>
                <div className="h-10 flex items-center px-1">Bite Lip</div>
            </div>
            <div className="bg-[#AEAEAE] flex flex-col w-32 text-xs rounded-lg text-white">
                <div className="bg-[#989898] rounded-t-lg p-1 font-bold">Lower</div>
                <div className="h-10 flex items-center px-1">Pink Shorts</div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

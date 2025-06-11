import { signIn } from "next-auth/react";
import Image from "next/image";

export default function TwitterButton() {
  return (
    <button
      onClick={() => signIn()}
      className="flex h-20 items-center border-2 p-2 rounded-xl w-72 justify-between hover:bg-black transition-colors"
    >
      <Image
        src={"/icons/x.svg"}
        width={40}
        height={40}
        className="w-16 h-16"
        alt="X"
      />
      <span className="text-3xl">REGISTER</span>
      <Image
        src={"/icons/x.svg"}
        width={40}
        height={40}
        className="w-16 h-16"
        alt="X"
      />
    </button>
  );
}
"use client"

import { ConnectWallet } from "@/components/ConnectWallet";
import Link from "next/link";

export default function MemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-9 px-20">
      <header className="flex justify-between">
        <h1 className="font-extrabold text-4xl">MORPH’D</h1>
        <div className="flex gap-5">
          <div className="flex items-center gap-5 text-lg font-medium">
            <div>
              <Link href={'/home'}>Home</Link>
            </div>
            <div>
              <Link href={'/morphys'}>Morphys</Link>
            </div>
            <div>
              <Link href={'memes'}>Memes</Link>
            </div>
          </div>
          <ConnectWallet />
        </div>
      </header>
      {children}
    </section>
  );
}

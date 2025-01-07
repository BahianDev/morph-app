"use client"

import { ConnectWallet } from "@/components/ConnectWallet";

export default function MemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-9 px-20">
      <header className="flex justify-between">
        <h1 className="font-extrabold text-4xl">MORPH’D</h1>
        <ConnectWallet />
      </header>
      {children}
    </section>
  );
}

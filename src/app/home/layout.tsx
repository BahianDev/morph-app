"use client";

import { ConnectWallet } from "@/components/ConnectWallet";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-9 lg:px-20">
      <Navbar/>
      {children}
    </section>
  );
}

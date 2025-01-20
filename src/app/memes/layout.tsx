"use client"

import Navbar from "@/components/Navbar";

export default function MemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-9 lg:px-20 h-screen overflow-scroll">
      <Navbar/>
      {children}
    </section>
  );
}

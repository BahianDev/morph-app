"use client";
import Navbar from "@/components/Navbar";

export default function MorphysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-9 lg:px-20">
      <Navbar />
      {children}
    </section>
  );
}

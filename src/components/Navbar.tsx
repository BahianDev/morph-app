"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { useAccount } from "wagmi";
import TwitterButton from "./TwitterButton";

const navLinks = [
  { title: "Home", path: "/home" },
  { title: "Memes", path: "/memes/list" },
  { title: "Leaderboard", path: "/leaderboard", requiresConnection: true },
  { title: "Vote", path: "/vote" },
  { title: "Trophies", path: "/trophies", requiresConnection: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToogle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const { isConnected } = useAccount();

  const visibleLinks = navLinks.filter(
    (link) => !link.requiresConnection || isConnected
  );

  return (
    <header className="flex w-full sticky min-h-16 items-center h-auto bg-nav_bg max-sm:px-4 backdrop-blur-md z-[100] top-0">
      <nav
        className={`w-full ${
          isOpen ? "justify-start" : "justify-between"
        }  items-start flex mr-auto ml-auto h-full relative`}
      >
        <Link
          href={"/home"}
          className="font-extrabold text-2xl md:text-4xl cursor-pointer"
        >
          MORPH’D
        </Link>

        <div className="fixed md:hidden right-12 top-3">
          <ConnectWallet />
        </div>

        <button
          onClick={handleToogle}
          className={`block z-10 md:hidden h-6 mt-2 border-black bg-none border-t-4 cursor-pointer before:content-[' '] before:block before:w-[30px] before:h-1 before:bg-black before:mt-[5px] before:relative before:duration-700 after:content-[' '] after:block after:w-[30px] after:h-1 after:bg-black after:mt-[5px] after:relative after:duration-700 ${
            isOpen &&
            "fixed  right-4 border-t-transparent before:rotate-[135deg] after:rotate-[-135deg] after:-top-[9px]"
          }`}
        ></button>
        <ul
          className={`flex items-center gap-6 max-sm:nav-list-sm ${
            isOpen ? "max-sm:clip-nav-path-active mt-5" : "max-sm:clip-nav-path"
          } `}
        >
          {visibleLinks.map(({ title, path }, index) => (
            <li key={index}>
              <Link href={path} className="font-medium text-2xl">
                {title}
              </Link>
            </li>
          ))}
          <li className="hidden md:flex">
            <ConnectWallet />
          </li>
          <li className="hidden md:flex">
            <TwitterButton />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

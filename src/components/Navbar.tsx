"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ConnectWallet } from "./ConnectWallet";

const navLinks = [
  {
    title: "Home",
    path: "/home",
  },
  {
    title: "Morphys",
    path: "/morphys",
  },
  {
    title: "Memes",
    path: "/memes",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToogle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  return (
    <header className="flex w-full sticky min-h-16 items-center h-auto bg-nav_bg max-sm:px-4 backdrop-blur-md z-[100] top-0">
      <nav className="w-full justify-between flex mr-auto ml-auto h-full">
        <h1 className="font-extrabold text-4xl">MORPH’D</h1>
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
          {navLinks.map(({ title, path }, index) => (
            <li key={index}>
              <Link
                href={path}
                className="font-medium text-lg"
              >
                {title}
              </Link>
            </li>
          ))}
          <li>
            <ConnectWallet />
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Navbar;

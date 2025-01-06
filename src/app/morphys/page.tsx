"use client";

import { api } from "@/services/api";
import { Trait } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("Lower");
  const [mountedImage, setMountedImage] = useState([
    {
      name: "base",
      type: "Base",
      url: "/base.png",
    },
  ]);

  const sections = [
    "Lower",
    "Hat",
    "Upper",
    "Eyes",
    "Eyes Wear",
    "Foot Wear",
    "Accessories",
    "Mouth",
  ];

  const { data: traits } = useQuery({
    queryKey: ["traits-list"],
    queryFn: (): Promise<Trait[]> =>
      api.get(`traits?populate=*`).then((response) => response.data.data),
    refetchOnWindowFocus: false,
    initialData: [],
  });

  const addTraitImage = useCallback(
    (type: string, url: string, name: string) => {
      setMountedImage((prev) => {
        const existingIndex = prev.findIndex((item) => item.type === type);

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = { type, url, name };
          return updated;
        }

        return [...prev, { type, url, name }];
      });
    },
    []
  );

  const resetTraitImage = useCallback(() => {
    setMountedImage([
      {
        name: "base",
        type: "Base",
        url: "/base.png",
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen py-8">
      <main className="flex flex-col gap-8 items-start justify-start w-full">
        <span className="font-medium text-2xl self-start">
          Morph your Morphy, download or mint on-chain to rep on socials.
          Simple!
        </span>
        <div className="flex space-x-5 flex-col lg:flex-row w-full">
          <div className="flex flex-col lg:flex-row w-full gap-5">
            <div className="bg-custom-gray p-4 rounded-xl relative w-60 h-60  lg:w-96 lg:h-96">
              {mountedImage.map((image, key) => (
                <Image
                  key={key}
                  className="absolute top-0 left-0"
                  src={image.url}
                  width={500}
                  height={500}
                  alt="MORPH"
                />
              ))}
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
              </div>
              <div className="px-4 py-8 flex gap-8 flex-wrap">
                {traits.length > 0 &&
                  traits
                    .filter((trait) => trait.type === tab)
                    .map((trait, key) => (
                      <div
                        key={key}
                        onClick={() =>
                          addTraitImage(
                            trait.type,
                            "http://localhost:1337" + trait.image[0].url,
                            trait.name
                          )
                        }
                        className={`border border-gray-500 w-24 h-24 rounded-lg cursor-pointer ${
                          mountedImage.find(
                            (image) => image.name === trait.name
                          ) && "bg-primary"
                        }`}
                      >
                        <Image
                          src={`http://localhost:1337${trait.image[0].url}`}
                          alt="Picture of the author"
                          className="h-full w-full"
                          style={{
                            width: '100%',
                            height: '100%',
                          }}                        />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <button onClick={resetTraitImage} className="focus:outline-none text-black border-2 border-black bg-transparent font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2">
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

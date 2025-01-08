"use client";

import { api } from "@/services/api";
import { Trait } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import abi from "@/contracts/MorphysNFTS.abi.json";
import { config } from "../wagmi";

export default function Morphys() {
  const [tab, setTab] = useState("Background");
  const [mountedImage, setMountedImage] = useState([
    {
      name: "base",
      type: "Base",
      url: "http://localhost:1337/uploads/base_d6563af965.png",
    },
  ]);

  const sections = [
    "Background",
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
      api
        .get(`traits?populate=*&pagination[pageSize]=100`)
        .then((response) => response.data.data),
    refetchOnWindowFocus: false,
    initialData: [],
  });

  const addTraitImage = useCallback(
    (type: string, url: string, name: string) => {
      setMountedImage((prev) => {
        const existingIndex = prev.findIndex((item) => item.type === type);

        let updated;

        if (existingIndex !== -1) {
          updated = [...prev];
          updated[existingIndex] = { type, url, name };
        } else {
          updated = [...prev, { type, url, name }];
        }

        return updated.sort((a, b) => {
          if (a.type === "Background") return -1;
          if (b.type === "Background") return 1;
          if (a.type === "Base") return -1;
          if (b.type === "Base") return 1;
          return 0;
        });
      });
    },
    []
  );

  const resetTraitImage = useCallback(() => {
    setMountedImage([
      {
        name: "base",
        type: "Base",
        url: "http://localhost:1337/uploads/base_d6563af965.png",
      },
    ]);
  }, []);

  const handleDownload = useCallback(async () => {
    const response = await axios.post(
      "/morphys/download",
      {
        height: 2048,
        width: 2048,
        layers: mountedImage.map((image) => image.url),
      },
      { responseType: "arraybuffer" }
    );

    const blob = new Blob([response.data], { type: "image/png" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [mountedImage]);

  const handleMorph = useCallback(async () => {
    toast.loading("Uploading metadata...");

    const tokenId = await readContract(config, {
      abi,
      address: "0x094cd54bCC5eeC67c999a6E32C3dE2584726D918",
      functionName: "totalSupply",
    }).then((r) => Number(r) + 1);

    const attributes = mountedImage
      .filter((image) => image.name !== "base")
      .map((image) => {
        return {
          trait_type: image.type,
          value: image.name,
        };
      });

    const response = await axios.post(
      "/api",
      {
        height: 2048,
        width: 2048,
        layers: mountedImage.map((image) => image.url),
        attributes: attributes,
        tokenId,
      },
      { responseType: "arraybuffer" }
    );

    console.log(response.data);

    toast.dismiss();

    toast.loading("Sending transaction...");

    const result = await writeContract(config, {
      abi,
      address: "0x094cd54bCC5eeC67c999a6E32C3dE2584726D918",
      functionName: "safeMint",
      args: [
        `https://morphd.s3.us-east-2.amazonaws.com/morphy/metadata/${tokenId}.json`,
      ],
    });

    toast.dismiss();

    toast.loading("Confirming transaction...");

    const transactionReceipt = await waitForTransactionReceipt(config, {
      hash: result,
    });

    toast.dismiss();

    toast.custom(
      <div className="bg-white border-2 border-primary p-3 rounded-lg">
        <a
          className="font-bold text-lg"
          target="_blank"
          href={`https://explorer-holesky.morphl2.io/token/0x094cd54bCC5eeC67c999a6E32C3dE2584726D918/instance/${tokenId}`}
        >
          Click to see Morhp Explorer
        </a>
      </div>,
      {
        duration: 4000,
      }
    );

    return transactionReceipt;
  }, [mountedImage]);

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
                          className="h-full w-full rounded-lg"
                          width={80}
                          height={80}
                        />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={resetTraitImage}
            className="focus:outline-none text-black border-2 border-black bg-transparent font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2"
          >
            RESET
          </button>
          <button
            onClick={handleDownload}
            className="focus:outline-none text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2"
          >
            DOWNLOAD
          </button>
          <button
            onClick={handleMorph}
            className="focus:outline-none text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2"
          >
            MORPH
          </button>
        </div>
      </main>
    </div>
  );
}

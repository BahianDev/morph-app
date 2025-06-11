"use client";

import { config } from "@/app/wagmi";
import Card from "@/components/morphys/Card";
import { useAccount } from "wagmi";
import abi from "@/contracts/MorphysNFTS.abi.json";
import { useCallback, useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import axios from "axios";
import { MEME_CONTRACT_ADDRESS } from "@/constants";

export default function MemesList() {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<any[]>([]);

  const getNfts = useCallback(async () => {
    if (!address) return;

    setNfts([]);

    const supply = await readContract(config, {
      abi,
      address: MEME_CONTRACT_ADDRESS,
      functionName: "totalSupply",
    }).then((r) => Number(r));

    const loaded: any[] = [];
    for (let index = 0; index < supply; index++) {
      const tokenId = index + 1;
      const uri = await readContract(config, {
        abi,
        address: MEME_CONTRACT_ADDRESS,
        functionName: "tokenURI",
        args: [tokenId],
      }).then(String);

      const { data: metadata }: any = await axios.get(uri);

      // Quebra cache adicionando timestamp
      const cacheBustedImage = `${metadata.image}?ts=${Date.now()}`;

      loaded.push({
        tokenId,
        ...metadata,
        image: cacheBustedImage,
      });
    }

    setNfts(loaded);
  }, [address]);

  useEffect(() => {
    getNfts();
  }, [address, getNfts]);


  console.log(nfts)

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-20">
      <div className="flex flex-col items-center justify-center gap-6 bg-[rgb(217,217,217)] p-5 rounded-lg">
        <h1 className="text-5xl md:text-7xl text-white font-bold">
          <strong className="text-primary">MORPH’D</strong> MEMES
        </h1>
        <div className="flex flex-wrap w-full items-center justify-center gap-6">
          {nfts.length > 0 &&
            nfts.map((nft) => (
              <Card
                key={nft.tokenId}
                attributes={nft.attributes}
                image={nft.image}
                name={nft.name}
                id={nft.tokenId}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

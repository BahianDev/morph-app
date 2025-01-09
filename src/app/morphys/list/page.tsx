"use client";

import { config } from "@/app/wagmi";
import Card from "@/components/morphys/Card";
import { useAccount } from "wagmi";
import abi from "@/contracts/MorphysNFTS.abi.json";
import { useCallback, useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import axios from "axios";

export default function MorphysList() {
  const { address } = useAccount();

  const [nfts, setNfts] = useState<any[]>([]);

  const getNfts = useCallback(async () => {
    if (!address) return;

    const supply = await readContract(config, {
      abi,
      address: "0x094cd54bCC5eeC67c999a6E32C3dE2584726D918",
      functionName: "totalSupply",
    }).then((r) => Number(r));

    for (let index = 0; index < supply; index++) {
      const token = await readContract(config, {
        abi,
        address: "0x094cd54bCC5eeC67c999a6E32C3dE2584726D918",
        functionName: "tokenOfOwnerByIndex",
        args: [address, index],
      }).then((r) => Number(r));

      const uri = await readContract(config, {
        abi,
        address: "0x094cd54bCC5eeC67c999a6E32C3dE2584726D918",
        functionName: "tokenURI",
        args: [token],
      }).then((r) => String(r));

      const { data: metadata } = await axios.get(uri);

      console.log(metadata);
      setNfts((prev) => [...prev, metadata]);
    }
  }, [address]);

  useEffect(() => {
    getNfts();
  }, [address, getNfts]);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-20">
      <div className="flex flex-col items-center justify-center gap-6 bg-[rgb(217,217,217)] p-5 rounded-lg">
        <h1 className="text-7xl text-white font-bold">
          <strong className="text-primary">MORPH’D</strong> MORPHYS
        </h1>
        <div className="flex flex-wrap w-full items-center justify-center gap-6 ">
          {nfts &&
            nfts.length > 0 &&
            nfts.map((nft, key) => (
              <Card key={key} attributes={nft.attributes} image={nft.image} name={nft.name} />
            ))}
        </div>
      </div>
    </div>
  );
}

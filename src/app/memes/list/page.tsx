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

  // 1. Pega a quantidade total
  const supply = Number(
    await readContract(config, {
      abi,
      address: MEME_CONTRACT_ADDRESS,
      functionName: "totalSupply",
    })
  );

  // 2. Gera o array de tokenIds
  const tokenIds = Array.from({ length: supply }, (_, i) => i + 1);

  // 3. Em paralelo, busca todas as URIs
  const uriPromises = tokenIds.map((tokenId) =>
    readContract(config, {
      abi,
      address: MEME_CONTRACT_ADDRESS,
      functionName: "tokenURI",
      args: [tokenId],
    }).then(String)
  );
  const uris = await Promise.all(uriPromises);

  // 4. Em paralelo, faz todas as requisições HTTP
  const metadataPromises = uris.map((uri) =>
    axios.get(uri).then(({ data }) => data as any)
  );
  const metadatas = await Promise.all(metadataPromises);

  // 5. Anexa timestamp só uma vez e monta o array final
  const ts = Date.now();
  const loaded = metadatas.map((metadata, idx) => ({
    tokenId: tokenIds[idx],
    ...metadata,
    image: `${metadata.image}?ts=${ts}`,
  }));

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

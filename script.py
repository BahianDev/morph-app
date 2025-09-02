#!/usr/bin/env python3
import argparse
import json
from web3 import Web3

# ABI mínimo para o contrato de votação
VOTE_ABI = [
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "getPositiveVotes",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "getNegativeVotes",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nftCollection",
        "outputs": [{"internalType": "contract IERC721", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
]

# ABI mínimo para o ERC-721, incluindo totalSupply() e ownerOf()
ERC721_ABI = [
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "ownerOf",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
]

def parse_args():
    p = argparse.ArgumentParser(description="Snapshot de votos de TODOS os tokenIds")
    p.add_argument("--rpc",       required=True, help="URL do provedor RPC")
    p.add_argument("--contract",  required=True, help="Endereço do contrato de votação")
    p.add_argument("--top",   type=int, default=10,   help="Quantos top memes listar")
    p.add_argument("--output",     default="snapshot.json", help="Arquivo de saída JSON")
    return p.parse_args()

def main():
    args = parse_args()
    w3 = Web3(Web3.HTTPProvider(args.rpc))
    if not w3.is_connected():
        raise SystemExit("❌ Não foi possível conectar ao RPC.")

    vote_ct = w3.eth.contract(address=args.contract, abi=VOTE_ABI)

    # 1) Pegar o endereço da coleção NFT e instanciar contrato ERC-721
    col_addr = vote_ct.functions.nftCollection().call()
    nft_ct = w3.eth.contract(address=col_addr, abi=ERC721_ABI)

    # 2) Descobrir totalSupply e gerar lista de tokenIds
    total = nft_ct.functions.totalSupply().call()
    print(f"🔍 totalSupply = {total} tokens — varrendo IDs 1 a {total}")
    token_ids = range(1, total + 1)

    # 3) Para cada token, buscar votos positivos/negativos e owner
    snapshot = []
    for tid in token_ids:
        up   = vote_ct.functions.getPositiveVotes(tid).call()
        down = vote_ct.functions.getNegativeVotes(tid).call()
        owner = nft_ct.functions.ownerOf(tid).call()
        snapshot.append({
            "tokenId": tid,
            "owner": owner,
            "positive": up,
            "negative": down,
            "score": up + down
        })

    # 4) Ordenar e pegar top N pelo score (up + down)
    topN = sorted(snapshot, key=lambda x: x["score"], reverse=True)[: args.top]

    # 5) Salvar em JSON
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(topN, f, ensure_ascii=False, indent=2)

    print(f"✅ Top {args.top} memes salvos em {args.output}")

if __name__ == "__main__":
    main()

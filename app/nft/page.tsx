// components/NFTViewer.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Navbar from '@/components/navbar';
interface NFT {
  tokenUri: {gateway:string};
  contract: { address: string };
  id: { tokenId: string };
  title: string;
  media: { gateway: string }[];
}

export default function NFTViewer() {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
const { address: owner,isConnected } = useAccount();
  useEffect(() => {
    if (!owner) return;

    const fetchNFTs = async () => {
      setLoading(true);
      const baseURL = "https://base-sepolia.g.alchemy.com/v2";
      const apiKey = "8JqmMA_l0esg3gry-t6nyrpuiZkBVjJD";
      const url = `${baseURL}/${apiKey}/getNFTs?owner=${owner}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('NFTs:', data);
        setNFTs(data.ownedNfts || []);
      } catch (err) {
        console.error('Failed to fetch NFTs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [owner]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
        {/* <h1 className="text-3xl font-bold mb-6">NFT Viewer</h1> */}
        {!isConnected && (
            <p className="text-red-500 mb-4">Please connect your wallet to view NFTs.</p>
        )}
      {/* <h2 className="text-2xl font-bold mb-4">NFTs Owned by {owner?.slice(0, 6)}...</h2> */}
      {loading ? (
        <p>Loading NFTs...</p>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center mt-8">
          {nfts.map((nft, idx) => (
            <div key={idx} className="border p-4 rounded-lg shadow w-72">
              <img
                src={nft?.tokenUri?.gateway || '/placeholder.png'}
                alt={nft.title || `Token ${nft.id.tokenId}`}
                className="w-full h-60 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold">{nft.title || `Token ${nft.id.tokenId.slice(0, 6)}...${nft.id.tokenId.slice(-4)}`}</h3>
              <p className="text-sm text-gray-500 break-all">
                Contract: {nft.contract.address.slice(0, 6)}...{nft.contract.address.slice(-4)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

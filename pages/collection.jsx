import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ethers } from "ethers";
import { Button, color } from 'web3uikit'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json";
import NFTBox from '@/components/NFTCard'

export default function Home() {

  const { isWeb3Enabled, chainId } = useMoralis();

  const [assets, setAssets] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (isWeb3Enabled) {
      fetch(`http://localhost:4002/get-collection`)
        .then(response => response.json())
        .then(data => {
          setAssets(data.activeItems);
        })
    }
  }, [isWeb3Enabled])

  const chainString = chainId ? parseInt(chainId, 16).toString() : "5";
  const marketplaceAddress = networkMapping["Marketplace"][chainString];

  return (
    <>
      <div className='p-24 w-full'>
        {!assets
          ? (<div>Loading...</div>)
          : (
            assets.map((asset) => {
              return (
                <div className='w-1/4 mr-5' key={`${asset.nftAddress}${asset.tokenId}`}>
                  <a href={`/assets?id=${asset.tokenId}`}>
                    <NFTBox
                      marketplaceAddress={marketplaceAddress}
                      nftAddress={asset.nftAddress}
                      tokenId={asset.tokenId}
                      seller={asset.seller}
                      price={asset.price}
                      tokenUri={asset.tokenUri}
                    />
                  </a>
                </div>
              )
            })
          )
        }
      </div>
    </>
  )
}
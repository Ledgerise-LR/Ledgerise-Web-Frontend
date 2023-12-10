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
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';
import blockExplorerMapping from "../constants/blockExplorerMapping.json";


export default function Home() {

  const { isWeb3Enabled, chainId } = useMoralis();

  const [collections, setCollections] = useState([]);

  const router = useRouter();

  const [ethToUsdRate, setEthToUsdRate] = useState(null);

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      const rate = await getEthToUsdRate();
      setEthToUsdRate(rate);
    };

    fetchEthToUsdRate();
  }, []);


  useEffect(() => {
    fetch(`http://localhost:4000/get-all-collections`)
      .then(response => response.json())
      .then(data => {
        setCollections(data.subcollections);
      })
  }, [])

  const chainString = chainId ? parseInt(chainId, 16).toString() : "5";
  const marketplaceAddress = networkMapping["Marketplace"][chainString];

  return (
    <>
      <div className='px-48 py-20 w-full flex flex-1'>
        {!collections
          ? (<div>Loading...</div>)
          : (
            collections.map((collection) => {
              return (
                <a className='w-1/3 mr-4' href={`/collection?id=${collection.itemId}`}>
                  <div className='w-full mr-5 aspect-square border-2 rounded flex flex-col p-4' key={`${collection.itemId}`}>
                    <div className='w-full aspect-video border-2'>
                      <img className='w-full' src={`${collection.image}`} alt={collection.name} />
                    </div>
                    <div className='text-slate-800 text-2xl my-3 flex flex-1 justify-between items-center'>
                      <div>{collection.name}</div>
                      <div className='w-2/3 px-4 rounded-full py-2 bg-black flex-col text-slate-50 flex items-baseline justify-center'>
                        <span className='text-lg mr-1 -mb-1'>{(collection.totalRaised * ethToUsdRate).toFixed(0)}$</span>
                        <span className='text-xs text-slate-300'>total raised</span>
                      </div>
                    </div>
                    <div className=''>
                      <span className='text-slate-600 text-sm'>Supporting </span>
                      <span className='text-slate-700 text-sm'>{collection.charityName}</span>
                    </div>
                    <div className=''>
                      <a href='' className='text-sm text-slate-700'>{(collection.charityAddress).slice(0, 6) + "..." + (collection.charityAddress).slice(collection.charityAddress.length - 6, collection.charityAddress.length)} </a>
                      <a href='' className='text-slate-600 text-xs underline'>verified charity address</a>
                    </div>
                  </div>
                </a>
              )
            })
          )
        }
      </div>
    </>
  )
}
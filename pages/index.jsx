import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

import { Button } from 'web3uikit'

export default function Home() {

  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const { isWeb3Enabled } = useMoralis();

  const [asset, setAsset] = useState({
    tokenUri: "ipfs://",
    tokenId: "0",
    totalRaised: "0",
    collectionName: "-",
    charityAddress: "0x",
  });

  useEffect(() => {
    const randomAssetInterval = setInterval(() => {
      fetch("http://localhost:4004/get-random-featured-nft")
        .then(response => response.json())
        .then(data => {
          const asset = {
            tokenId: data.data.tokenId,
            tokenUri: data.data.tokenUri,
            totalRaised: data.data.totalRaised,
            collectionName: data.data.collectionName,
            charityAddress: data.data.charityAddress,
            nftAddress: data.data.nftAddress
          }
          setAsset(asset);
        })
      console.log("Oye!");
    }, 3000);
    return () => clearInterval(randomAssetInterval);
  }, []);

  async function updateUI() {
    // get the token Uri
    // using the image tag from tokenURI, get the image

    const tokenUri = asset.tokenUri;
    if (tokenUri && asset) {
      // IPFS Gateway: return ipfs files from a normal url
      const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenUriResponse = await (await fetch(requestUrl)).json();
      const imageURI = tokenUriResponse.image
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenUriResponse.name);
      setTokenDescription(tokenUriResponse.description)
    }
  }

  useEffect(() => {
    if (isWeb3Enabled && asset) {
      updateUI();
    }
  }, [isWeb3Enabled, asset])

  return (
    <div className='w-full h-full p-28'>
      <div className='w-full h-full flex justify-center items-center'>
        <div className='flex flex-1 w-3/5 h-4/5 justify-between'>
          <div className='flex-col'>
            <div>
              <div className='text-6xl font-serif w-1/2'>Collect NFTs Saving The World</div>
              <div className='text-2xl text-slate-500 mt-12 font-serif'>Start collecting digital art that raise funds for charities.</div>
            </div>
            <div className='w-1/2 mt-16'>
              <a href="/collections">
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white"
                  }}
                  customize={{
                    onHover: "lighten",
                    color: "white"
                  }}
                  isFullWidth="true"
                  text='Browse Collections'
                  theme='custom'
                  size='xl'
                />
              </a>
            </div>
          </div>
          <div className={`w-1/2 h-max ${imageURI ? `animate-fade` : ``}`}>
            <div className='h-max flex flex-1 flex-col justify-center w-4/5 border-2 p-2 rounded'>
              <img src={imageURI} alt={tokenName} className='border-b-2 rounded' />
              <div className='w-full h-max mt-2 p-2'>
                <div className='text-2xl text-slate-800 font-medium mb-1'>{asset.collectionName} Collection</div>
                <div className='flex flex-1 justify-between items-center'>
                  <div>
                    <span className='text-sm text-slate-500'>#{asset.tokenId} </span>
                    <span className='uppercase text-xl text-slate-700'>{tokenName}</span>
                  </div>
                  <div className='flex-col flex items-end'>
                    <div className='text-xs text-slate-500'>Total raised:</div>
                    <div className='w-36 mt-1 p-2 rounded-full bg-black text-slate-100 flex justify-end items-center px-5'>
                      <span className='text-slate-200'>{asset.totalRaised} ETH</span>
                      <span className='text-sm text-slate-400'>($$)</span>
                    </div>
                  </div>

                </div>
                <div>{asset.charityName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

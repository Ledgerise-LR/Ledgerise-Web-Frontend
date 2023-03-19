import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { ethers } from "ethers";
import { Button, color } from 'web3uikit'

export default function Home() {

  const { isWeb3Enabled } = useMoralis();

  const [asset, setAsset] = useState({});
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const router = useRouter();
  const tokenId = router.query.id

  useEffect(() => {
    if (tokenId) {
      fetch(`http://localhost:4001/get-asset?tokenId=${tokenId}`)
        .then(response => response.json())
        .then(data => {
          data.activeItem.seller = data.activeItem.seller.slice(0, 6) + "..." + data.activeItem.seller.slice(data.activeItem.seller.length - 6, data.activeItem.seller.length);
          data.activeItem.charityAddress = data.activeItem.charityAddress.slice(0, 6) + "..." + data.activeItem.charityAddress.slice(data.activeItem.charityAddress.length - 6, data.activeItem.charityAddress.length);
          data.activeItem.price = ethers.utils.formatEther(data.activeItem.price, "ether");
          setAsset(data.activeItem)
        })
    }
  }, [tokenId, isWeb3Enabled])

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
    <>
      <div className='w-full h-screen py-20 px-40'>
        <div className='flex flex-1 items-end relative'>
          <div className='border-2'>
            <Image loader={() => imageURI} src={imageURI} width="500" height="100" />
          </div>
          <div className='p-5'>
            <div className='absolute top-0 flex flex-1 items-center'>
              <div>
                <div className='mr-5 text-xl text-slate-700'>Supporting AHBAP Foundation</div>
                <div className='mr-5 text-slate-800 mt-1'>
                  <span className='text-sm'>{asset.charityAddress} </span>
                  <a href="" className='text-xs underline text-cyan-900'>view on Etherscan</a>
                </div>
              </div>
              <div className='h-16 aspect-square ml-5 bg-slate-800 border-2 rounded-full'></div>
            </div>
            <div className='mb-3'>
              <div className='mr-5 text-xl text-slate-400'> #{tokenId}</div>
              <span className='text-slate-900 text-6xl'>{tokenName.toUpperCase()}</span>
            </div>
            <div className='flex flex-1 items-center mt-5 mb-10'>
              <div className='border-2 rounded-full bg-black h-10 aspect-square mr-2'></div>
              <div>
                <div className='text-slate-500 text-xs'>Artist</div>
                <div className='text-slate-700 text-sm'>{asset.seller}</div>
              </div>
            </div>
            <div className='text-slate-500'>{asset.availableEditions} editions available</div>
            <hr />
            <div>
              <div className='text-sm text-slate-500 mt-3'>Current price:</div>
              <div className='flex items-center justify-between w-96'>
                <div>
                  <span className='text-3xl font-semibold'>{asset.price} </span>
                  <span className='text-slate-500'>ETH</span>
                </div>
                <div className='w-60'>
                  <Button isFullWidth="true" theme='primary' type='button' text='Buy Item' style={{
                    border: "black",
                    height: "3rem",
                    borderRadius: "100px",
                    fontSize: "16px",
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-7'>
          <div>
            <div>
              <div className='text-3xl text-slate-900 mb-3'>Description</div>
              <div className='text-slate-700'>{tokenDescription}</div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  )
}
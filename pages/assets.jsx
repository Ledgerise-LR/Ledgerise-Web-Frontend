import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ethers } from "ethers";
import { Button, color, Blockie, useNotification } from 'web3uikit'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json"

export default function Home() {

  const { isWeb3Enabled, chainId, account } = useMoralis();

  const [asset, setAsset] = useState({
    seller: "0x0000000",
    nftAddress: "0x0000000",
    tokenId: "0",
    charityAddress: "0x0000000",
    tokenUri: "ipfs://",
    price: 1000000000000000,
    availableEditions: 0,
  });
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [collection, setCollection] = useState({
    charityName: ""
  });

  const router = useRouter();
  const tokenId = router.query.id
  const dispatch = useNotification();

  const handleBuyItemSuccess = async () => {
    dispatch({
      type: "success",
      message: "Tx successful: item bought",
      title: "Transaction Success",
      position: "topR"
    });

    const urlRoot = `https://testnets.opensea.io/collection/fundraising-main-collection?search[owner][address]=`
    const openSeaUrl = `${urlRoot}/${account}`
    console.log(openSeaUrl);
  }

  const handleBuyItemError = async () => {
    dispatch({
      type: "error",
      message: "Sorry for the error. Please refresh and try again.",
      title: "Transaction failed",
      position: "topR"
    })
  }

  useEffect(() => {
    if (tokenId) {
      fetch(`http://localhost:4004/get-asset?tokenId=${tokenId}`)
        .then(response => response.json())
        .then(data => {
          const asset = {
            seller: data.activeItem.seller,
            nftAddress: data.activeItem.nftAddress,
            tokenId: data.activeItem.tokenId,
            charityAddress: data.activeItem.charityAddress,
            tokenUri: data.activeItem.tokenUri,
            price: data.activeItem.price,
            availableEditions: data.activeItem.availableEditions,
            subcollectionId: data.activeItem.subcollectionId
          }
          setAsset(asset);
          fetch(`http://localhost:4004/get-single-collection?id=${asset.subcollectionId}`)
            .then(response => response.json())
            .then(data => {
              setCollection(data.subcollection);
            })
        })
    }
  }, [tokenId, isWeb3Enabled])

  const chainString = chainId ? parseInt(chainId, 16).toString() : "5";

  const marketplaceAddress = networkMapping["Marketplace"][chainString];
  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    params: {
      nftAddress: asset.nftAddress,
      tokenId: asset.tokenId,
      charityAddress: asset.charityAddress,
      tokenUri: asset.tokenUri
    },
    msgValue: asset.price
  })

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
                <div className='mr-5 text-xl text-slate-700'>Supporting {collection.charityName}</div>
                <div className='mr-5 text-slate-800 mt-1'>
                  <span className='text-sm'>{asset.charityAddress.slice(0, 6) + "..." + asset.charityAddress.slice(asset.charityAddress.length - 6, asset.charityAddress.length)} </span>
                  <a href="" className='text-xs underline text-cyan-900'>view on Etherscan</a>
                </div>
              </div>
              <div className='h-16 aspect-square ml-5 bg-slate-800 border-2 rounded-full'>
                <img className='rounded-full' src={collection.charityImage} alt={collection.charityName} />
              </div>
            </div>
            <div className='mb-3'>
              <div className='mr-5 text-xl text-slate-400'> #{tokenId}</div>
              <span className='text-slate-900 text-6xl'>{tokenName.toUpperCase()}</span>
            </div>
            <div className='flex flex-1 items-center mt-5 mb-10'>
              <div className='border-2 rounded-full h-10 aspect-square mr-2 flex items-center justify-center'>
                <Blockie className='' />
              </div>
              <div>
                <div className='text-slate-500 text-xs'>Artist</div>
                <div className='text-slate-700 text-sm'>{asset.seller.slice(0, 6) + "..." + asset.seller.slice(asset.seller.length - 6, asset.seller.length)}</div>
              </div>
            </div>
            <div className='text-slate-500'>{asset.availableEditions} editions available</div>
            <hr />
            <div>
              <div className='text-sm text-slate-500 mt-3'>Current price:</div>
              <div className='flex items-center justify-between w-96'>
                <div>
                  <span className='text-3xl font-semibold'>{ethers.utils.formatEther(asset.price, "ether")} </span>
                  <span className='text-slate-500'>ETH</span>
                </div>
                <div className='w-60'>
                  <Button isFullWidth="true" theme='primary' type='button' text='Buy Item' onClick={() => {
                    buyItem({
                      onSuccess: () => handleBuyItemSuccess(),
                      onError: (err) => handleBuyItemError()
                    });
                  }} style={{
                    border: "black",
                    height: "3rem",
                    borderRadius: "100px",
                    fontSize: "16px"
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
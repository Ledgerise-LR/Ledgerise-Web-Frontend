import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react';
import { useMoralis } from 'react-moralis';
import { ethers } from 'ethers';
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';
import { Button } from 'web3uikit'
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import { URL, PORT } from '@/serverConfig';
import dynamic from 'next/dynamic';

export default function Home() {

  const Map = useMemo(() => dynamic(
    () => import('@/components/DisplayMap'),
    {
      loading: () => <p>The map is loading...</p>,
      ssr: false
    }
  ), [])
  
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [previousTokenId, setPreviousTokenId] = useState(0);

  const { isWeb3Enabled } = useMoralis();

  const [asset, setAsset] = useState({
    tokenUri: "",
    tokenId: "0",
    totalRaised: "0",
    collectionName: "-",
    charityAddress: "0x",
    subcollectionId: "",
  });

  const [visualVerifications, setVisualVerifications] = useState([]);

  useEffect(() => {
    async function fetchAsset() {
      console.log(asset.tokenId);
      fetch(`${URL}:${PORT}/active-item/get-random-featured-asset?previousTokenId=${previousTokenId}`)
        .then(response => response.json())
        .then(data => {
          const asset = {
            tokenId: data.activeItem.tokenId,
            tokenUri: data.activeItem.tokenUri,
            totalRaised: data.activeItem.totalRaised,
            collectionName: data.activeItem.collectionName,
            charityAddress: data.activeItem.charityAddress,
            nftAddress: data.activeItem.nftAddress,
            subcollectionId: data.activeItem.subcollectionId,
            totalDonated: data.activeItem.totalDonated,
            price: data.activeItem.price
          }
          setAsset(asset);
        })
    }

    fetchAsset();


    const randomAssetInterval = setInterval(() => {
      fetchAsset();
    }, 4000);
    return () => clearInterval(randomAssetInterval);
  }, []);

  useEffect(() => {
    fetch(`${URL}:${PORT}/active-item/get-all-visual-verifications`)
    .then(response => response.json())
    .then(data => {
      setVisualVerifications(data.data);
      return;
    })
  }, [])

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
      setTokenDescription(tokenUriResponse.description);
      setPreviousTokenId(asset.tokenId);
    }
  }

  useEffect(() => {
    if (asset && asset.tokenUri) {
      updateUI();
    }
  }, [asset, asset.tokenUri])

  return (
    <div className='w-full h-full py-28 px-10 overflow-hidden'>
      <div className='w-full h-full flex justify-center items-center'>
        <div className='flex flex-1 w-3/5 h-4/5 justify-center flex-wrap'>
          <div className='flex-col w-128 mb-12'>
            <div className='w-full'>
              <div className='text-4xl w-1/2 font-playfair'>Güvenilir,{"\n"}Şeffaf,{"\n"}Değiştirilemez</div>
              <div className='text-xl text-slate-500 mt-12 font-serif'><strong>Gönül rahatlığıyla</strong> bağış yapın. Bağışınızın <strong>ihtiyaç sahibine ulaştığını</strong> görün.</div>
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
                  text='Kampanyaları görüntüleyin!'
                  theme='custom'
                  size='xl'
                />
              </a>
            </div>
          </div>
          <div className={`w-fit h-max ${imageURI ? `animate-fade` : ``}`}>
            <a href={`/assets?id=${asset.tokenId}&subcollectionId=${asset.subcollectionId}&nftAddress=${asset.nftAddress}`}>
              <div className='h-max flex flex-1 flex-col justify-center border-2 p-2 rounded'>
                <img src={imageURI} alt={tokenName} className='border-b-2 rounded h-96' />
                <div className='w-full h-max mt-2 p-2'>
                  <div className='text-2xl text-slate-800 font-medium mb-1'>{asset.collectionName}</div>
                  <div className='flex flex-1 justify-between items-center'>
                    <div>
                      <span className='text-sm text-slate-500'>#{asset.tokenId} </span>
                      <span className='uppercase text-xl text-slate-700'>{tokenName}</span>
                    </div>
                    <div className='flex-col flex items-end'>
                      <div className='text-xs text-slate-500'>Toplam Bağış:</div>
                      <div className='w-48 mt-1 p-2 rounded-full bg-black text-slate-100 flex justify-end items-center px-5'>
                        <span className='text-slate-200 mr-2'>{Number(asset.price)*asset.totalDonated} ₺</span>
                        <span className='text-xs text-slate-400'>{Number(asset.totalDonated)} bağış kolisi</span>
                      </div>
                    </div>
                  </div>
                  <div>{asset.charityName}</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className='w-full h-100 mt-4'>
        <div className='w-full mb-4 border-b pb-4 text-2xl'>%100 şeffaf bağış ağını keşfedin!</div>
        <Map
          center={{latitude: ((36 + 42) / 2) * 1000, longitude: ((26 + 45) / 2) * 1000}}
          visualVerifications={visualVerifications}
          zoom={6}
        />
      </div>
      <div className='mt-24 w-screen -ml-12 overflow-hidden'>
        <img className='w-screen' src="supplyChain.svg" alt="Supply chain" />
      </div>
    </div >
  )
}

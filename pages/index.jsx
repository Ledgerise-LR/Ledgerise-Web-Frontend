import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { ethers } from 'ethers';
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';
import { Button } from 'web3uikit'
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import { URL, PORT } from '@/serverConfig';

export default function Home() {

  const [ethToUsdRate, setEthToUsdRate] = useState(null);

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      const rate = await getEthToUsdRate();
      setEthToUsdRate(rate);
    };

    fetchEthToUsdRate();
  }, []);

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

  useEffect(() => {
    async function fetchAsset() {
      console.log(asset.tokenId);
      fetch(`${URL}:${PORT}/get-random-featured-nft?previousTokenId=${previousTokenId}`)
        .then(response => response.json())
        .then(data => {
          const asset = {
            tokenId: data.data.tokenId,
            tokenUri: data.data.tokenUri,
            totalRaised: data.data.totalRaised,
            collectionName: data.data.collectionName,
            charityAddress: data.data.charityAddress,
            nftAddress: data.data.nftAddress,
            subcollectionId: data.data.subcollectionId,
            totalDonated: data.data.totalDonated,
            price: data.data.price
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
              <div className='text-6xl w-1/2 font-playfair'>Güvenilir,{"\n"}Şeffaf,{"\n"}Değiştirilemez</div>
              <div className='text-2xl text-slate-500 mt-12 font-serif'><strong>Gönül rahatlığıyla</strong> bağış yapın. Bağışınızın <strong>ihtiyaç sahibine ulaştığını</strong> görün.</div>
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
            <a href={`/assets?id=${asset.tokenId}&subcollectionId=${asset.subcollectionId}`}>
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
      <div className='mt-16 w-screen -ml-12 overflow-hidden'>
        <img className='w-screen' src="supplyChain.svg" alt="Supply chain" />
      </div>
    </div >
  )
}

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

  const [asset, setAsset] = useState({
    tokenUri: "",
    tokenId: "0",
    totalRaised: "0",
    collectionName: "-",
    charityAddress: "0x",
    subcollectionId: "",
  });

  const [visualVerifications, setVisualVerifications] = useState([]);

  const [testimonials, setTestimonials] = useState([{
    name: "Ö*** K****",
    description: "Pazarlama uzmanı, Hepsiburada, Türkiye",
    testimonial: "Ledgerise sayesinde bu ramazanda yaptığım bağışın güvenle teslim edildiğini görebildim."
  },
  {
    name: "E*** K****",
    description: "Bankacı, BNP Paribas, Almanya",
    testimonial: "Ülke fark etmeksizin, bireysel rapor üzerinden tüm süreci takip edebiliyorum."
  },
  {
    name: "O*** S*******",
    description: "Avukat, Honeywell, Ukrayna",
    testimonial: "Yaptığım bağışları takip ederek teslimatın gerçekleşteğini görmek beni mutlu etti."
  },
  {
    name: "U**** D******",
    description: "CEO, Türkiye",
    testimonial: "Mükemmel bir insiyatif. Bağışımın doğru yerde kullanılması benim için farklı bir deneyim."
  }
  ]);

  useEffect(() => {
    async function fetchAsset() {
      
      const showroom = document.getElementById("showroom");
      showroom.style.opacity = 0.1;

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

          showroom.style.opacity = 1;

          if (window) {
            window.document.body.style.overflowX = "hidden";
          }
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

  const [sliderTranslate, setSliderTranslate] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setSliderTranslate(old => old - 100);
      
      try {
        const slider = window.document.getElementById("slider");

        for (let i = 0; i < testimonials.length; i++) {
          const eachChild = slider.children[i];
          const copyChild = eachChild.cloneNode(true);
          slider.appendChild(copyChild);  
        }  
      } catch (e) { ; }
    }, 2000)  
  }, [])

  useEffect(() => {
    if (asset && asset.tokenUri) {
      updateUI();
    }
  }, [asset, asset.tokenUri])

  return (
    <div className='w-full h-full py-28 px-10 overflow-hidden overflow-x-hidden'>
      <div className='w-64 left-0 top-36 h-64 bg-yellow-100 absolute z-0 rounded-full blur-3xl'></div>
      <div className='w-32 right-24 -mt-16 h-64 bg-yellow-200 absolute z-0 rounded-full'></div>
      <div className='w-96 right-0 mt-98 h-96 bg-yellow-400 absolute z-0 rounded-full'></div>
      <div className='w-96 right-0 mr-96 -mt-12 h-24 bg-yellow-300 absolute z-0 rounded-full'></div>
      <div className='w-full h-full flex justify-center items-center'>
        <div className='flex flex-1 w-3/5 h-4/5 justify-center flex-wrap'>
          <div className='flex-col w-128 mb-12 mr-8 z-10'>
            <div className='w-full'>
              <div 
              style={{
                background: "-webkit-linear-gradient(#FF9900, #B881FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }} 
              className='text-5xl w-96 h-fit py-2 font-bold font-sans pl-8'
              >
                <div>Güvenilir,</div>
                <div>Şeffaf,</div>
                <div>Değiştirilemez,</div>
              </div>
              <div className='text-xl text-slate-500 mt-12 font-sans w-96 pl-8'>Bağışınızın ihtiyaç sahibine ulaştığından <strong>emin olun</strong></div>
            </div>
            <div className='w-1/2 mt-32 z-10 pl-8'>
              <a href="/collections">
                <Button
                  style={{
                    backgroundColor: "#404040",
                    color: "#fefefe",
                    borderRadius: "100px"
                  }}
                  customize={{
                    onHover: "lighten",
                  }}
                  isFullWidth="true"
                  text='Kampanyaları görüntüleyin!'
                  theme='custom'
                  size='xl'
                />
              </a>
            </div>
          </div>
          <div className={`w-fit h-max relative bg-white z-10`}>
            <a href={`/assets?id=${asset.tokenId}&subcollectionId=${asset.subcollectionId}&nftAddress=${asset.nftAddress}`}>
              <div id='showroom' className={`w-96 h-108 flex flex-1 transition-all flex-col justify-center border-2 p-2 rounded`}>
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
                      <div style={{backgroundColor: "#343434"}} className='w-48 p-2 rounded-full text-slate-100 flex justify-end items-center px-5'>
                        <span className='text-slate-200 mr-2 text-sm'>{Number(asset.totalDonated)} bağış kolisi</span>
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
      <div className='w-full h-100 mt-16 mb-60'>
        <div className='w-full flex justify-center text-center text-sm pt-12 text-yellow-500 font-bold'>Teslim edildi bile!</div>
        <div className='w-full flex justify-center text-center border-b mb-4 pb-12 text-3xl'>%100 şeffaf bağış ağımızı keşfedin!</div>
        <Map
          center={{latitude: ((36 + 42) / 2) * 1000, longitude: ((26 + 45) / 2) * 1000}}
          visualVerifications={visualVerifications}
          zoom={6}
        />
      </div>
      <div className='mb-12 w-full h-fit'>
        <div className='w-full flex justify-center text-center text-sm text-yellow-500 font-bold'>Güvenle bağış yapanlar</div>
        <div className='w-full flex justify-center text-center border-b mb-4 pb-12 text-3xl'>Bağışçı gözünden Ledgerise...</div>
        <div className='w-fit h-fit flex pb-4' style={{transform: `translateX(${sliderTranslate}px)`, transition: "all 2s ease"}} id='slider'>
          {
            testimonials.map(eachTestimonial => {
              return (
                <div className='w-96 shadow-lg rounded-md p-4 mr-4'>
                  <div className='mb-8 text-end w-full text-slate-800'>"{eachTestimonial.testimonial}"</div>
                  <div className='flex items-center justify-end'>
                    <div>
                      <div className='text-end text-slate-600'>{eachTestimonial.name}</div>
                      <div className='text-end text-slate-400'>{eachTestimonial.description}</div>
                    </div>
                    <div className='w-12 h-12 ml-4 rounded-full bg-slate-400'></div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className='text-3xl my-12 relative h-12'>
        <div className='z-0 absolute w-52 h-52 -left-40 rounded-full bg-yellow-400'></div>
        <div style={{color: "#343434"}} className='z-20 absolute'>ADIM ADIM LEDGERISE</div>
      </div>
      <div className='w-screen -ml-12 overflow-hidden'>
        <img className='w-screen' src="supplyChain.svg" alt="Supply chain" />
      </div>
    </div >
  )
}

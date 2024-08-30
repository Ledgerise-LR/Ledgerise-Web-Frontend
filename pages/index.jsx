import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react';
import {Linkedin, Twitter, ExternalLink} from '@web3uikit/icons'
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


  const [windowSize, setWindowSize] = useState({
    width: "",
    height: ""
  });
  useEffect(() => {

    const handleResize = () => {
      const hamburgerMenu = document.getElementById("hamburger-menu");
      hamburgerMenu.style.left = `-${window.innerWidth}px`;
      hamburgerMenu.style.display = "block";
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const pressLinks = [
    {
      title: "Ledgerise, yardım kampanyalarında yerel yönetimler ile işbirliği içerisinde",
      photo: "/basin_sosyalup.png",
      link: "https://sosyalup.net/ledgerise-yardim-kampanyalarinda-yerel-yonetimler-ile-isbirligi-icerisinde/",
      twitter: "https://x.com/SosyalUp/status/1808470752657850425",
      linkedin: "https://www.linkedin.com/pulse/sosyalup-b%C3%BClten-sosyal-up-gjfbf/"
    },
    {
      title: "Yerel yönetim yardım kampanyalarında Ledgerise",
      photo: "/basin_ict.png",
      link: "https://ictmedia.com.tr/haber/ledgerise-yardim-kampanyalarinda-yerel-yonetimler-ile-isbirligi-icerisinde",
      twitter: "https://x.com/ictmedia_tr/status/1808489458607575041",
      linkedin: "https://www.linkedin.com/posts/ictmedya_ledgerise-yard%C4%B1m-kampanyalar%C4%B1nda-yerel-y%C3%B6netimler-activity-7214255177443254273-VUDl/?originalSubdomain=tr"
    },
    {
      title: "BASIN AÇIKLAMASI - Ledgerise: bağışları takip edilebilir kılan yenilikçi bir çözüm...",
      photo: "/basin_matriks.png",
      link: "https://www.matriksdata.com/website/matriks-haberler/sirket/5231423-ledgerise-bagislari-takip-edilebilir-kilan-yenilikci-bir-cozum-sunuyor-basin-aciklamasi",
      twitter: "https://x.com/SosyalUp/status/1808470752657850425",
      linkedin: "https://www.linkedin.com/pulse/sosyalup-b%C3%BClten-sosyal-up-gjfbf/"
    }
  ]

  return (
    <div className='w-full h-full pt-24 pb-28 px-10 overflow-hidden overflow-x-hidden'>
      <div className='w-64 left-0 hidden top-72 h-64 bg-pink-100 absolute z-0 rounded-full blur-2xl'></div>
      <div className='w-32 right-24 -mt-16 h-64 bg-pink-200 absolute z-0 rounded-full'></div>
      <div className='w-96 right-0 mt-98 h-96 bg-pink-400 absolute z-0 rounded-full'></div>
      <div className='w-full h-full flex justify-center items-center'>
        <div className='flex flex-1 w-3/5 h-4/5 justify-center flex-wrap'>
          <div className='flex-col w-128 mb-12 z-10'>
            <div className='w-full'>
              <div 
              style={{
                background: "-webkit-linear-gradient(80deg, #B881FF, #FF9900)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }} 
              className={`text-5xl h-fit py-2 font-bold font-sans flex flex-col ${windowSize.width < 800 ? "text-4xl items-center" : ""}`}
              >
                <div>Sürdürülebilir,</div>
                <div>Sorumlu,</div>
                <div>Kârlı.</div>
              </div>
              <div className={`text-lg text-gray-500 mt-8 font-sans w-100 ${windowSize.width < 800 ? "text-md text-center w-96" : "text-lg"}`}>Atıl olma potansiyeline sahip ürünler, %50'ye varan indirimli fiyatı üzerinden Ledgerise'da listelenir. Ürünleri ortaklaşa bağışlanarak ihtiyaç sahiplerine en güvenli şekilde ulaşır.</div>
              <div className='w-full h-24 mt-8 flex'>
                <div className='w-1/2 flex items-center justify-center'>
                  <div className='font-semibold mr-4 text-4xl flex text-gray-700'>5<div className='-mt-0.5'>+</div></div>
                  <div className='font-light'>PAYDAŞ</div>
                </div>
                <div className='h-full w-0.5 bg-gray-600 bg-opacity-50'></div>
                <div className='w-1/2 flex items-center justify-center'>
                  <div className='font-semibold mr-4 text-4xl flex text-gray-700'>130 <div className='-mt-0.5'>+</div></div>
                  <div className='font-light w-24'>KOLİ İŞLEM HACMİ</div>
                </div>              
              </div>
            </div>
            <div className='w-1/2 mt-24 z-10'>
              <a href="/collections">
                <Button
                  style={{
                    backgroundColor: "#464646",
                    color: "#fefefe",
                    borderRadius: "5px"
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
                  <div className='text-2xl text-gray-700 font-medium mb-1'>{asset.collectionName}</div>
                  <div className='flex flex-1 justify-between items-center'>
                    <div>
                      <span className='text-sm text-gray-500'>#{asset.tokenId} </span>
                      <span className='uppercase text-xl text-gray-600'>{tokenName}</span>
                    </div>
                    <div className='flex-col flex items-end'>
                      <div className='text-xs text-gray-500'>Toplam Bağış:</div>
                      <div style={{backgroundColor: "#464646"}} className='w-36 p-2 rounded text-slate-100 flex justify-end items-center px-5'>
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
      <div className='w-full h-100 mt-16 mb-60 relative'>
        <div style={{ width: "150%", transform: "rotate(-20deg)" }} className='bg-[linear-gradient(0deg,rgba(255,153,0,0.5)_0%,rgba(184,129,255,0.5)_100%)] absolute z-10 h-24 mt-80 -ml-36'></div>
        <div style={{background: "-webkit-linear-gradient(#FF9900, #B881FF)",}} className='absolute w-60 h-32 blur-3xl left-12 top-36 z-0'></div>
        <div className='w-full flex justify-center text-center text-sm pt-12 text-yellow-500 font-bold'>Teslim edildi bile!</div>
        <div className='w-full flex justify-center text-center border-b mb-4 pb-12 text-3xl'>%100 şeffaf bağış ağımızı keşfedin!</div>
          <Map
            center={{latitude: ((41.3202 + 40.8021) / 2) * 1000, longitude: ((28.5316 + 29.5983) / 2) * 1000}}
            visualVerifications={visualVerifications}
            zoom={10}
          />
      </div>
      <div className='mb-12 w-full h-fit'>
        <div className='w-full flex justify-center text-center text-sm text-yellow-500 font-bold'>Gönül rahatlığıyla...</div>
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
      <div>
        <div className='text-3xl my-12 relative h-12'>
          <div className='z-0 absolute w-52 h-52 -left-40 rounded-full bg-yellow-400'></div>
          <div style={{color: "#343434"}} className='z-20 absolute'>
            <div>BASINDA LEDGERISE</div>
            <div className='text-lg'>Yerel yönetimlerin bağış kampanyalarına sağladığımız şeffaf takip hizmeti ile...</div>
          </div>
        </div>
        <div className='w-full flex justify-center flex-wrap'>
          {
            pressLinks
              ? pressLinks.map(eachPressLink => {
                return(
                  <a href={eachPressLink.link} target='_blank' className='w-96 aspect-square shadow-md mr-4 mt-8 relative flex flex-col justify-end cursor-pointer hover:brightness-75 transition-all'>
                    <img src={eachPressLink.photo} alt={eachPressLink.photo} className='w-full h-full absolute z-0' />
                    <div className='z-20 w-full h-fit bg-opacity-50 bg-blue-500 p-4'>
                      <div className='text-gray-50 text-sm uppercase font-bold'>{eachPressLink.title}</div>
                      <div className='flex w-full items-center'>
                        <a className='mr-4' href={eachPressLink.linkedin}><Linkedin fontSize='20px'/></a>
                        <a className='mr-4' href={eachPressLink.twitter}><Twitter fontSize='20px'/></a>
                        <a className='mr-4' href={eachPressLink.link}><ExternalLink fontSize='20px'/></a>
                      </div>
                    </div>
                  </a>
                )
              })
              : ("")
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

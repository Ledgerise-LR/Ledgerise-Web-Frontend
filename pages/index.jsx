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
import {Trending} from '@web3uikit/icons'

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
    name: "Özge K.",
    description: "Pazarlama Uzmanı, Türkiye",
    testimonial: "Ledgerise sayesinde bu ramazanda yaptığım bağışın güvenle teslim edildiğini görebildim.",
    photo: "ozge.png"
  },
  {
    name: "Esen K.",
    description: "Bankacı, Almanya",
    testimonial: "Ülke fark etmeksizin, bireysel rapor üzerinden tüm süreci takip edebiliyorum.",
    photo: "esen.png"
  },
  {
    name: "Olga S.",
    description: "Avukat, Ukrayna",
    testimonial: "Yaptığım bağışları takip ederek teslimatın gerçekleşteğini görmek beni mutlu etti.",
    photo: "olga.png"
  },
  {
    name: "Uygar D.",
    description: "İş İnsanı, Türkiye",
    testimonial: "Mükemmel bir insiyatif. Bağışımın doğru yerde kullanılması benim için farklı bir deneyim.",
    photo: "uygarbey.png"
  }
  ]);

  useEffect(() => {
    async function fetchAsset() {
      
      const showroom = document.getElementById("showroom");
      showroom.style.filter = "opacity(0.8)";

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

          showroom.style.filter = "opacity(1)";

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
      source: "SosyalUp Magazini",
      link: "https://sosyalup.net/ledgerise-yardim-kampanyalarinda-yerel-yonetimler-ile-isbirligi-icerisinde/",
      twitter: "https://x.com/SosyalUp/status/1808470752657850425",
      linkedin: "https://www.linkedin.com/pulse/sosyalup-b%C3%BClten-sosyal-up-gjfbf/"
    },
    {
      title: "Yerel yönetim yardım kampanyalarında Ledgerise",
      photo: "/basin_ict.png",
      source: "ICT Media",
      link: "https://ictmedia.com.tr/haber/ledgerise-yardim-kampanyalarinda-yerel-yonetimler-ile-isbirligi-icerisinde",
      twitter: "https://x.com/ictmedia_tr/status/1808489458607575041",
      linkedin: "https://www.linkedin.com/posts/ictmedya_ledgerise-yard%C4%B1m-kampanyalar%C4%B1nda-yerel-y%C3%B6netimler-activity-7214255177443254273-VUDl/?originalSubdomain=tr"
    },
    {
      title: "BASIN AÇIKLAMASI - Ledgerise: bağışları takip edilebilir kılan yenilikçi bir çözüm...",
      photo: "/basin_matriks.png",
      source: "Matriks",
      link: "https://www.matriksdata.com/website/matriks-haberler/sirket/5231423-ledgerise-bagislari-takip-edilebilir-kilan-yenilikci-bir-cozum-sunuyor-basin-aciklamasi",
      twitter: "https://x.com/SosyalUp/status/1808470752657850425",
      linkedin: "https://www.linkedin.com/pulse/sosyalup-b%C3%BClten-sosyal-up-gjfbf/"
    }
  ]

  const RetailChain = [
    {
      photo: "supplyChain1.svg",
      alt: "donate",
      span: "Güvenle",
      title: "BAĞIŞLA",
      description: "“Nasıl bağış yapılır?” sekmesinden bağış yapmak istediğiniz kampanyaya tıklayın. Bağışınızı yaparken kampanyayı yürüten kuruluşa e-posta adresinizi belirtmeniz gerekir."
    },
    {
      photo: "supplyChain2.svg",
      alt: "match",
      span: "Anında",
      title: "EŞLENDİ",
      description: "Siz bağış yapar yapmaz adınıza bir karekod oluşturulur. Bu karekod bağışınızın üzerinde yer alır ve dağıtım görevlileri tarafından üretim, depo ve teslimatta taratılır."
    },
    {
      photo: "supplyChain3.svg",
      alt: "delivery",
      span: "%100 Şeffaf",
      title: "TESLİMAT",
      description: "Taratılma gerçekleştiği anda kolinin görüntüsü, lokasyonu ve zaman damgası anında blokzincire kaydedilir. Size gelen mailler üzerinden bağışınızın ihtiyaç sahibine ulaştığından emin olursunuz."
    }
  ]
  
  const partnerImages = ["sancaktepe.png", "marjinalsosyal.png", "sevvakfi.png", "iparet.png"];

  return (
    <div className={`w-full h-full pb-28 ${windowSize.width < 800 ? "px-0 pt-40" : "px-20 pt-24"} overflow-hidden overflow-x-hidden`}>
      <div className={`w-96 right-20 -mt-8 h-128 bg-[linear-gradient(20deg,rgba(80,0,100,1)_0%,rgba(80,40,0,1)_75%)] absolute z-0 rounded-lg ${windowSize.width < 1200 ? "hidden" : ""}`}></div>
      <div className={`w-full h-full flex ${windowSize.width < 800 ? "justify-center" : "justify-between"} items-center`}>
        <div className={`flex flex-1 w-3/5 h-4/5 ${windowSize.width < 800 ? "justify-center" : "justify-between"} px-10 flex-wrap`}>
          <div className='flex-col w-128 mb-12 z-10'>
            <div className='w-full'>
              <div 
              className={`h-fit -mt-2 font-bold font-sans flex flex-col ${windowSize.width < 800 ? "text-4xl" : "text-6xl"}`}
              >
                <div className='mb-2 text-slate-900'>Stok Fazlalarını</div>
                <div style={{
                background: "-webkit-linear-gradient(30deg, #B881FF, #FF9900)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }} className='pb-2 w-fit'>Değere</div>
                <div className='text-slate-900'>Dönüştürüyoruz</div>
              </div>
              <div className={`text-lg text-black mt-8 font-sans w-full ${windowSize.width < 800 ? "text-md w-96" : "text-lg"}`}>
                <div className='flex items-center'><div className='p-1 bg-[rgb(50,0,20)] text-white rounded-full mr-2'><Trending fontSize='16px'/></div> Stokların %5'i, %50'ye varan indirimli fiyatı üzerinden listelenir.</div>
                <div className='flex items-center'><div className='p-1 bg-[rgb(50,0,20)] text-white rounded-full mr-2'><Trending fontSize='16px'/></div>Ürünler pay bazlı olarak ortaklaşa bağışlanır.</div>
                <div className='flex items-center'><div className='p-1 bg-[rgb(50,0,20)] text-white rounded-full mr-2'><Trending fontSize='16px'/></div>Bağışçıların ürünlerin doğru ihtiyaç sahiplerine ulaştığından emin olması sağlanır.</div>
              </div>
              <div className='w-full h-12 mt-8 flex'>
                <div className='w-1/2 flex items-center justify-center'>
                  <div className='font-semibold mr-4 text-3xl flex text-black'>5<div className='-mt-0.5'>+</div></div>
                  <div className='text-xs font-bold'>PARTNER</div>
                </div>
                <div className='h-full w-0.5 bg-gray-600 bg-opacity-50'></div>
                <div className='w-1/2 flex items-center justify-center'>
                  <div className='font-semibold mr-4 text-3xl flex text-black'>100 <div className='-mt-0.5'>+</div></div>
                  <div className='w-fit font-bold text-xs'>AYLIK KOLİ</div>
                </div>              
              </div>
            </div>
            <div className='flex items-center'>
              <div className='w-fit mr-6 mt-10 z-10'>
                <a href="/collections">
                  <div className={`p-4 bg-[rgb(255,168,82)] border-2 border-[rgb(255,168,82)] text-center text-black font-bold rounded tracking-wide ${windowSize.width < 800 ? "text-sm" : ""}`}>Kampanyaları Keşfet</div>
                </a>
              </div>
              <div className='w-fit mt-10 z-10'>
                <a href="/login">
                  <div className={`p-4 bg-white border-2 text-center border-black text-black font-bold rounded tracking-wide ${windowSize.width < 800 ? "text-sm" : ""}`}>Bağış Raporunu Görüntüle</div>
                </a>
              </div>
            </div>
            <div className='w-full h-20 mt-4'>
              <div className='text-sm mb-2 text-gray-800 font-light'>Proje Paydaşlarımız</div>
              <div className='flex w-full h-6'>
                {
                  partnerImages.map(eachPartnerImage => {
                    return (
                      <div className='w-fit h-full overflow-hidden mr-4'>
                        <img className='w-full h-full' src={eachPartnerImage} alt={eachPartnerImage} />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className={`w-96 h-fit relative bg-white z-10 rounded ${windowSize.width < 800 ? "mt-20" : ""}`}>
            <a href={`/assets?id=${asset.tokenId}&subcollectionId=${asset.subcollectionId}&nftAddress=${asset.nftAddress}`}>
              <div id='showroom' className={`w-96 h-fit flex flex-1 transition-all bg-white flex-col justify-center border-2 overflow-hidden border-black p-2 rounded -mt-12`}>
                <img src={imageURI} alt={tokenName} className='border-b-2 border-b-black h-96' />
                <div className='w-full h-max mt-2 p-2'>
                  <div className='text-2xl text-black mb-1 h-16 flex items-center'>{asset.collectionName}</div>
                  <div className='flex flex-1 justify-between items-center'>
                    <div>
                      <div className='text-sm text-gray-500'>#{asset.tokenId} </div>
                      <div className='uppercase text-black text-sm h-12'>{tokenName}</div>
                    </div>
                    <div className='flex-col flex items-end'>
                      <div className='text-xs text-black'>Toplam Bağış:</div>
                      <div style={{backgroundColor: "#000"}} className='w-36 p-2 rounded text-white flex justify-end items-center px-5'>
                        <span className='text-white mr-2 text-sm'>{Number(asset.totalDonated)} bağış kolisi</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-sm my-4 p-2 bg-gray-50 rounded text-black'>{tokenDescription.slice(0,80)}</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className='w-[114%] -ml-[7%] h-100 mt-16 mb-60 relative'>
        <div className='w-full flex justify-center text-center text-sm pt-12 text-yellow-500 font-bold'>Teslim edildi bile!</div>
        <div className='w-full flex justify-center text-center border-b mb-4 pb-12 text-3xl'>%100 şeffaf ve güvenilir bağış ağını keşfedin!</div>
          <Map
            center={{latitude: ((41.4202 + 40.8021) / 2) * 1000, longitude: ((28.4316 + 29.5983) / 2) * 1000}}
            visualVerifications={visualVerifications}
            zoom={10}
          />
      </div>
      <div className='mb-12 w-full h-fit'>
        <div className='w-full flex justify-center text-center text-sm text-yellow-500 font-bold'>Gönül rahatlığıyla...</div>
        <div className='w-full flex justify-center text-center border-b mb-4 pb-12 text-3xl'>Bağışçı gözünden...</div>
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
                    <div className='w-12 h-12 ml-4 rounded-full overflow-hidden'>
                      <img className='w-full h-full' src={eachTestimonial.photo} />
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div style={{color: "#343434"}} className='z-20 mt-20'>
        <div className='w-full flex justify-center text-center text-sm pt-12 text-yellow-500 font-bold'>İÇİNİZ RAHAT OLSUN!</div>
        <div className='w-full flex justify-center text-center border-b mb-4 pb-12 text-3xl'>Bağışınızın doğru ihtiyaç sahibine ulaştığından emin olmanızı sağlıyoruz.</div>
      </div>
      <div style={{ background: "-webkit-linear-gradient(90deg, #B881FF, #FF9900)" }}>        
        {
          RetailChain.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-8 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'} max-w-7xl mx-auto my-4 p-4`} key={index}>
                <div className='w-full md:w-1/2'>
                  <img 
                    src={item.photo} 
                    alt={item.alt} 
                    className="w-full h-auto max-h-80 md:max-h-96"
                  />
                </div>
                <div className='w-full md:w-1/2 p-4 flex flex-col justify-center gap-1 md:gap-5'>
                  <div className=''>
                    <span className='text-base md:text-xl text-white'>{item.span}</span>
                    <h2 className='text-3xl md:text-5xl font-bold text-white'>{item.title}</h2>
                  </div>
                  <div className='text-base md:text-2xl text-neutral-700 bg-white p-4 md:p-8 rounded-md'>
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
      <div>
        <div className='text-3xl my-12 relative h-12 mb-24'>
          <div style={{color: "#343434"}} className='z-20 mb-12'>
            <div className='w-full flex justify-center text-center text-sm pt-12 text-yellow-500 font-bold'>GÜNCEL HABERLER</div>
            <div className='w-full flex justify-center text-center mb-4 pb-12 text-3xl'>Popüler teknoloji basını gündeminde</div>
          </div>
        </div>
        <div className={`w-full flex justify-around flex-wrap ${windowSize.width < 800 ? "px-10" : ""}`}>
          {
            pressLinks
              ? pressLinks.map(eachPressLink => {
                return(
                  <a href={eachPressLink.link} target='_blank' className='w-96 aspect-square mr-4 mt-8 relative flex flex-col justify-end cursor-pointer hover:scale-105 transition-all'>
                    <img src={eachPressLink.photo} alt={eachPressLink.photo} className='w-full h-full absolute z-0' />
                    <div className='z-20 w-full h-fit bg-gray-100 p-4'>
                      <div className='text-sm'>{eachPressLink.source}</div>
                      <div className='text-gray-700 font-semibold text-lg mb-4'>{eachPressLink.title}</div>
                      <div className='flex w-full items-center'>
                        <a className='mr-4 text-blue-800' href={eachPressLink.linkedin}><Linkedin fontSize='20px'/></a>
                        <a className='mr-4 text-blue-500' href={eachPressLink.twitter}><Twitter fontSize='20px'/></a>
                        <a className='mr-4 text-black' href={eachPressLink.link}><ExternalLink fontSize='20px'/></a>
                      </div>
                    </div>
                  </a>
                )
              })
              : ("")
          }
        </div>
      </div>
    </div >
  )
}

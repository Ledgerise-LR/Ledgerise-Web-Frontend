import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react';
import {Linkedin, Twitter, ExternalLink} from '@web3uikit/icons'
import { useMoralis } from 'react-moralis';
import { ethers } from 'ethers';
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import { URL, PORT } from '@/serverConfig';
import dynamic from 'next/dynamic';
import {Trending} from '@web3uikit/icons'
import { FaArrowRight, FaCheckCircle, FaUser, FaBox, FaBoxOpen, FaDropbox, FaParachuteBox, FaBoxTissue, FaToolbox, FaHandsHelping } from 'react-icons/fa';
import CargoCar from '@/components/CargoCar';
import { useRouter } from 'next/router';
import { images } from '@/next.config';

export default function Home() {
  const router = useRouter();

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
    description: "Marketing Specialist, Türkiye 🇹🇷",
    testimonial: "Thanks to Ledgerise, I could view that all my donations during Ramadan met the beneficiary.",
    photo: "ozge.png"
  },
  {
    name: "Esen K.",
    description: "Bank Officer, Germany 🇩🇪",
    testimonial: "Regardless of geography, I can trace all the process through personalized reports.",
    photo: "esen.png"
  },
  {
    name: "Olga S.",
    description: "Lawyer, Ukraine 🇺🇦",
    testimonial: "Seeing my donations delivered made me truly happy!",
    photo: "olga.png"
  },
  {
    name: "Uygar D.",
    description: "Businessman, Türkiye 🇹🇷",
    testimonial: "A wonderful initiative. It is an extraordinary experience for me seeing my donation used for the right people.",
    photo: "uygarbey.png"
  }
  ]);

  useEffect(() => {
    async function fetchAsset() {
      
      const showroom = document.getElementById("showroom");
      showroom.style.filter = "opacity(1)";

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


  const [windowSize, setWindowSize] = useState({
    width: "",
    height: ""
  })

  useEffect(() => {

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const pressLinks = [
    {
      title: "Ledgerise collaborating with local authorities in aid campaigns!",
      photo: "/basin_sosyalup.png",
      source: "SosyalUp Journal",
      link: "https://sosyalup.net/ledgerise-yardim-kampanyalarinda-yerel-yonetimler-ile-isbirligi-icerisinde/",
      twitter: "https://x.com/SosyalUp/status/1808470752657850425",
      linkedin: "https://www.linkedin.com/pulse/sosyalup-b%C3%BClten-sosyal-up-gjfbf/"
    },
    {
      title: "Ledgerise in local authorities' social campaigns!",
      photo: "/basin_ict.png",
      source: "ICT Media",
      link: "https://ictmedia.com.tr/haber/ledgerise-yardim-kampanyalarinda-yerel-yonetimler-ile-isbirligi-icerisinde",
      twitter: "https://x.com/ictmedia_tr/status/1808489458607575041",
      linkedin: "https://www.linkedin.com/posts/ictmedya_ledgerise-yard%C4%B1m-kampanyalar%C4%B1nda-yerel-y%C3%B6netimler-activity-7214255177443254273-VUDl/?originalSubdomain=tr"
    },
    {
      title: "PRESS RELEASE - Ledgerise: an innovative solution that make donations tracable...",
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
      span: "Trustfully",
      title: "DONATE",
      description: "Click on the campaign you want to donate to from the 'How to donate?' tab. When making your donation, you must provide your email address to the organization running the campaign."
    },
    {
      photo: "supplyChain2.svg",
      alt: "match",
      span: "Instantly",
      title: "PAIRED",
      description: "As soon as you make a donation, a QR code is created in your name. This QR code is located on your donation and is scanned by distribution staff during production, storage and delivery."
    },
    {
      photo: "supplyChain3.svg",
      alt: "delivery",
      span: "%100 Transparent",
      title: "DELIVERY",
      description: "Once scanned, the image, location and timestamp of the parcel are instantly recorded on the blockchain. You can be sure that your donation reaches the person in need through the emails you receive."
    }
  ]
  
  const partnerImages = ["sancaktepe.png", "marjinalsosyal.png", "sevvakfi.png", "iparet.png", "sarigazi.png"];

  const [selectedSection, setSelectedSection] = useState('dashboard'); 

  useEffect(() => {
    console.log(router.query);
    if (router.query.section) {
      setSelectedSection(router.query.section);
      const element = document.getElementById("solutions");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [router.query.section]);

  const sections = [
    { 
      id: 'dashboard', 
      section: 'LR Dashboard',
      title: 'Easy Stock Management', 
      content: 'Easily list, update and publish stocks',
      list: [
        'It is developed for companies that do not currently have an e-commerce infrastructure and who perform manual inventory management.',
        'Companies can easily manage stock, track cargo, create QR codes and start campaigns via an all-in-one panel.',
        'In this way, an integrative, simple and easy-to-use infrastructure system is offered to SMEs and local tradesmen.'
      ],
      animationText: 'List with one click',
      images: ["solutions/dashboard.png"]
    },
    { 
      id: 'entegration', 
      section: 'LR Entegration',
      title: 'Integration at Jet Speed', 
      content: 'Easily define products from your own system in the LR management API.',
      list: [
        'It is for companies that manage inventory in an e-commerce infrastructure or cloud-based system.',
        'With our software team providing 24/7 support, integration is possible in less than 1 hour.',
        'Use it with peace of mind with our successful penetration tests, 99.5124% uptime percentage and 5-layer system security.'
      ],
      animationText: 'Integration completed in 1 hour',
      images: ["solutions/entegrasyon.png"]
    },
    { 
      id: 'collaborate', 
      section: 'LR Collaborate',
      title: 'LR Collaborate', 
      content: 'Donate a percentage share of a product!',
      list: [
        'With LR Collaborate, you can donate an item in partnership with other donors instead of donating it on your own. No matter how much you donate, LR shows you that your donation is making a tangible impact.'
      ],
      animationText: 'Common purpose, common donation',
      images: ["solutions/collaborate1.png", "solutions/collaborate2.png", "solutions/collaborate3.png"]
    },
    { 
      id: 'deliverTrust', 
      section: 'LR DeliverTrust',
      title: 'LR ESCROW Model', 
      content: 'It is a guarantee that your donation reaches the real needy.',
      list: [
        'When your donation is processed on Ledgerise, an NFT is created in your name, acknowledging that we have escrowed your donation. This way, your donation is protected by an immutable escrow certificate.',
        'Your donation will only be sent to the stocking company when it is verified with a photo that the required product has reached the real person in need.',
        'If your donation does not reach the person in need for a certain reason, your donation will be refunded to you.'
      ],
      animationText: 'We bring a new dimension to donation'
    },
    { 
      id: 'lens', 
      section: 'LR Lens',
      title: 'LR Lens AI Camera', 
      content: 'It was already delivered safe and sound',
      list: [
        'Lr Lens is an AI camera that can be easily integrated into mobile devices. Donated products are scanned with LR Lens at production, warehouse and delivery points.',
        'The location, time and image of the product are simultaneously NFTed.',
        'In this way, donors can be absolutely sure that their donations reach the real needy.'
      ],
      animationText: '100% reliable and transparent',
      videoSrc: ["solutions/lensAI.mp4"]
    },
    { 
      id: 'safeView', 
      section: 'LR SafeView',
      title: 'LR SafeView', 
      content: 'Personal data is protected with the highest sensitivity.',
      list: [
        'With our adaptive artificial intelligence algorithm, LR Safeview detects and freezes personal images belonging to those in need. It detects images that do not pose a risk and offers the donor the experience of handing them over to them.'
      ],
      animationText: "Don't worry, it's private and protected.",
      images: ["solutions/safeview1.png", "solutions/safeview2.png", "solutions/safeview3.png"]
    },
    { 
      id: 'lensBot', 
      section: 'LR LensBot',
      title: 'LR Lens TelegramBot', 
      content: 'It is possible even in places where cargo cannot reach.',
      list: [
        'For businesses listing less than 50 products, donor notification is possible via TelegramBot without the need for cargo integration.'
      ],
      animationText: 'If you do not have a cargo agreement.',
      images: ["solutions/lensBot.png"]
    }
  ];

  return (
    <div className="w-full h-full pb-28 px-0 pt-28 relative min-[800]:px-20 min-[800]:pt-24 overflow-hidden overflow-x-hidden">
      <div className="w-full h-full flex justify-center min-[1200]:justify-between items-center"> 
        <div className="flex flex-1 w-3/5 h-4/5 justify-around min-[1200]:justify-between px-4 flex-wrap">
          <div className='flex-col w-128 mb-12 z-10'>
            <div className='w-full'>
              <div 
              className={`h-fit -mt-12 font-semibold font-sans flex flex-col ${windowSize.width < 800 ? "text-4xl" : "text-6xl"} min-[800]:text-6xl`}
              >
                <div className='text-sm flex items-center mb-4'>
                  <div className='h-10 w-fit mr-2'>
                    <img className='h-full' src="/itucekirdek.png" alt="itucekirdek" />
                  </div>
                  <div className='text-sm font-normal'>acceleration program start-up</div>
                </div>
                <div className='mb-2 text-slate-900'>Technology that makes</div>  
                <div style={{
                background: "-webkit-linear-gradient(60deg, rgba(240,150,0,1), rgba(120,0,150,1))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }} className='pb-2 w-fit'>100% transparent</div>
                <div className='text-slate-900'>donation possible</div>
              </div>
              <div className="text-black flex flex-col gap-2 mt-12 font-sans text-lg min-[800]:w-full min-[800]:text-lg">
                <div className='flex items-center'><div className='p-1 bg-[rgb(50,0,20)] text-white rounded-full mr-2'><Trending fontSize='16px'/></div>Companies list their excess stock in our system with a single click.</div>
                <div className='flex items-center'><div className='p-1 bg-[rgb(50,0,20)] text-white rounded-full mr-2'><Trending fontSize='16px'/></div>Products are donated by donors jointly on a share basis.</div>
                <div className='flex items-center'><div className='p-1 bg-[rgb(50,0,20)] text-white rounded-full mr-2'><Trending fontSize='16px'/></div>Donors are assured that the products reach the right people in need.</div>
              </div>
              <div className='h-10'></div>
            </div>
            <div className='flex items-center'>
              <div className='w-fit mr-6 mt-4 z-10'>
                <a href="/collections">
                  <div className="p-4 bg-[rgb(255,168,82)] border-2 border-[rgb(255,168,82)] text-center text-black font-bold rounded tracking-wide max-[800]:text-sm">Explore Campaigns</div>
                </a>
              </div>
              <div className='w-fit mt-4 z-10'>
                <a href="/login">
                  <div className="p-4 bg-white border-2 text-center border-black text-black font-bold rounded tracking-wide max-[800]:text-sm">View Donation Report</div>
                </a>
              </div>
            </div>
            <div className='w-full h-20 mt-4'>
              <div className='text-sm mb-4 text-gray-800 font-light'>Collaborative Partners</div>
              <div className='flex w-full h-6'>
                {
                  partnerImages.map(eachPartnerImage => {
                    return (
                      <div className='h-full overflow-hidden mr-4'>
                        <img className='h-full' src={eachPartnerImage} alt={eachPartnerImage} />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className="w-96 h-fit relative bg-white z-10 max-[800]:mt-20 mt-4">
            <a href={`/assets?id=${asset.tokenId}&subcollectionId=${asset.subcollectionId}&nftAddress=${asset.nftAddress}`}>
              <div id='showroom' className={`relative w-96 h-fit flex flex-1 transition-all bg-white flex-col justify-center border-2 overflow-hidden border-black rounded -mt-12`}>
                <div className='border-b-2 border-black h-80 w-full flex justify-center overflow-hidden items-center'>
                  <img src={imageURI} alt={tokenName} className='w-full' />
                </div>
                <div className='w-full h-max p-4'>
                  <div className='text-2xl text-black mb-1 h-16 flex items-center'>{asset.collectionName}</div>
                  <div className='flex flex-1 justify-between items-center'>
                    <div>
                      <div className='text-sm text-gray-500'>#{asset.tokenId} </div>
                      <div className='uppercase text-black text-sm h-12'>{tokenName}</div>
                    </div>
                    <div className='flex-col flex items-end'>
                      <div className='text-xs text-black'>Total donation:</div>
                      <div style={{backgroundColor: "#000"}} className='w-36 p-2 rounded text-white flex justify-end items-center px-5'>
                        <span className='text-white mr-2 text-sm'>{Number(asset.totalDonated)} aid parcel</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-sm my-4 rounded text-black'>{tokenDescription.slice(0,80)}</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className='w-full flex justify-center gap-12 bg-gray-50 py-10 mt-12 flex-wrap h-fit'>
      <div className='flex items-center'>
          <div className='text-orange-900'><FaHandsHelping size={"48px"}/></div>
          <div className='flex items-center flex-col justify-center'>
            <div className='font-semibold mr-4 text-5xl flex text-orange-900 ml-4'>7 <div className='-mt-0.5'>+</div></div>
            <div className='w-fit font-bold text-base'>Partner</div>
          </div>  
        </div> 
        <div className='flex items-center'>
          <div className='text-orange-900'><FaParachuteBox size={"48px"}/></div>
          <div className='flex items-center flex-col justify-center ml-4'>
            <div className='font-semibold mr-4 text-5xl flex text-orange-900'>100 <div className='-mt-0.5'>+</div></div>
            <div className='w-fit font-bold text-base'>Monthly parcel traffic</div>
          </div>  
        </div> 
        <div className='flex items-center'>
          <div className='text-orange-900'><FaUser size={"48px"}/></div>
          <div className='flex items-center flex-col justify-center'>
            <div className='font-semibold mr-4 text-5xl flex text-orange-900 ml-4'>1000 <div className='-mt-0.5'>+</div></div>
            <div className='w-fit font-bold text-base'>Beneficiary</div>
          </div>  
        </div> 
      </div>
      <div className='w-full h-100 mt-16 mb-60 relative'>
        <div className='w-full flex justify-center text-center text-sm pt-12 text-yellow-500 font-bold'>Explore the 100% transparent and reliable donation network!</div>
        <div className='w-full flex justify-center text-center border-b mb-4 pb-2 text-3xl'>Click on the pins to see the magic!</div>
        <div className='w-full h-108'>
          <Map
              center={{latitude: ((41.47202 + 40.7021) / 2) * 1000, longitude: ((28.46316 + 29.5983) / 2) * 1000}}
              visualVerifications={visualVerifications}
              zoom={11}
            />
        </div>
      </div>
      <div className='mb-12 w-full h-fit'>
        <div className='w-full flex justify-center text-center text-sm text-yellow-500 font-bold'>With a piece of mind...</div>
        <div className='w-full flex justify-center text-center border-b mb-4 pb-12 text-3xl'>Through the eyes of donors...</div>
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

      <div id="solutions" className={`w-1/2 text-lg text-center mx-auto bg-[#2c202b] text-white rounded-md font-extralight p-2 mb-4 ${windowSize.width < 800 ? "w-3/4" : ""}`}>
        From stock management to fundraising campaigns. Ledgerise provides companies, NGOs and donors <span className='text-[#FFA851]'>a Win Win</span> relation. <span className='bg-[#FFA851] text-[#2c202b] font-normal'>Our technologies that make difference:</span>
      </div>

      <div className={`flex xl:w-4/5 mx-auto bg-[#2c202b] rounded-md p-6 ${windowSize.width < 800 ? "flex-col" : ""}`}>
        <div className={`w-1/4 text-[#b3b3b3] text-xl ${windowSize.width < 800 ? "flex w-full text-sm overflow-x-scroll" : ""}`}>
          <ul className={`${windowSize.width < 800 ? "flex w-full" : ""}`}>
            {sections.map((section, index) => (
              <li
                key={section.id}
                className={`py-5 pl-5 cursor-pointer flex items-center ${selectedSection === section.id ? 'text-white text-2xl' : ''}`}
                onClick={() => {
                  setSelectedSection(section.id);
                }}
              >
                <FaArrowRight className={`${selectedSection === section.id ? '' : 'hidden'} mr-3 text-[#FFA851]`}></FaArrowRight>{section.section}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-px mx-4 bg-gradient-to-b from-[#383838] via-[#A4A4A4] to-[#383838]"></div>

        <div className={`w-3/4 p-8 text-white ${windowSize.width < 800 ? "w-full" : ""}`}>
          {sections.map((section, index) =>
            selectedSection === section.id ? 
              <div key={section.id}>
                <div className=''>
                  <CargoCar width={windowSize.width} index={index} animationText={section.animationText} previousWidth={`${16 + (index) * (84 / sections.length)}%`} nextWidth={`${16 + (index+1) * (84 / sections.length)}%`}/>
                </div>

                <h2 className="mt-4 text-2xl font-semibold">{section.title}</h2>
                <p className="mt-1 font-extralight italic">{section.content}</p>
                <div className={`${windowSize.width < 800 ? "flex-col" : ""} ${((section.id === 'collaborate') || (section.id === 'safeView')) ? '' : 'flex gap-3 items-end'}`}>
                  <ul className={`${windowSize.width < 800 ? "w-full" : ""} mt-4 space-y-3 font-extralight w-3/5 self-start`}>
                    {Object.values(section.list).map((item, index) => (
                      <li key={index} className=''>
                        <FaCheckCircle className='my-auto mr-3 text-[#FFA851] inline'></FaCheckCircle>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div 
                  className={`${((section.id === 'collaborate') || (section.id === 'safeView')) ? 'flex gap-3 w-1/4 mt-4' : 'ml-4'}`}>
                    {section.id === 'lens' ? (
                      <video loop autoPlay className="w-64" style={{ boxShadow: "20px 20px 0 orange" }}>
                        <source src={section.videoSrc} type="video/mp4" />
                        Tarayıcınız video etiketini desteklemiyor.
                      </video>
                    ) : (
                      section.images && section.images.map((image, index) => (
                        <img key={index} src={image} alt={image} style={{ boxShadow: `${(section.id == "dashboard" || section.id == "entegration")  ? "20px 20px 0 orange" : ""}` }} className={`${index === 1 ? 'self-end' : 'self-start'}`} />
                      ))
                    )}
                  </div>
                </div>
              </div>
             : null
          )}
        </div>
      </div>

      <div style={{color: "#343434"}} className='z-20 mt-20'>
        <div className='w-full flex justify-center text-center text-sm pt-12 text-yellow-500 font-bold'>Reach the hearts of the beneficiaries!</div>
        <div className='w-full flex justify-center text-center border-b mb-4 pb-12 text-3xl'>We make sure your donation reaches the right person in need.</div>
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
            <div className='w-full flex justify-center text-center text-sm pt-12 text-yellow-500 font-bold'>Featured News</div>
            <div className='w-full flex justify-center text-center mb-4 pb-12 text-3xl'>In The Agenda Of Popular Technology Press</div>
          </div>
        </div>
        <div id='newsroom' className="w-full flex justify-around flex-wrap max-[800]:px-10">
          {
            pressLinks
              ? pressLinks.map(eachPressLink => {
                return(
                  <a href={eachPressLink.link} target='_blank' className='w-96 aspect-square mr-4 mt-8 relative flex flex-col justify-end cursor-pointer hover:scale-105 transition-all'>
                    <div className='w-full h-full absolute z-0 flex justify-center pt-12'>
                      <img className='w-full h-fit' src={eachPressLink.photo} alt={eachPressLink.photo} />
                    </div>
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

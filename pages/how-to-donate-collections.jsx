import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import networkMapping from "../constants/networkMapping.json";
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';
import { URL, PORT } from '@/serverConfig';
import axios from 'axios';


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
    axios.get(`${URL}:${PORT}/subcollection/get-all-collections`)
      .then(res => {
        const data = res.data;
        setCollections(data.subcollections);
      })
  }, [])

  const chainString = chainId ? parseInt(chainId, 16).toString() : "5";
  const marketplaceAddress = networkMapping["Marketplace"][chainString];

  return (
    <>
      <div className='w-full text-2xl flex flex-col items-center text-center my-12'>
        <div>Destek olmak istediğin kampanyaya tıkla</div>
        <div>Nasıl bağış yapabileceğini gör!</div>
      </div>
      <div className='px-12 mb-20 w-full flex flex-1 flex-wrap'>
        {!collections
          ? (<div>Loading...</div>)
          : (
            collections.map((collection) => {
              return (
                <a className='mx-2 w-96 mb-12' href={`/how-to-donate?id=${collection.companyCode}`}>
                  <div className='aspect-square border-2 rounded flex flex-col p-4' key={`${collection.itemId}`}>
                    <div className='aspect-video border-2 flex items-center justify-center'>
                      <img className='h-36' src={`${collection.image}`} alt={collection.name} />
                    </div>
                    <div className='text-slate-800 text-xl mt-3 flex flex-1 justify-between items-center'>
                      <div className='text-center w-full'>{collection.name}</div>
                    </div>
                    <div className='w-full p-4 my-2 text-center rounded-md' style={{backgroundColor: "#343434", color: "#fefefe"}}>Nasıl bağış yapılır?</div>
                    <div className='flex mt-4 items-center'>
                      <img className='w-8 h-8 rounded-full' src={collection.companyImage} alt={collection.charityName} />
                      <span className='text-slate-700 text-sm ml-2'><strong>{collection.charityName}</strong> kampanyasıdır</span>
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
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
      <div className='text-xl m-12'>Bağış Kampanyaları</div>
      <div className='px-12 mb-20 w-full flex flex-1 flex-wrap'>
        {!collections
          ? (<div>Loading...</div>)
          : (
            collections.map((collection) => {
              return (
                <a className='w-96 mr-4 mb-12' href={`/collection?id=${collection.itemId}&nftAddress=${collection.nftAddress}`}>
                  <div className='mr-5 aspect-square border-2 rounded flex flex-col p-4' key={`${collection.itemId}`}>
                    <div className='aspect-video border-2 flex items-center justify-center'>
                      <img className='h-36' src={`${collection.image}`} alt={collection.name} />
                    </div>
                    <div className='text-slate-800 text-2xl my-3 flex flex-1 justify-between items-center'>
                      <div>{collection.name}</div>
                      <div className='w-2/3 px-4 rounded-full py-2 bg-black flex-col text-slate-50 flex items-baseline justify-center'>
                        <span className='text-lg mr-1 -mb-1'>{collection.totalRaised} ₺</span>
                        <span className='text-xs text-slate-300'>toplam bağış</span>
                      </div>
                    </div>
                    <div className=''>
                      <span className='text-slate-700 text-sm font-semibold'>{collection.charityName}</span>
                      <span className='text-slate-600 text-sm'> kampanyasıdır</span>
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
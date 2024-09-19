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
    <div>
      <div className='text-xl mt-4 w-full px-12 flex justify-between items-center'>
        <div className='text-gray-700'>Bağış kampanyaları</div>
        <div className='text-sm text-gray-700'>{collections ? collections.length : ("")} adet</div>
      </div>
      <div className='w-full border-b my-4'></div>
      <div className='px-8 mb-20 w-full flex flex-1 flex-wrap'>
        {!collections
          ? (<div>Loading...</div>)
          : (
            collections.map((collection) => {
              return (
                <a className='mr-4 w-96 mb-12 bg-white hover:brightness-90 transition-all' href={`/collection?id=${collection.itemId}&nftAddress=${collection.nftAddress}`}>
                  <div className='aspect-square shadow-md rounded flex flex-col p-4' key={`${collection.itemId}`}>
                    <div className='w-full border flex items-center justify-center'>
                      <img className='h-36' src={`${collection.image}`} alt={collection.name} />
                    </div>
                    <div className='my-3 flex flex-1 justify-center flex-col'>
                      <div className='text-gray-700 text-lg mb-2 font-medium'>{collection.name}</div>
                      <div className='text-gray-600 text-sm'>{collection.description}</div>
                      {/* <div className='w-2/3 px-4 rounded-full py-2 bg-black flex-col text-slate-50 flex items-baseline justify-center'>
                        <span className='text-lg mr-1 -mb-1'>{collection.totalRaised} ₺</span>
                        <span className='text-xs text-slate-300'>toplam bağış</span>
                      </div> */}
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
    </div>
  )
}
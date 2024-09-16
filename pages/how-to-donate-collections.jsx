import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis' // this
import networkMapping from "../constants/networkMapping.json";
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';
import { URL, PORT } from '@/serverConfig';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();  // this
  const [collections, setCollections] = useState([]);
  const [ethToUsdRate, setEthToUsdRate] = useState(null); //this
  const [loading, setLoading] = useState(true); 

  const router = useRouter(); //this

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      const rate = await getEthToUsdRate();
      setEthToUsdRate(rate);
    };

    fetchEthToUsdRate();
  }, []); // this effect

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(`${URL}:${PORT}/subcollection/get-all-collections`);
        const data = res.data;
        setCollections(data.subcollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchCollections();
  }, []);

  const chainString = chainId ? parseInt(chainId, 16).toString() : "5";  // This is not used
  const marketplaceAddress = networkMapping["Marketplace"][chainString]; // and this

  return (
    <>
      <div className='w-full text-2xl flex flex-col items-center text-center my-12'>
        <div>Destek olmak istediğin kampanyaya tıkla</div>
        <div>Nasıl bağış yapabileceğini gör!</div>
      </div>
      <div className='px-12 mb-20 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {loading
          ? (
            <div className='w-full flex justify-center items-center col-span-full'>
              <FaSpinner className='animate-spin text-2xl' />
            </div>
          )
          : (
            collections.map((collection) => (
              <a key={collection.itemId} href={`/how-to-donate?id=${collection.companyCode}`} className='block'>
                <div className='aspect-square border-2 rounded flex flex-col p-4'>
                  <div className='aspect-video border-2 flex items-center justify-center'>
                    <img className='h-36' src={`${collection.image}`} alt={collection.name} />
                  </div>
                  <div className='text-slate-800 text-xl mt-3 flex flex-1 justify-between items-center'>
                    <div className='text-center w-full truncate'>{collection.name}</div>
                  </div>
                  <div className='w-full p-4 my-2 text-center rounded-md' style={{ backgroundColor: "#343434", color: "#fefefe" }}>
                    Nasıl bağış yapılır?
                  </div>
                  <div className='flex mt-4 items-center'>
                    <img className='w-8 h-8 rounded-full' src={collection.companyImage} alt={collection.charityName} />
                    <span className='text-slate-700 text-sm ml-2 truncate'><strong>{collection.charityName}</strong> kampanyasıdır</span>
                  </div>
                </div>
              </a>
            ))
          )
        }
      </div>
    </>
  );
}

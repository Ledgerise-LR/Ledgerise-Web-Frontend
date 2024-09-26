import { useState, useEffect } from 'react';
import { URL, PORT } from '@/serverConfig';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

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

  return (
    <>
      <div className='w-full text-2xl flex flex-col items-center text-center my-12'>
        <div>Bağış kampanyalarını keşfet</div>
        <div>Nasıl destek olabileceğini gör!</div>
      </div>
      <div className='px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 mb-5 md:mb-10 xl:mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {loading
          ? (
            <div className='w-full flex justify-center items-center col-span-full'>
              <FaSpinner className='animate-spin text-2xl' />
            </div>
          )
          : (
            collections.map((collection) => (
              <a key={collection.itemId} href={`/collection?id=${collection.itemId}&nftAddress=${collection.nftAddress}`} className='block'>
                <div className='flex flex-col gap-4 border-2 rounded-2xl p-4 h-full'>
                  <img className='h-40 object-contain' src={`${collection.image}`} alt={collection.name} />
                  <div className='text-lg sm:text-xl pt-2 text-slate-800 sm:truncate border-t-2'>
                    {collection.name}
                  </div>
                  <div className=''>
                    {collection.description}
                  </div>
                  <div className='flex items-center mt-auto'>
                    <img className='w-8 h-8 rounded-full' src={collection.companyImage} alt={collection.charityName} />
                    <span className='text-slate-700 text-sm ml-2 sm:truncate'><strong>{collection.charityName}</strong> kampanyasıdır</span>
                  </div>
                  <div className='w-max self-end p-2 rounded-2xl bg-[#343434] text-xs text-center text-[#fefefe]'>
                    Bağış Yap
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

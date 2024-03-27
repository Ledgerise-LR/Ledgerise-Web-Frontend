
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json";
import NFTBox from '../components/NftCard'
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import { URL, PORT } from '@/serverConfig';
import axios from 'axios';

export default function Home() {

  const { isWeb3Enabled, chainId } = useMoralis();

  const [assets, setAssets] = useState([]);
  const [collection, setCollection] = useState({});

  const router = useRouter();
  const itemId = router.query.id;

  useEffect(() => {

    axios.post(`${URL}:${PORT}/company/get-all-items`, {
      code: itemId
    })
      .then(res => {
        const data = res.data;
        setAssets(data.assets);
      });
  }, [router, itemId])


  const chainString = chainId ? parseInt(chainId, 16).toString() : "80001";
  const marketplaceAddress = networkMapping["Marketplace"][chainString];

  return (
    <>
      <div className='flex flex-1 py-16 px-8 overflow-x-hidden'>
        <div className='w-full h-full'>
          <div className='w-full flex flex-col justify-center items-center h-96'>
            <div className='text-3xl mb-4'>How to donate?</div>
            <div>Welcome to LR</div>
          </div>
          <div>
            <div>
                <div className='ml-4 mb-8'><strong>Step 1:</strong> Select a donation option</div>
                <div className='w-full h-96 overflow-x-scroll overflow-y-hidden flex'>
                {!assets
                  ? (<div>Loading...</div>)
                  : (assets == ""
                    ? (<div className='text-slate-500 w-100 h-36 flex flex-1 items-center justify-center'>No aid parcels found for the filters you provided.</div>)
                    : (assets.map((asset) => {
                      return (
                        <div className='w-100 ml-2 mb-5' key={`${asset.nftAddress}${asset.tokenId}`}>
                          <div>
                            <NFTBox
                              marketplaceAddress={marketplaceAddress}
                              nftAddress={asset.nftAddress}
                              tokenId={asset.tokenId}
                              seller={asset.seller}
                              price={asset.price}
                              tokenUri={asset.tokenUri}
                              history={asset.history}
                              availableEditions={asset.availableEditions}
                            />
                          </div>
                        </div>
                      )
                    }))
                  )
                }
                </div>
                <div className='mt-32'>
                  <div className='ml-4 mb-8'><strong>Step 2:</strong> Send the money to the following IBAN address</div>
                  <div><strong>Important:</strong> Please write your email address to the "Açıklama" section.</div>
                  <div className='mt-20'>IBAN: </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
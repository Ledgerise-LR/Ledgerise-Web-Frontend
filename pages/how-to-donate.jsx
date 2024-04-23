
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
  const [company, setCompany] = useState({});

  const router = useRouter();
  const itemId = router.query.id;

  useEffect(() => {

    axios.get(`${URL}:${PORT}/company/get-all-items?code=${itemId}`)
      .then(res => {
        const data = res.data;
        setAssets(data.assets);

        axios.get(`${URL}:${PORT}/company/get-company-from-code?code=${itemId}`)
        .then((res) => {
          const companyData = res.data;
          console.log(companyData.company)
          setCompany(companyData.company);
        })
      });
  }, [router, itemId])


  const chainString = chainId ? parseInt(chainId, 16).toString() : "80001";
  const marketplaceAddress = networkMapping["Marketplace"][chainString];

  return (
    <>
      <div className='flex flex-1 py-16 px-8 overflow-x-hidden'>
        <div className='w-full h-full'>
          <div className='w-full flex flex-col justify-center items-center h-100'>
            <div className='text-3xl mb-4'>How to donate?</div>
            <div className='text-center'>for <strong>{
              assets && assets[0] && assets[0].collectionName
                ? assets[0].collectionName
                : ("")
            }</strong></div>
            <div className='animate-bounce mt-12 text-xl flex flex-col items-center'>
              <div>Slide up</div>
              <div>↑</div>
            </div>
          </div>
          <div>
            <div>
                <div className='mb-8'><strong>Step 1</strong> Decide a parcel to donate</div>
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
                {
                  company && company.bankName && company.receipientDescription 
                    ? (
                      <div className='mt-32'>
                        <div className='mb-8'><strong>Step 2</strong> Send the money to the IBAN of <strong>{company.receipientDescription} {company.receipientName}</strong> below</div>
                        <div><strong>Important:</strong> Please write your email address to the "Açıklama" section in the format below.</div>
                        <div className='w-full flex justify-center'><strong>LR "your email address"</strong></div>
                        <div>
                          <div className='mt-10'>{company.bankName}</div>
                          <div className='mt-2'><strong>{company.IBAN}</strong></div>
                          <div className='mt-2'>{company.receipientName}</div>
                        </div>
                      </div>
                    )
                    : ("")
                }
            </div>
            <div className='w-full flex flex-col justify-center items-center h-96'>
              <div className='text-3xl mb-4 text-center'>How to see donation delivery report?</div>
              <div>100% transparently</div>
            </div>
            <div><strong>Step 1</strong></div>
            <div className='flex flex-col justify-center items-center'>
              <a target='_blank' className='text-center underline text-blue-600' href="/register">Register to Ledgerise</a>
              <div className='text-center mb-2'>with the email you provided in "Açıklama" when you donated. Create a password.</div>
              <div>If you already have a Ledgerise acoount. <a className='underline text-blue-600' target='_blank' href="/login">Login</a></div>
            </div>
            <div className='mt-24'><strong>Step 2</strong></div>
            {
              assets && assets[0]
                ? <div className='flex justify-center'>
                  <a className='underline text-blue-600' target='_blank' href={`/collection?id=${assets[0].subcollectionId}`}>Click</a>
                  <div>&nbsp; to go to the campaign you donated for</div>
                </div>
                : ("")
            }
          </div>
          <div className='mb-8 mt-24 text-center'><strong>Step 3</strong> On the campaign page, click on the box you already donated</div>
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
              <div className='mt-24'>
                <div><strong>Step 4</strong></div>
                <div>
                  <img src="rapor_resim.png" alt="LR Report Image" />
                  <div className='text-center'>Click here on the parcel page</div>
                </div>
                <div className='mt-4'><strong>Step 5</strong></div>
                <div>
                  <img src="rapor_icerik.png" alt="LR Report Image" />
                </div>
                <div className='mt-4'><strong>Step 6</strong></div>
                <div>
                  <img src="rapor_harita.png" alt="LR Report Image" />
                  <div className='text-center'>Click on the pinpoint to see your <strong>impact</strong> 🎉</div>
                </div>
            </div>
            <div className='w-full h-96 flex justify-center items-center'>
              <div className='text-2xl'>That easy!</div>
            </div>
        </div>
      </div>
    </>
  )
}
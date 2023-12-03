
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json";
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import AuctionBox from '../components/AuctionCard'

export default function Home() {

  const { isWeb3Enabled, chainId } = useMoralis();

  const [assets, setAssets] = useState([]);

  const chainString = chainId ? parseInt(chainId, 16).toString() : "5";
  const marketplaceAddress = networkMapping["Marketplace"][chainString];

  const [selectedPriceCategories, setSelectedPriceCategories] = useState([]);


  const checkboxClassName = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";

  useEffect(() => {
    fetch(`http://localhost:4000/get-all-auction-items`)
      .then(response => response.json())
      .then(data => {
        setAssets(data.auctionItems);
      })
  }, [isWeb3Enabled])

  return (
    <div className='flex flex-1 py-16'>
      <div className='w-1/4 px-16 h-fit'>
        <div className='text-xl w-full h-full mb-4 mt-3'>Filters</div>
        <div className='border-b w-full bg-black'></div>
        <div className='w-full h-max border-b mt-4 p-2'>
          <div className='text-slate-600'>Sort by</div>
          <div className='text-slate-800'>
            <div id='priceAscending' onClick={() => { }} className={`hover:text-slate-400 cursor-pointer `}>Default</div>
            <div id='priceAscending' onClick={() => { }} className={`hover:text-slate-400 cursor-pointer `}>Price: Low-High</div>
            <div id='priceDescending' onClick={() => { }} className={`hover:text-slate-400 cursor-pointer `}>Price: High-Low</div>
            <div id='newest' onClick={() => { }} className={`hover:text-slate-400 cursor-pointer `}>Newest</div>
            <div id='oldest' onClick={() => { }} className={`hover:text-slate-400 cursor-pointer `}>Oldest</div>
          </div>
        </div>
        <div className='w-full h-max border-b mt-4 p-2'>
          <div className='text-slate-700 mb-2'>Filter by price</div>
          <div>
            <label>
              <input
                className={`${checkboxClassName}`}
                type="checkbox"
                value="0-0.01"
                onChange={() => { }}
              />
              {" 0-0.01 Ξ"}
            </label>
            <br />
            <label>
              <input
                className={`${checkboxClassName}`}
                type="checkbox"
                value="0.01-0.1"
                onChange={() => { }}
              />
              {" 0.01-0.1 Ξ"}
            </label>
            <br />
            <label>
              <input
                className={`${checkboxClassName}`}
                type="checkbox"
                value="0.1-1"
                checked={selectedPriceCategories.includes('0.1-1')}
                onChange={() => { }}
              />
              {" 0.1-1 Ξ"}
            </label>
            <br />
            <label>
              <input
                className={`${checkboxClassName}`}
                type="checkbox"
                value="1-10"
                checked={selectedPriceCategories.includes('1-10')}
                onChange={() => { }}
              />
              {" 1-10 Ξ"}
            </label>
            <br />
            <label>
              <input
                className={`${checkboxClassName}`}
                type="checkbox"
                value="10-1000000"
                checked={selectedPriceCategories.includes('10+')}
                onChange={() => { }}
              />
              {" 10+ Ξ"}
            </label>
            <br />
          </div>
        </div>
      </div >
      <div className='w-3/4 h-full'>
        <div className='text-4xl w-full h-full mb-4 text-center'>Auctions</div>
        <hr className='mb-4' />
        <div className='flex flex-1 flex-wrap h-max'>
          {!assets
            ? (<div>Loading...</div>)
            : (assets == ""
              ? (<div className='text-slate-500 w-full h-36 flex flex-1 items-center justify-center'>No NFTs found for the filters you provided.</div>)
              : (assets.map((asset) => {
                return (
                  <div className='w-96 mr-5 mb-5' key={`${asset.nftAddress}${asset.tokenId}`}>
                    <a href={`/auction?id=${asset.tokenId}`}>
                      <AuctionBox
                        marketplaceAddress={marketplaceAddress}
                        nftAddress={asset.nftAddress}
                        tokenId={asset.tokenId}
                        seller={asset.seller}
                        currentBidding={asset.currentBidding}
                        currentBidder={asset.currentBidder}
                        tokenUri={asset.tokenUri}
                        history={asset.history}
                        interval={asset.interval}
                        startTime={asset.startTime}
                      />
                    </a>
                  </div>
                )
              }))
            )
          }
        </div>
      </div>
    </div>
  )
}
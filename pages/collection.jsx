
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json";
import NFTBox from '@/components/NFTCard'

export default function Home() {

  const { isWeb3Enabled, chainId } = useMoralis();

  const [assets, setAssets] = useState([]);
  const [collection, setCollection] = useState({});

  const router = useRouter();
  const itemId = router.query.id;

  useEffect(() => {
    if (isWeb3Enabled && itemId) {
      fetch(`http://localhost:4004/get-collection?id=${itemId}`)
        .then(response => response.json())
        .then(data => {
          setAssets(data.activeItems);
        })
      fetch(`http://localhost:4004/get-single-collection?id=${itemId}`)
        .then(response => response.json())
        .then(data => {
          setCollection(data.subcollection);
        })
    }
  }, [isWeb3Enabled, itemId])

  const chainString = chainId ? parseInt(chainId, 16).toString() : "5";
  const marketplaceAddress = networkMapping["Marketplace"][chainString];

  return (
    <>
      <div className='p-24 w-full'>
        <div className='text-4xl w-full mb-4 text-center'>{collection.name} Collection</div>
        <hr className='mb-4' />
        {!assets
          ? (<div>Loading...</div>)
          : (
            assets.map((asset) => {
              return (
                <div className='w-1/4 mr-5' key={`${asset.nftAddress}${asset.tokenId}`}>
                  <a href={`/assets?id=${asset.tokenId}`}>
                    <NFTBox
                      marketplaceAddress={marketplaceAddress}
                      nftAddress={asset.nftAddress}
                      tokenId={asset.tokenId}
                      seller={asset.seller}
                      price={asset.price}
                      tokenUri={asset.tokenUri}
                    />
                  </a>
                </div>
              )
            })
          )
        }
      </div>
    </>
  )
}
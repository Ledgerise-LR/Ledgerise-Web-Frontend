
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json";
import NFTBox from '../components/NftCard'
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import { URL, PORT } from '@/serverConfig';

export default function Home() {

  const { isWeb3Enabled, chainId } = useMoralis();

  const [assets, setAssets] = useState([]);
  const [collection, setCollection] = useState({});

  const router = useRouter();
  const itemId = router.query.id;

  const [allClicked, setAllClicked] = useState(true);
  const [ascendingClicked, setAscendingClicked] = useState(false);
  const [descendingClicked, setDescendingClicked] = useState(false);
  const [oldestClicked, setOldestClicked] = useState(false);
  const [newestClicked, setNewestClicked] = useState(false);

  useEffect(() => {
    if (itemId) {
      fetch(`${URL}:${PORT}/get-collection?subcollectionId=${itemId}`)
        .then(response => response.json())
        .then(data => {
          setAssets(data.activeItems);
          handleDefault();
          fetch(`${URL}:${PORT}/get-single-collection?id=${itemId}`)
            .then(response => response.json())
            .then(data => {
              setCollection(data.subcollection);
            })
        })
    }
  }, [itemId, router])


  const chainString = chainId ? parseInt(chainId, 16).toString() : "80001";
  const marketplaceAddress = networkMapping["Marketplace"][chainString];


  const handleDefault = () => {
    setAllClicked(true);
    setAscendingClicked(false);
    setDescendingClicked(false);
    setOldestClicked(false);
    setNewestClicked(false);
    const priceFilter = selectedPriceCategories.join(",");
    const availableEditionsFilter = availableEditions.join(",");
    fetch(`${URL}:${PORT}/get-collection?subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}`)
      .then(response => response.json())
      .then(data => {
        setAssets(data.activeItems);
      })
  }

  const handleSortPriceAscending = () => {
    setAllClicked(false);
    setAscendingClicked(true);
    setDescendingClicked(false);
    setOldestClicked(false);
    setNewestClicked(false);
    const priceFilter = selectedPriceCategories.join(",");
    const availableEditionsFilter = availableEditions.join(",");
    fetch(`${URL}:${PORT}/sort/price-ascending?subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}`)
      .then(response => response.json())
      .then(data => {
        setAssets(data.activeItems);
      })
  }

  const handleSortPriceDescending = () => {
    setAllClicked(false);
    setAscendingClicked(false);
    setDescendingClicked(true);
    setOldestClicked(false);
    setNewestClicked(false);
    const priceFilter = selectedPriceCategories.join(",");
    const availableEditionsFilter = availableEditions.join(",");
    fetch(`${URL}:${PORT}/sort/price-descending?subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}`)
      .then(response => response.json())
      .then(data => {
        setAssets(data.activeItems);
      })
  }

  const handleSortOldest = () => {
    setAllClicked(false);
    setAscendingClicked(false);
    setDescendingClicked(false);
    setOldestClicked(true);
    setNewestClicked(false);
    const priceFilter = selectedPriceCategories.join(",");
    const availableEditionsFilter = availableEditions.join(",");
    fetch(`${URL}:${PORT}/sort/oldest?subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}`)
      .then(response => response.json())
      .then(data => {
        setAssets(data.activeItems);
      })
  }

  const handleSortNewest = () => {
    setAllClicked(false);
    setAscendingClicked(false);
    setDescendingClicked(false);
    setOldestClicked(false);
    setNewestClicked(true);
    const priceFilter = selectedPriceCategories.join(",");
    const availableEditionsFilter = availableEditions.join(",");
    fetch(`${URL}:${PORT}/sort/newest?subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}`)
      .then(response => response.json())
      .then(data => {
        setAssets(data.activeItems);
      })
  }

  const [selectedPriceCategories, setSelectedPriceCategories] = useState([]);

  const handlePriceCategoryChange = (e) => {
    const priceCategory = e.target.value;
    if (e.target.checked) {
      setSelectedPriceCategories([...selectedPriceCategories, priceCategory]);
    } else {
      setSelectedPriceCategories(selectedPriceCategories.filter((pc) => pc !== priceCategory));
    }
  };

  const [availableEditions, setAvailableEditions] = useState([]);

  const handleAvailableEditionsChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setAvailableEditions([...availableEditions, value]);
    } else {
      setAvailableEditions(availableEditions.filter((item) => item !== value));
    }
  };

  useEffect(() => {
    if (availableEditions || selectedPriceCategories) {
      handleDefault();
    }
  }, [availableEditions, selectedPriceCategories])

  const checkboxClassName = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";

  return (
    <>
      <div className='flex flex-1 py-16'>
        <div className='w-1/4 px-16 h-fit'>
          <div className='text-xl w-full h-full mb-4 mt-3'>Filters</div>
          <div className='border-b w-full bg-black'></div>
          <div className='w-full h-max border-b mt-4 p-2'>
            <div className='text-slate-600'>Sort by</div>
            <div className='text-slate-800'>
              <div id='priceAscending' onClick={handleDefault} className={`hover:text-slate-400 cursor-pointer ${allClicked ? "text-slate-500" : "text-slate-800"}`}>Default</div>
              <div id='priceAscending' onClick={handleSortPriceAscending} className={`hover:text-slate-400 cursor-pointer ${ascendingClicked ? "text-slate-500" : "text-slate-800"}`}>Price: Low-High</div>
              <div id='priceDescending' onClick={handleSortPriceDescending} className={`hover:text-slate-400 cursor-pointer ${descendingClicked ? "text-slate-500" : "text-slate-800"}`}>Price: High-Low</div>
              <div id='newest' onClick={handleSortNewest} className={`hover:text-slate-400 cursor-pointer ${newestClicked ? "text-slate-500" : "text-slate-800"}`}>Newest</div>
              <div id='oldest' onClick={handleSortOldest} className={`hover:text-slate-400 cursor-pointer ${oldestClicked ? "text-slate-500" : "text-slate-800"}`}>Oldest</div>
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
                  onChange={handlePriceCategoryChange}
                />
                {" 0-5 $"}
              </label>
              <br />
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="0.01-0.1"
                  onChange={handlePriceCategoryChange}
                />
                {" 5-20 $"}
              </label>
              <br />
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="0.1-1"
                  checked={selectedPriceCategories.includes('0.1-1')}
                  onChange={handlePriceCategoryChange}
                />
                {" 20-50 $"}
              </label>
              <br />
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="1-10"
                  checked={selectedPriceCategories.includes('1-10')}
                  onChange={handlePriceCategoryChange}
                />
                {" 50-100 $"}
              </label>
              <br />
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="10-1000000"
                  checked={selectedPriceCategories.includes('10-1000000')}
                  onChange={handlePriceCategoryChange}
                />
                {" 100+ $"}
              </label>
              <br />
            </div>
          </div>
          <div className='w-full h-max border-b mt-4 p-2'>
            <div className='text-slate-700 mb-2'>Filter by available editions</div>
            <div className='flex-col flex'>
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="0-10"
                  onChange={handleAvailableEditionsChange}
                  checked={availableEditions.includes('0-10')}
                />
                {" 0-10"}
              </label>
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="10-25"
                  onChange={handleAvailableEditionsChange}
                  checked={availableEditions.includes('10-25')}
                />
                {" 10-25"}
              </label>
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="25-50"
                  onChange={handleAvailableEditionsChange}
                  checked={availableEditions.includes('25-50')}
                />
                {" 25-50"}
              </label>
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="50-75"
                  onChange={handleAvailableEditionsChange}
                  checked={availableEditions.includes('50-75')}
                />
                {" 50-75"}
              </label>
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="75-100"
                  onChange={handleAvailableEditionsChange}
                  checked={availableEditions.includes('75-100')}
                />
                {" 75-100"}
              </label>
              <label>
                <input
                  className={`${checkboxClassName}`}
                  type="checkbox"
                  value="100-1000000"
                  onChange={handleAvailableEditionsChange}
                  checked={availableEditions.includes('100-1000000')}
                />
                {" 100+"}
              </label>
            </div>
          </div>
        </div >
        <div className='w-3/4 h-full'>
          <div className='text-4xl w-full h-full mb-4 text-center'>{collection.name}</div>
          <hr className='mb-4' />
          <div className='flex flex-1 flex-wrap h-max'>
            {!assets
              ? (<div>Loading...</div>)
              : (assets == ""
                ? (<div className='text-slate-500 w-full h-36 flex flex-1 items-center justify-center'>No aid parcels found for the filters you provided.</div>)
                : (assets.map((asset) => {
                  return (
                    <div className='w-72 mr-5 mb-5' key={`${asset.nftAddress}${asset.tokenId}`}>
                      <a href={`/assets?id=${asset.tokenId}&subcollectionId=${asset.subcollectionId}`}>
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
                      </a>
                    </div>
                  )
                }))
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}
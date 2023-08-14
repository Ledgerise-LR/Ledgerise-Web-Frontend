import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ethers } from "ethers";
import { Button, Modal, Blockie, useNotification, Loading } from 'web3uikit'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json"
import NFTBox from '../components/NftCard'

export default function Home() {

  function prettyAddress(address) {
    return address.slice(0, 6) + "..." + address.slice(address.length - 6, address.length)
  }

  function prettyDate(timestamp) {

    const date = new Date(timestamp * 1);
    const formattedDate = date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    console.log(formattedDate)
    return formattedDate;
  }

  const { isWeb3Enabled, chainId, account } = useMoralis();


  const [isModalOpen, setIsModalOpen] = useState("");

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const router = useRouter();
  const tokenId = router.query.id
  const dispatch = useNotification();

  const chainString = chainId ? parseInt(chainId, 16).toString() : "11155111";

  const marketplaceAddress = networkMapping["Marketplace"][chainString];
  const mainCollectionAddress = networkMapping["MainCollection"][chainString];

  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/get-all-active-items`)
      .then(response => response.json())
      .then(data => {
        setAssets(data.activeItems);
      })
  }, []);

  const { runContractFunction: getListTokenCounter } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "getListTokenCounter",
    params: {},
    msgValue: ""
  })

  const [listTokenCounter, setListTokenCounter] = useState(0);

  const { runContractFunction: getOwner } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "owner",
    params: {},
    msgValue: ""
  })

  const handleListItemSuccess = async (tx) => {
    dispatch({
      type: "success",
      message: "Tx successful: item bought",
      title: "Transaction Success",
      position: "topR"
    });

    setListingStatus(true);
    setListingTransactionHash(tx.hash);

    await tx.wait(1);

    setListingStatus(false);
  }

  const handleListItemError = async (err) => {
    console.log(err)
    dispatch({
      type: "error",
      message: "Sorry for the error. Please refresh and try again.",
      title: "Transaction failed",
      position: "topR"
    })
  }

  const [listItemNftAddress, setListItemNftAddress] = useState("");
  const [listItemPrice, setListItemPrice] = useState("1");
  const [listItemTokenUri, setListItemTokenUri] = useState("");
  const [listItemCharityAddress, setListItemCharityAddress] = useState("");
  const [listItemSubcollectionId, setListItemSubcollectionId] = useState("");
  const [listItemAvailableEditions, setListItemAvailableEditions] = useState("");

  const [listingStatus, setListingStatus] = useState(false);
  const [listTransactionHash, setListingTransactionHash] = useState(false)

  const { runContractFunction: listItem } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "listItem",
    params: {
      nftAddress: mainCollectionAddress,
      tokenId: listTokenCounter,
      price: ethers.utils.parseEther(listItemPrice || "0") || "0",
      tokenUri: listItemTokenUri,
      charityAddress: listItemCharityAddress,
      availableEditions: listItemAvailableEditions,
      subCollectionId: listItemSubcollectionId
    },
    msgValue: ""
  })

  const [owner, setOwner] = useState("X");

  async function updateUI() {
    setOwner(await getOwner());
    setListTokenCounter(await getListTokenCounter());
  }

  useEffect(() => {
    updateUI();
  }, [isWeb3Enabled, assets, listingStatus, listItemPrice]);

  console.log(mainCollectionAddress)

  return (
    <div>
      <div>{
        (owner ? `${owner.toLowerCase()}` : "") == account ? <div>
          <div>
            <div className="p-4">
              <div>
                {!assets ? (<div>Assets couldn't fetched</div>) : (<div>
                  <div>
                    <div className="flex">
                      {assets.map(asset => {
                        return (
                          <div className='w-72 mr-5 mb-5' key={`${asset.nftAddress}${asset.tokenId}`}>
                            <a href={`/assets?id=${asset.tokenId}`}>
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
                              <div>tokenId {asset.tokenId}, subcollectionId {asset.subcollectionId}, charityAddress {asset.charityAddress}</div>
                            </a>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>)}
              </div>
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <div>List Item</div>
                <div className="mt-4 mb-4">{listingStatus ? (<div>
                  Listing in progress. Follow from <a target="_blank" className="underline hover:text-slate-500" href={`https://sepolia.etherscan.io/tx/${listTransactionHash}`}>{prettyAddress(listTransactionHash)}</a>
                </div>) : (<div>No listing on progress</div>)}</div>
                <input className="p-2 border-2 w-auto mb-4" type="number" placeholder="price (eth)" onChange={(e) => { setListItemPrice(e.currentTarget.value.toString()) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="charityAddress" onChange={(e) => { setListItemCharityAddress(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="tokenUri" onChange={(e) => { setListItemTokenUri(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="subcollectionId" onChange={(e) => { setListItemSubcollectionId(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="availableEditions" onChange={(e) => { setListItemAvailableEditions(e.currentTarget.value) }} />
                <Button
                  theme="primary"
                  text="List item"
                  isFullWidth="true" type='button'
                  onClick={() => {
                    listItem({
                      onSuccess: handleListItemSuccess,
                      onError: (err) => handleListItemError(err)
                    });
                  }}
                />
              </div>
              <div>
                <h1>Add creator</h1>
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <input type="text" />
              </div>
              <div>
                <h1>Create subcollection</h1>
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <input type="text" />
              </div>
              <div>
                <h1>Update item</h1>
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <input type="text" />
              </div>
            </div>
          </div>
        </div> : "Admin not authorized!"
      }</div>
    </div>
  )
}
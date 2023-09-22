
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { ethers } from "ethers";
import { Button, Modal, Blockie, useNotification, Loading } from 'web3uikit'
import marketplaceAbi from "../constants/abi.json";
import mainCollectionAbi from "../constants/mainCollectionAbi.json";
import networkMapping from "../constants/networkMapping.json";
import NFTBox from '../components/NftCard';
import axios from "axios";

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
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/get-all-active-items`)
      .then(response => response.json())
      .then(data => {
        setAssets(data.activeItems);
        fetch(`http://localhost:4000/get-all-collections`)
          .then(response => response.json())
          .then(data => {
            setCollections(data.subcollections);
          })
      })
  }, []);

  const [tokenUris, setTokenUris] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/admin/pinata/tokenuri`)
      .then(response => response.json())
      .then(data => {
        setTokenUris(data.data);
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

  const [addCreatorCreatorAddress, setAddCreatorCreatorAddress] = useState("");

  const [addingCreatorStatus, setAddingCreatorStatus] = useState(false);
  const [addingCreatorTransactionHash, setAddingCreatorTransactionHash] = useState(false)


  const { runContractFunction: addCreator } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "addCreator",
    params: {
      creatorAddress: addCreatorCreatorAddress
    },
    msgValue: ""
  })

  const [createSubcollectionName, setCreateSubcollectionName] = useState("");
  const [createSubcollectionCharityAddress, setCreateSubcollectionCharityAddress] = useState("");
  const [createSubcollectionProperties, setCreateSubcollectionProperties] = useState("0,0");

  const [creatingSubcollectionStatus, setCreatingSubcollectionStatus] = useState(false);
  const [creatingSubcollectionTransactionHash, setCreatingSubcollectionTransactionHash] = useState(false)

  const { runContractFunction: createSubcollection } = useWeb3Contract({
    abi: mainCollectionAbi,
    contractAddress: mainCollectionAddress,
    functionName: "createSubcollection",
    params: {
      name: createSubcollectionName,
      charityAddress: createSubcollectionCharityAddress,
      properties: createSubcollectionProperties.split(",")
    },
    msgValue: ""
  })

  const handleListItemSuccess = async (tx) => {
    dispatch({
      type: "success",
      message: "Tx successful: item listed",
      title: "Transaction Success",
      position: "topR"
    });

    setListingStatus(true);
    setListingTransactionHash(tx.hash);

    await tx.wait(1);

    setListingStatus(false);
  }

  const handleAddCreatorSuccess = async (tx) => {
    dispatch({
      type: "success",
      message: "Tx successful: creator added",
      title: "Transaction Success",
      position: "topR"
    });

    setAddingCreatorStatus(true);
    setAddingCreatorTransactionHash(tx.hash);

    await tx.wait(1);

    setAddingCreatorStatus(false);
  }

  const handleCreateSubcollectionSuccess = async (tx) => {
    dispatch({
      type: "success",
      message: "Tx successful: item bought",
      title: "Transaction Success",
      position: "topR"
    });

    setCreatingSubcollectionStatus(true);
    setCreatingSubcollectionTransactionHash(tx.hash);

    await tx.wait(1);

    setCreatingSubcollectionStatus(false);
  }

  const handleUpdateListingSuccess = async (tx) => {
    dispatch({
      type: "success",
      message: "Tx successful: item updated",
      title: "Transaction Success",
      position: "topR"
    });

    setUpdatingStatus(true);
    setUpdatingTransactionHash(tx.hash);

    await tx.wait(1);

    setUpdatingStatus(false);
  }

  const handleTransactionError = async (err) => {
    console.log(err)
    dispatch({
      type: "error",
      message: "Sorry for the error. Please refresh and try again.",
      title: "Transaction failed",
      position: "topR"
    })
  }

  const [selectedImage, setSelectedImage] = useState(null);
  const [pinataName, setPinataName] = useState("");
  const [pinataDescription, setPinataDescription] = useState("");
  const [pinataAttributesString, setPinataAttributesString] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [uploadingToPinataStatus, setUploadingToPinataStatus] = useState(false);

  const handleUploadClick = () => {
    if (selectedImage) {
      setUploadingToPinataStatus(true);
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('name', pinataName);
      formData.append('description', pinataDescription);
      formData.append('attributes', pinataAttributesString);

      axios.post('http://localhost:4000/admin/pinata/upload', formData)
        .then((response) => {
          alert(response.data);
          setUploadingToPinataStatus(false)
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  const [updateTokenId, setUpdateTokenId] = useState("1");
  const [updateItemPrice, setUpdateItemPrice] = useState("1");
  const [updateItemTokenUri, setUpdateItemTokenUri] = useState("");
  const [updateItemCharityAddress, setUpdateItemCharityAddress] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingTransactionHash, setUpdatingTransactionHash] = useState(false)


  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: mainCollectionAddress,
      tokenId: updateTokenId,
      price: ethers.utils.parseEther(updateItemPrice || "0") || "0",
      tokenUri: updateItemTokenUri,
      charityAddress: updateItemCharityAddress,
    },
    msgValue: ""
  })


  const [listItemNftAddress, setListItemNftAddress] = useState("");  // unused
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

  return (
    <div>
      <div>{
        (owner ? `${owner.toLowerCase()}` : "") == account ? <div>
          <div>
            <div className="p-4">
              <div>
                {!assets ? (<div>Assets couldn't fetched</div>) : (<div>
                  <div>
                    <div className="flex flex-col">

                      {collections.map(collection => {

                        return (
                          <div className="flex flex-1 mb-4">
                            <div>{collection.name}</div>
                            <div>{collection.itemId}</div>
                            {assets.map(asset => {
                              if (asset.subcollectionId == collection.itemId) {
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
                                    </a>
                                    <div className="flex-1 flex-wrap flex flex-col">
                                      <span>tokenId {asset.tokenId}, </span>
                                      <span>subcollectionId {asset.subcollectionId}, </span>
                                      <span className="text-xs break-all">charityAddress {asset.charityAddress}</span>
                                      <span className="text-xs break-all">tokenUri {asset.tokenUri}</span>
                                    </div>
                                  </div>
                                )
                              }
                            })}
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
                      onError: (err) => handleTransactionError(err)
                    });
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <h1>Add creator</h1>
                <div className="mt-4 mb-4">{addingCreatorStatus ? (<div>
                  Adding a creator in progress. Follow from <a target="_blank" className="underline hover:text-slate-500" href={`https://sepolia.etherscan.io/tx/${addingCreatorTransactionHash}`}>{prettyAddress(addingCreatorTransactionHash)}</a>
                </div>) : (<div>No adding creator on progress</div>)}</div>
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Creator Address" onChange={(e) => { setAddCreatorCreatorAddress(e.currentTarget.value) }} />
                <Button
                  theme="primary"
                  text="Add creator"
                  isFullWidth="true" type='button'
                  onClick={() => {
                    addCreator({
                      onSuccess: handleAddCreatorSuccess,
                      onError: (err) => handleTransactionError(err)
                    });
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <h1>Create subcollection</h1>
                <div className="mt-4 mb-4">{creatingSubcollectionStatus ? (<div>
                  Subcollection creation in progress. Follow from <a target="_blank" className="underline hover:text-slate-500" href={`https://sepolia.etherscan.io/tx/${creatingSubcollectionTransactionHash}`}>{prettyAddress(creatingSubcollectionTransactionHash)}</a>
                </div>) : (<div>No creating subcollection on progress</div>)}</div>
                <input className="p-2 border-2 w-auto mb-4" type="number" placeholder="Name" onChange={(e) => { setCreateSubcollectionName(e.currentTarget.value.toString()) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="charityAddress" onChange={(e) => { setCreateSubcollectionCharityAddress(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Properties (split with ,)" onChange={(e) => { setCreateSubcollectionProperties(e.currentTarget.value) }} />
                <Button
                  theme="primary"
                  text="Create subcollection"
                  isFullWidth="true" type='button'
                  onClick={() => {
                    createSubcollection({
                      onSuccess: handleCreateSubcollectionSuccess,
                      onError: (err) => handleTransactionError(err)
                    });
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <h1>Update listing</h1>
                <div className="mt-4 mb-4">{updatingStatus ? (<div>
                  Updating in progress. Follow from <a target="_blank" className="underline hover:text-slate-500" href={`https://sepolia.etherscan.io/tx/${updatingTransactionHash}`}>{prettyAddress(updatingTransactionHash)}</a>
                </div>) : (<div>No updating on progress</div>)}</div>
                <input className="p-2 border-2 w-auto mb-4" type="number" placeholder="price (ETH)" onChange={(e) => { setUpdateItemPrice(e.currentTarget.value.toString()) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Token Id" onChange={(e) => { setUpdateTokenId(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="charityAddress" onChange={(e) => { setUpdateItemCharityAddress(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="tokenUri" onChange={(e) => { setUpdateItemTokenUri(e.currentTarget.value) }} />
                <Button
                  theme="primary"
                  text="Update listing"
                  isFullWidth="true" type='button'
                  onClick={() => {
                    updateListing({
                      onSuccess: handleUpdateListingSuccess,
                      onError: (err) => handleTransactionError(err)
                    });
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <h1>Upload image to Pinata</h1>
                <div className="mt-4 mb-4">{uploadingToPinataStatus ? (<div>
                  Uploading image to Pinata. Please don't quit this page.
                </div>) : (<div>No uploading on progress</div>)}</div>
                <div>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {selectedImage && (
                    <div>
                      <img src={selectedImage} alt="Selected" width={200} />
                    </div>
                  )}
                </div>
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Name" onChange={(e) => { setPinataName(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="tokenUri description" onChange={(e) => { setPinataDescription(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="pirinç:100,bulgur:200,un:300" onChange={(e) => { setPinataAttributesString(e.currentTarget.value) }} />
                <Button
                  theme="primary"
                  text="Upload image"
                  isFullWidth="true" type='button'
                  onClick={handleUploadClick}
                />
                <div>
                  {
                    !tokenUris
                      ? (<div>No tokenUris uploaded currently</div>)
                      : (<div>
                        {
                          tokenUris.map(tokenUri => {
                            return (
                              <div>{tokenUri.name}: {tokenUri.tokenUri}</div>
                            )
                          })
                        }
                      </div>)
                  }
                </div>
              </div>
            </div>
          </div>
        </div> : "Admin not authorized!"
      }</div>
    </div>
  )
}

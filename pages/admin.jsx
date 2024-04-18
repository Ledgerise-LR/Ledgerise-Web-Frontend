
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { ethers } from "ethers";
import { Button, Modal, useNotification, CopyButton } from 'web3uikit'
import marketplaceAbi from "../constants/abi.json";
import mainCollectionAbi from "../constants/mainCollectionAbi.json";
import networkMapping from "../constants/networkMapping.json";
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import NFTBox from '../components/NftCard';
import axios from "axios";
import dynamic from "next/dynamic";
import QrCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { URL, PORT } from '@/serverConfig';


export default function Home() {

  const downloadAsPDF = async (divId, fileName) => {
    const div = document.getElementById(divId);

    const canvas = await html2canvas(div);

    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', pdf.internal.pageSize.getWidth() * 0 * -1, 0, pdf.internal.pageSize.getWidth() * 1, pdf.internal.pageSize.getHeight());

    pdf.save(fileName);
  };

  const handleDownloadPDF = () => {
    downloadAsPDF('main', 'LedgeriseQRs.pdf');
  };

  const Map = useMemo(() => dynamic(
    () => import('@/components/SelectionMap'),
    {
      loading: () => <p>The map is loading...</p>,
      ssr: false
    }
  ), [])

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


  const [isRouteModalOpen, setIsRouteModalOpen] = useState("");

  const hideRouteModal = () => {

    const routeData = {
      stampLocation: {
        latitude: parseInt(tempStampLocation[0] * 1000),
        longitude: parseInt(tempStampLocation[1] * 1000),
        decimals: 3
      },

      shipLocation: {
        latitude: parseInt(tempShippedLocation[0] * 1000),
        longitude: parseInt(tempShippedLocation[1] * 1000),
        decimals: 3
      },

      deliverLocation: {
        latitude: parseInt(tempDeliveredLocation[0] * 1000),
        longitude: parseInt(tempDeliveredLocation[1] * 1000),
        decimals: 3
      }
    }

    setListItemRoute(routeData);
    setIsRouteModalOpen(false);
  };

  const showRouteModal = () => {
    setIsRouteModalOpen(true);
  };

  const router = useRouter();
  const dispatch = useNotification();

  const chainString = chainId ? parseInt(chainId, 16).toString() : "80001";

  const [blockExplorerUrl, setBlockExplorerUrl] = useState("");

  useEffect(() => {
    setBlockExplorerUrl(blockExplorerMapping["blockExplorer"][chainString]);
  }, [chainString]);

  const marketplaceAddress = networkMapping["Marketplace"][chainString];
  const mainCollectionAddress = networkMapping["MainCollection"][chainString];

  const [assets, setAssets] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetch(`${URL}:${PORT}/subcollection/get-all-collections`)
      .then(response => response.json())
      .then(data => {
        setCollections(data.subcollections);

        fetch(`${URL}:${PORT}/active-item/get-all-active-items`)
          .then(response => response.json())
          .then(data => {

            let tempArr = [];

            data.activeItems.map(activeItem => {

              fetch(`${URL}:${PORT}/active-item/get-asset?tokenId=${activeItem.tokenId}&subcollectionId=${activeItem.subcollectionId}&nftAddress=${activeItem.nftAddress}`)
                .then(response => response.json())
                .then(async (data) => {
                  const asset = {
                    seller: data.activeItem.seller,
                    nftAddress: data.activeItem.nftAddress,
                    tokenId: data.activeItem.tokenId,
                    charityAddress: data.activeItem.charityAddress,
                    tokenUri: data.activeItem.tokenUri,
                    price: data.activeItem.price,
                    availableEditions: data.activeItem.availableEditions,
                    subcollectionId: data.activeItem.subcollectionId,
                    history: data.activeItem.history,
                    attributes: data.activeItem.attributes,
                    real_item_history: data.activeItem.real_item_history,
                    route: data.activeItem.route,
                    collaborators: data.activeItem.collaborators
                  }

                  const requestUrl = asset.tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
                  const tokenUriResponse = await (await fetch(requestUrl)).json();

                  asset.tokenName = tokenUriResponse.name;
                  tempArr.push(asset)
                }).then(() => {
                  setAssets(tempArr);
                })
            })
          })
      })
  }, []);

  const [tokenUris, setTokenUris] = useState([]);

  useEffect(() => {
    fetch(`${URL}:${PORT}/tokenuri/get-all`)
      .then(response => response.json())
      .then(data => {
        setTokenUris(data.data);
      })
  }, []);

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch(`${URL}:${PORT}/company/get-all`)
      .then(response => response.json())
      .then(data => {
        setCompanies(data.companies);
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
  const [createSubcollectionCompanyCode, setCreateSubcollectionCompanyCode] = useState("");
  const [createSubcollectionProperties, setCreateSubcollectionProperties] = useState("0,0");

  const [createSubcollectionCharityAddress, setCreateSubcollectionCharityAddress] = useState("");

  const [creatingSubcollectionStatus, setCreatingSubcollectionStatus] = useState(false);
  const [creatingSubcollectionTransactionHash, setCreatingSubcollectionTransactionHash] = useState(false)

  const handleCreateSubcollectionClick = () => {

    if (createSubcollectionCompanyCode != "") {
      const formData = new FormData();
      formData.append('name', createSubcollectionName);
      formData.append('image', selectedImage);
      formData.append('companyCode', createSubcollectionCompanyCode);

      axios.post(`${URL}:${PORT}/subcollection/create-subcollection`, formData)
        .then((res) => {
          if (res.data.success) {
            dispatch({
              type: "success",
              message: "Tx successful: subcollection created",
              title: "Transaction Success",
              position: "topR"
            });
          } else {
            dispatch({
              type: "error",
              message: "Sorry for the error. Please refresh and try again.",
              title: "Transaction failed",
              position: "topR"
            })
          }
        })
    }
  }

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


  const { runContractFunction: getSubcollectionCounter } = useWeb3Contract({
    abi: mainCollectionAbi,
    contractAddress: mainCollectionAddress,
    functionName: "getSubcollectionCounter",
    params: {},
  })


  const handleCreateSubcollectionSuccess = async (tx) => {
    setCreatingSubcollectionStatus(true);
    setCreatingSubcollectionTransactionHash(tx.hash);

    await tx.wait(1);

    // Get subcollection counter

    const subcollectionId = (await getSubcollectionCounter()) - 1;

    // update subcolletion db image

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('subcollectionId', subcollectionId);
    formData.append('companyCode', createSubcollectionCompanyCode);
    formData.append('nftAddress', mainCollectionAddress);

    axios.post(`${URL}:${PORT}/subcollection/update-subcollection-image`, formData)
      .then((res) => {
        const data = res.data;
        if (data.success) {
          dispatch({
            type: "success",
            message: "Tx successful: subcollection created",
            title: "Transaction Success",
            position: "topR"
          });
        } else if (!data.success) {
          dispatch({
            type: "error",
            message: "Sorry for the error. Please refresh and try again.",
            title: "Transaction failed",
            position: "topR"
          })
        }
      })
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

      axios.post(`${URL}:${PORT}/tokenuri/create`, formData)
        .then((response) => {
          alert(response.data);
          setUploadingToPinataStatus(false)
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [companyCharityAddress, setCompanyCharityAddress] = useState("");
  const [companyIBAN, setCompanyIBAN] = useState("");
  const [companyIBANReceipient, setCompanyIBANReceipient] = useState("");
  const [companyIBANReceipientDescription, setCompanyIBANReceipientDescription] = useState("");
  const [companyBankName, setCompanyBankName] = useState("");

  const [companySuccessText, setCompanySuccessText] = useState("");

  const handleCreateCompanyClick = () => {

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('name', companyName);
    formData.append('code', companyCode);
    formData.append('email', companyEmail);
    formData.append('password', companyPassword);
    formData.append('charityAddress', companyCharityAddress);
    formData.append('IBAN', companyIBAN);
    formData.append('receipientName', companyIBANReceipient);
    formData.append('bankName', companyBankName);

    axios.post(`${URL}:${PORT}/auth/company/create`, formData)
      .then((res) => {
        if (!res.success && res.err == "bad_request") return setCompanySuccessText("Couldn't create company. Please try again.");
        else if (res.success && res.company) return setCompanySuccessText("Successfully created.");
      });
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
  const [listTransactionHash, setListingTransactionHash] = useState(false);

  const [tempStampLocation, setTempStampLocation] = useState([null, null]);
  const [tempShippedLocation, setTempShippedLocation] = useState([null, null]);
  const [tempDeliveredLocation, setTempDeliveredLocation] = useState([null, null]);

  const [listItemRoute, setListItemRoute] = useState("");

  const [currentSelectingEvent, setCurrectSelectingEvent] = useState("stamp");


  const handleListItemClick = () => {

    axios.post(`${URL}:${PORT}/active-item/list-item`, {
      nftAddress: listItemNftAddress,
      price: listItemPrice,
      subcollectionId: listItemSubcollectionId,
      availableEditions: listItemAvailableEditions,
      route: listItemRoute,
      tokenUri: listItemTokenUri
    })
      .then((res) => {
        const data = res.data;
        if (data.success && !data.err) {
          alert("Item successfully listed.");
        } else {
          alert("Item list threw error.");
        }
      })
  }


  const { runContractFunction: listItem } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "listItem",
    params: {
      nftAddress: mainCollectionAddress,
      tokenId: parseInt(listTokenCounter),
      price: listItemPrice || "0",
      tokenUri: listItemTokenUri,
      charityAddress: listItemCharityAddress,
      availableEditions: listItemAvailableEditions,
      subCollectionId: listItemSubcollectionId,
      route: listItemRoute
    },
    msgValue: ""
  })

  const [owner, setOwner] = useState("X");

  async function updateUI() {
    setOwner(await getOwner());
    setListTokenCounter(await getListTokenCounter());
  }

  const [buyItemTokenId, setBuyItemTokenId] = useState("");
  const [buyItemDonorEmail, setBuyItemDonorEmail] = useState("");
  const [buyItemNftAddress, setBuyItemNftAddress] = useState("");

  const handleBuyItemClick = () => {
    axios.post(`${URL}:${PORT}/donate/payment/already_bought`, {
      nftAddress: buyItemNftAddress,
      tokenId: buyItemTokenId,
      phone_number: buyItemDonorEmail
    }).then((res) => {
      if (res.data.success) {
        alert("Successfully donated.")
      } else {
        alert("Donation failed.")
      }
    })
  }

  useEffect(() => {
    updateUI();
  }, [isWeb3Enabled, assets, listingStatus, listItemPrice]);


  const handleQrCodeHover = (e, tokenId) => {

    const printButtonWrapper = document.createElement("div");
    const printButton = document.createElement("div");

    printButtonWrapper.style.position = "absolute";
    printButtonWrapper.style.width = "100%";
    printButtonWrapper.style.height = "100%";
    printButtonWrapper.style.display = "flex";
    printButtonWrapper.style.justifyContent = "center";
    printButtonWrapper.style.alignItems = "center";
    printButtonWrapper.style.backgroundColor = "rgba(0,0,0,0.1)";
    printButtonWrapper.style.zIndex = "150";
    printButtonWrapper.style.left = "0";
    printButtonWrapper.style.top = "0";

    printButton.innerHTML = "Print";
    printButton.style.padding = "3px 16px";
    printButton.style.borderRadius = "10px";
    printButton.style.backgroundColor = "darkblue";
    printButton.style.color = "white";

    printButtonWrapper.appendChild(printButton)
    e.target.parentNode.appendChild(printButtonWrapper);

    let main = "";

    printButton.addEventListener("click", (e) => {

      main = document.createElement("div");
      main.id = "main";
      main.style.display = "flex";
      main.style.justifyContent = "space-between";
      main.style.padding = "10px";
      main.style.flexWrap = "wrap";
      main.style.width = "100px";
      main.style.height = "141px";
      e.target.parentNode.parentNode.parentNode.parentNode.appendChild(main);

      e.preventDefault();

      const qrCodeSvgs = document.getElementsByClassName(`asset-${tokenId}`);

      for (let i = 0; i < qrCodeSvgs.length; i++) {
        const qrCodeSvg = qrCodeSvgs[i];
        const copyQrCodeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        copyQrCodeSvg.setAttribute("width", "35");
        copyQrCodeSvg.setAttribute("height", "35");
        copyQrCodeSvg.setAttribute("viewBox", "0 0 21 21");

        copyQrCodeSvg.innerHTML = qrCodeSvg.innerHTML;

        main.appendChild(copyQrCodeSvg);

        if (i % 4 == 0) {
          handleDownloadPDF();
          main.innerHTML = "";
        }
      }

    })

    printButtonWrapper.addEventListener("mouseleave", (e) => {
      e.preventDefault();
      printButtonWrapper.remove();
      if (main != "") {
        main.remove()
      }
    })
  }


  return (
    <div>
      {
        isRouteModalOpen
          ? (
            <Modal visible={isRouteModalOpen} onCloseButtonPressed={hideRouteModal} onOk={hideRouteModal} onCancel={hideRouteModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Select the route for this item.</h1>}>
              <div>
                <div className={`p-4 cursor-pointer bg-slate-500 ${currentSelectingEvent == "stamp" ? "text-green-500" : "text-slate-50"}`} onClick={() => setCurrectSelectingEvent("stamp")}>Stamp Location</div>
                <div className={`p-4 cursor-pointer bg-slate-500 ${currentSelectingEvent == "shipped" ? "text-green-500" : "text-slate-50"}`} onClick={() => setCurrectSelectingEvent("shipped")}>Shipping Location</div>
                <div className={`p-4 cursor-pointer bg-slate-500 ${currentSelectingEvent == "delivered" ? "text-green-500" : "text-slate-50"}`} onClick={() => setCurrectSelectingEvent("delivered")}>Deliver Location</div>
              </div>
              <div className='h-96 w-full'>
                <Map
                  stampCoordinates={tempStampLocation}
                  shippedCoordinates={tempShippedLocation}
                  deliveredCoordinates={tempDeliveredLocation}
                  zoom={10}
                  currentSelectingEvent={currentSelectingEvent}
                  onUpdate={(coordiantesArray) => {
                    setTempStampLocation(coordiantesArray[0])
                    setTempShippedLocation(coordiantesArray[1])
                    setTempDeliveredLocation(coordiantesArray[2])
                  }}
                />
              </div>
            </Modal>
          )
          : ("")
      }
      <div>{
        (owner ? `${owner.toLowerCase()}` : "") == account ? <div>
          <div>
            <div className="p-4">
              <div>
                {!assets ? (<div>Assets couldn't fetched</div>) : (<div>
                  <div>
                    <div className="flex flex-col">
                      {
                        collections.map(collection => {

                          return (
                            <div className="flex flex-1 flex-col mb-4 p-4">
                              <div className="text-2xl flex items-center">
                                <div>{collection.name} - {collection.itemId}</div>
                                <div className='flex ml-4 border-2 rounded p-2 bg-blue-50'>
                                  <div>Copy NFT Address</div>
                                  <CopyButton
                                    revertIn={3000}
                                    text={collection.nftAddress}
                                  />
                                </div>
                              </div>
                              <hr className="my-4" />
                              <div className='flex'>
                                {assets.map(asset => {
                                  if (asset.subcollectionId == collection.itemId && asset.nftAddress == collection.nftAddress) {
                                    return (
                                      <div className='w-72 mr-5 mb-5' key={`${asset.nftAddress}${asset.tokenId}`}>
                                        <a href={`/assets?id=${asset.tokenId}&subcollectionId=${asset.subcollectionId}&nftAddress=${asset.nftAddress}`}>
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
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>)}
              </div>
              <div>
                {
                  !assets
                    ? (<div>Cannot fetch assets.</div>)
                    : (
                      <div>
                        {
                          assets.map(asset => {
                            return (
                              <div className='bg-slate-200 mb-5 p-8'>
                                <div className='flex justify-between px-4'>
                                  <div className='mb-4 text-xl'>{asset.tokenName} - {asset.tokenId}</div>
                                  <div className='bg-blue-900 text-slate-50 rounded-xl flex justify-center items-center px-4 cursor-pointer'>Print All</div>
                                </div>
                                <hr className='bg-slate-900 border-slate-800 my-4' />
                                <div className='flex'>
                                  {
                                    !asset.collaborators.length
                                      ? (
                                        asset.history.map(event => {
                                          if (event.key == "buy") {
                                            return (
                                              <div className='w-24 flex flex-col items-center aspect-square mr-10 p-4 bg-slate-100 cursor-pointer relative'>
                                                <QrCode
                                                  className={`w-full z-5 h-full asset-${asset.tokenId}`} value={`${asset.tokenId}-[${event.openseaTokenId}]`}
                                                />
                                                <div>{`${asset.tokenId}-[${event.openseaTokenId}]`}</div>
                                                {
                                                  event.isQrCodePrinted
                                                    ? (
                                                      <div className='text-2xl z-30 absolute w-full h-full left-0 top-0 flex justify-center items-center bg-opacity-10 bg-black'>
                                                        ✅
                                                      </div>
                                                    )
                                                    : ("")
                                                }
                                                <div className='w-full h-full absolute top-0 l-0 z-10'
                                                  onMouseEnter={(e) => {
                                                    handleQrCodeHover(e, asset.tokenId);
                                                  }}></div>
                                              </div>
                                            )
                                          }
                                        })
                                      )
                                      : (
                                        <div>
                                          <div className='flex'>
                                            {
                                              asset.collaborators.map((eachCollaboratorCluster) => {

                                                const numberOfCollaborators = parseInt(asset.tokenName.split("/")[1].split(")")[0]);
                                                if (eachCollaboratorCluster.length == numberOfCollaborators) {

                                                  for (let i = 0; i < eachCollaboratorCluster.length; i++) {
                                                    eachCollaboratorCluster[i] = parseInt(eachCollaboratorCluster[i].toString().split("_")[0]);
                                                  }

                                                  return (
                                                    <div className='w-24 flex flex-col items-center aspect-square mr-10 relative p-4 bg-slate-100 cursor-pointer'>
                                                      <QrCode
                                                        className={`w-full z-10 h-full asset-${asset.tokenId}`} value={`${asset.tokenId}-${JSON.stringify(eachCollaboratorCluster)}`}
                                                      />
                                                      <div>{`${asset.tokenId}-${JSON.stringify(eachCollaboratorCluster)}`}</div>
                                                      <div className='w-full h-full absolute top-0 l-0 z-10'
                                                        onMouseEnter={(e) => {
                                                          handleQrCodeHover(e, asset.tokenId);
                                                        }}></div>
                                                    </div>
                                                  )

                                                } else {
                                                  return;
                                                }
                                              })
                                            }
                                          </div>
                                        </div>
                                      )
                                  }
                                </div>
                                <div id={`asset-${asset.tokenId}`} className='w-3 h-3'>

                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                }
              </div>
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <div>List Item</div>
                <div className="mt-4 mb-4">{listingStatus ? (<div>
                  Listing in progress. Follow from <a target="_blank" className="underline hover:text-slate-500" href={`https://${blockExplorerUrl["blockExplorer"]}/tx/${listTransactionHash}`}>{prettyAddress(listTransactionHash)}</a>
                </div>) : (<div>No listing on progress</div>)}</div>
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="nftAddress" onChange={(e) => { setListItemNftAddress(e.currentTarget.value.toString()) }} />
                <input className="p-2 border-2 w-auto mb-4" type="number" placeholder="Price (TRY)" onChange={(e) => { setListItemPrice(e.currentTarget.value.toString()) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="charityAddress" onChange={(e) => { setListItemCharityAddress(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="tokenUri" onChange={(e) => { setListItemTokenUri(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="subcollectionId" onChange={(e) => { setListItemSubcollectionId(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="availableEditions" onChange={(e) => { setListItemAvailableEditions(e.currentTarget.value) }} />
                <Button
                  theme='secondary'
                  text='Choose Route'
                  isFullWidth="false"
                  type='button'
                  onClick={() => showRouteModal()}
                />
                <Button
                  theme="primary"
                  text="List item"
                  isFullWidth="true" type='button'
                  onClick={() => {
                    handleListItemClick()
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <h1>Add creator</h1>
                <div className="mt-4 mb-4">{addingCreatorStatus ? (<div>
                  Adding a creator in progress. Follow from <a target="_blank" className="underline hover:text-slate-500" href={`https://${blockExplorerUrl}/tx/${addingCreatorTransactionHash}`}>{prettyAddress(addingCreatorTransactionHash)}</a>
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
                <h1>Donate Item (already donated)</h1>
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Token Id" onChange={(e) => { setBuyItemTokenId(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Donor Email" onChange={(e) => { setBuyItemDonorEmail(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Nft Address" onChange={(e) => { setBuyItemNftAddress(e.currentTarget.value) }} />
                <Button
                  theme="primary"
                  text="Donate Item"
                  isFullWidth="true" type='button'
                  onClick={() => {
                    handleBuyItemClick()
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <h1>Create subcollection</h1>
                <div className="mt-4 mb-4">{creatingSubcollectionStatus ? (<div>
                  Subcollection creation in progress. Follow from <a target="_blank" className="underline hover:text-slate-500" href={`https://${blockExplorerUrl}/tx/${creatingSubcollectionTransactionHash}`}>{prettyAddress(creatingSubcollectionTransactionHash)}</a>
                </div>) : (<div>No creating subcollection on progress</div>)}</div>
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Name" onChange={(e) => { setCreateSubcollectionName(e.currentTarget.value.toString()) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Company Code" onChange={(e) => { setCreateSubcollectionCompanyCode(e.currentTarget.value) }} />
                <div>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {selectedImage && (
                    <div>
                      <img src={selectedImage} alt="Selected" width={200} />
                    </div>
                  )}
                </div>
                <Button
                  theme="primary"
                  text="Create subcollection"
                  isFullWidth="true" type='button'
                  onClick={() => {
                    handleCreateSubcollectionClick()
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <h1>Update listing</h1>
                <div className="mt-4 mb-4">{updatingStatus ? (<div>
                  Updating in progress. Follow from <a target="_blank" className="underline hover:text-slate-500" href={`https://${blockExplorerUrl}/tx/${updatingTransactionHash}`}>{prettyAddress(updatingTransactionHash)}</a>
                </div>) : (<div>No updating on progress</div>)}</div>
                <input className="p-2 border-2 w-auto mb-4" type="number" placeholder="Price (TRY)" onChange={(e) => { setUpdateItemPrice(e.currentTarget.value.toString()) }} />
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
              <div className="flex flex-1 flex-col mt-8 mb-8">
                <h1>Create company (doesn't include blockchain)</h1>
                <div>{companySuccessText}</div>
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Name" onChange={(e) => { setCompanyName(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Code" onChange={(e) => { setCompanyCode(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Email" onChange={(e) => { setCompanyEmail(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="IBAN" onChange={(e) => { setCompanyIBAN(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="IBAN receipient name" onChange={(e) => { setCompanyIBANReceipient(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="IBAN receipient description (Who is the receipient?)" onChange={(e) => { setCompanyIBANReceipientDescription(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Name of the bank" onChange={(e) => { setCompanyBankName(e.currentTarget.value) }} />
                <div>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {selectedImage && (
                    <div>
                      <img src={selectedImage} alt="Selected" width={200} />
                    </div>
                  )}
                </div>
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Password" onChange={(e) => { setCompanyPassword(e.currentTarget.value) }} />
                <input className="p-2 border-2 w-auto mb-4" type="text" placeholder="Charity Crypto Address" onChange={(e) => { setCompanyCharityAddress(e.currentTarget.value) }} />
                <Button
                  theme="primary"
                  text="Create Company"
                  isFullWidth="true" type='button'
                  onClick={handleCreateCompanyClick}
                />
                <div>
                  {
                    companies
                      ? companies.map(company => {
                        return (
                          <div className='flex'>
                            <div>{company.code} {company.name} {company.email}</div>
                          </div>
                        )
                      })
                      : ("")
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

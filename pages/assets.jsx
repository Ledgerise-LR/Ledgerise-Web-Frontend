import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ethers } from "ethers";
import { Button, Modal, Blockie, useNotification, Loading, Input, Logo } from 'web3uikit'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json"
import { calculatePercentage } from '@/utils/calculatePercentage';
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import dynamic from "next/dynamic"
import axios from 'axios';
import { URL, PORT } from '@/serverConfig';

const { MapContainer, TileLayer, Popup, Marker } = dynamic(() => import("react-leaflet"), { ssr: false })


export default function Home() {

  const [ethToUsdRate, setEthToUsdRate] = useState(null);

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      const rate = await getEthToUsdRate();
      setEthToUsdRate(rate);
    };

    fetchEthToUsdRate();
  }, []);

  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => <p>The map is loading...</p>,
      ssr: false
    }
  ), [])

  const [donor, setDonor] = useState({});

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
    return formattedDate;
  }

  const position = [51.505, -0.09];

  const { isWeb3Enabled, chainId, account } = useMoralis();

  const [asset, setAsset] = useState({
    seller: "0x0000000",
    nftAddress: "0x0000000",
    tokenId: "0",
    charityAddress: "0x0000000",
    tokenUri: "",
    price: "1000000000000000000",
    availableEditions: 0,
    history: [{
      key: "",
      date: "",
      price: "1000000000000000000",
      buyer: "",
      openseaTokenId: 0
    }],
    attributes: [],
    real_item_history: []
  });
  const [company, setCompany] = useState({});
  const [visualVerifications, setVisualVerifications] = useState({});
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [collection, setCollection] = useState({
    charityName: ""
  });
  const [isModalOpen, setIsModalOpen] = useState("");
  const [attributesPercentages, setAttributesPercentages] = useState([]);

  const idleLocation = {
    latitude: "",
    longtiude: ""
  }

  const [displayedStampLocation, setDisplayedStampLocation] = useState({ ...idleLocation });

  const [displayedShippedLocation, setDisplayedShippedLocation] = useState({ ...idleLocation });

  const [displayedDeliveredLocation, setDisplayedDeliveredLocation] = useState({ ...idleLocation });

  const [displayedStampTokenId, setDisplayedStampTokenId] = useState(0);
  const [displayedShippedTokenId, setdisplayedShippedTokenId] = useState(0);
  const [displayedDeliveredTokenId, setDisplayedDeliveredTokenId] = useState(0);

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState("");

  const hidePaymentModal = () => {
    setIsPaymentModalOpen(false)
  }

  const showPaymentModal = () => {
    setIsPaymentModalOpen(true)
  }

  const [isReportModalOpen, setIsReportModalOpen] = useState("");

  const hideReportModal = () => {
    setIsModalOpen(true)
    setIsReportModalOpen(false)
  }

  const showReportModal = () => {
    setIsReportModalOpen(true)
    setIsModalOpen(false)
  }

  const [isLocationModalOpen, setIsLocationModalOpen] = useState("")

  const hideLocationModal = () => {
    setDisplayedStampLocation({ ...idleLocation });
    setDisplayedShippedLocation({ ...idleLocation });
    setDisplayedDeliveredLocation({ ...idleLocation });

    setIsLocationModalOpen(false);
    setIsModalOpen(true);
  }

  const showLocationModal = async (stamp, shipped, delivered) => {

    setDisplayedStampLocation({
      latitude: stamp.latitude,
      longitude: stamp.longitude
    });
    setDisplayedShippedLocation({
      latitude: shipped.latitude,
      longitude: shipped.longitude
    });
    setDisplayedDeliveredLocation({
      latitude: delivered.latitude,
      longitude: delivered.longitude
    });

    setDisplayedStampTokenId(stamp.visualVerificationTokenId);
    setdisplayedShippedTokenId(shipped.visualVerificationTokenId);
    setDisplayedDeliveredTokenId(delivered.visualVerificationTokenId);

    setIsModalOpen(false)
    setIsLocationModalOpen(true);
  }

  const router = useRouter();
  const tokenId = router.query.id
  const subcollectionId = router.query.subcollectionId
  const dispatch = useNotification();

  function getOpenseaUrl(openseaTokenId) {
    const openseaUrl = `https://testnets.opensea.io/assets/${nftExplorerUrl}/${asset.nftAddress}/${openseaTokenId}`;
    return openseaUrl;
  }

  // function countNulls(collaboratorArray) {
  //   let nullCount = 0;
  //   for (let i = 0; i < collaboratorArray.length; i++) {
  //     const eachCollaborator = collaboratorArray[i];
  //     if (eachCollaborator == null || eachCollaborator == undefined) nullCount++;
  //   }

  //   return nullCount;
  // }


  const [isBuyItemPending, setIsBuyItemPending] = useState(false);
  const [buyItemSuccessText, setBuyItemSuccessText] = useState("");


  //////////////////////
  // Buy Item Handler //
  //////////////////////


  const handleBuyItem = () => {
    if (donor != {} && donor.school_number) {
      setIsModalOpen(true);
      setIsBuyItemPending(true);

      axios.post(`${URL}:${PORT}/donate/payment`, {
        nftAddress: asset.nftAddress,
        tokenId: asset.tokenId,
        charityAddress: asset.charityAddress,
        tokenUri: asset.tokenUri,
        price: asset.price,
        ownerAddressString: donor.school_number,
        currency: "crypto"
      })
        .then((res) => {
          setIsBuyItemPending(false);
          const data = res.data;

          if (data.success) {
            dispatch({
              type: "success",
              message: "Tx successful: Item donated.",
              title: "Transaction Success",
              position: "topR"
            });
            setBuyItemSuccessText(`Donated 1 ${tokenName} successfully. Thanks for your contribution.`);
            fetch(`${URL}:${PORT}/get-asset?tokenId=${tokenId}&subcollectionId=${subcollectionId}`)
              .then(response => response.json())
              .then(data => {
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
                setAsset(asset);
              })
          } else if (!data.success) {
            dispatch({
              type: "error",
              message: "Sorry for the error. Please refresh the page and try again.",
              title: "Transaction Failed",
              position: "topR"
            });
            setBuyItemSuccessText(`An error occured. Please refresh and try again.`);
          }
        })
    } else {
      dispatch({
        type: "info",
        message: "Please login to donate.",
        title: "Donation failed",
        position: "topR"
      })
    }
  }


  /////////////

  const [hasTxHashKey, setHasTxHashKey] = useState(false);

  const handleBuyItemSuccess = async (tx) => {
    dispatch({
      type: "success",
      message: "Tx successful: item bought",
      title: "Transaction Success",
      position: "topR"
    });
    localStorage.setItem("txHash", "example hash");
    showModal();
    localStorage.setItem("txHash", tx.hash);
    setHasTxHashKey(tx.hash);
    updateUI();
    await tx.wait(1);
    localStorage.setItem("txHash", "");
    setHasTxHashKey(false);
    fetch(`${URL}:${PORT}/get-asset?tokenId=${tokenId}&subcollectionId=${subcollectionId}`)
      .then(response => response.json())
      .then(data => {
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
        setAsset(asset);
      })
  }

  const handleBuyItemError = async (err) => {
    console.log(err)
    dispatch({
      type: "error",
      message: "Sorry for the error. Please refresh and try again.",
      title: "Transaction failed",
      position: "topR"
    })
  }

  const chainString = "80001";

  const [blockExplorerUrl, setBlockExplorerUrl] = useState("");
  const [nftExplorerUrl, setNftExplorerUrl] = useState("");

  useEffect(() => {
    setBlockExplorerUrl(blockExplorerMapping["blockExplorer"][chainString]);
    setNftExplorerUrl(blockExplorerMapping["nftExplorer"][chainString]);
  }, [chainString]);


  const marketplaceAddress = networkMapping["Marketplace"][chainString];

  const [reports, setReports] = useState([""]);

  useEffect(() => {
    if (tokenId) {
      fetch(`${URL}:${PORT}/get-asset?tokenId=${tokenId}&subcollectionId=${subcollectionId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data.activeItem.collaborators)
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
          setAsset(asset);
          fetch(`${URL}:${PORT}/get-single-collection?id=${asset.subcollectionId}`)
            .then(response => response.json())
            .then(data => {
              setCollection(data.subcollection);

              fetch(`${URL}:${PORT}/get-all-visual-verifications`)
                .then(response => response.json())
                .then(data => {
                  setVisualVerifications(data.data);
                })
            })
        })
    }
  }, [tokenId])

  useEffect(() => {
    if (collection.companyCode) {
      axios.post(`${URL}:${PORT}/company/get-company-from-code`, { code: collection.companyCode })
        .then((res) => {
          const companyData = res.data;
          setCompany(companyData.company);
        })
    }
  }, [collection])

  useEffect(() => {
    const _id = localStorage.getItem("_id");

    if (_id) {
      axios.post(`${URL}:${PORT}/auth/authenticate`, {
        _id: _id
      }).then((res) => {
        if (res.data.success) {
          setDonor(res.data.donor);
          fetch(`${URL}:${PORT}/reports/get-past?reporter=${res.data.donor.school_number}`)
            .then(response => response.json())
            .then(data => {
              setReports(data.data);
            })
        }
      }
      )
    }
  }, [])

  // const { runContractFunction: buyItem } = useWeb3Contract({
  //   abi: marketplaceAbi,
  //   contractAddress: marketplaceAddress,
  //   functionName: "buyItem",
  //   params: {
  //     nftAddress: asset.nftAddress,
  //     tokenId: asset.tokenId,
  //     charityAddress: asset.charityAddress,
  //     tokenUri: asset.tokenUri
  //   },
  //   msgValue: asset.price
  // })

  const generateReportCodes = () => {
    const reportCodesArray = [];

    if (isTimeoutSelected) {
      reportCodesArray.push(0);
    }
    if (isIrrelevantVisualSelected) {
      reportCodesArray.push(1);
    }
    if (isIncompatibleMeasurementsSelected) {
      reportCodesArray.push(2);
    }
    if (isOtherSelected) {
      reportCodesArray.push(3);
    }

    return reportCodesArray;
  }


  async function updateUI() {
    // get the token Uri
    // using the image tag from tokenURI, get the image

    const tokenUri = asset.tokenUri;
    if (tokenUri && asset && asset.tokenUri) {
      // IPFS Gateway: return ipfs files from a normal url
      const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenUriResponse = await (await fetch(requestUrl)).json();
      const imageURI = tokenUriResponse.image
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenUriResponse.name);
      setTokenDescription(tokenUriResponse.description);
      const percentages = await calculatePercentage("advancement", asset.attributes, asset.subcollectionId, asset.tokenId);
      setAttributesPercentages(percentages);
    }
  }

  useEffect(() => {
    if (asset) {
      updateUI();
    }
  }, [asset, isModalOpen, asset.attributes]);


  const retrieveQRCodeData = (qrString) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrString}`;
    if (window.toString() != "undefined") {
      window.open(qrUrl, "_blank")
    }
  }

  const [cardOwner, setCardOwner] = useState("");
  const [PAN, setPAN] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [CVV, setCVV] = useState("");

  const handleFiatDonation = () => {

    setIsBuyItemPending(true);
    setHasTxHashKey(true);
    hidePaymentModal();
    hideLocationModal();
    showModal();

    if (donor && donor.school_number != "") {

      axios.post(`${URL}:${PORT}/donate/payment/TRY`, {
        cardHolderName: cardOwner,
        cardNumber: PAN,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        CVV: CVV,
        tokenId: asset.tokenId,
        tokenURI: asset.tokenUri,
        donorId: donor._id, 
        tokenName: tokenName,
        tokenId: asset.tokenId,
        charityAddress: asset.charityAddress,
        nftAddress: asset.nftAddress
      })
        .then((res) => {
          const data = res.data;
          if (data.success) {
            setIsBuyItemPending(false);
            dispatch({
              type: "success",
              message: "Tx successful: Item donated.",
              title: "Transaction Success",
              position: "topR"
            });
            setBuyItemSuccessText(`Donated 1 ${tokenName} successfully. Thanks for your contribution.`);
            fetch(`${URL}:${PORT}/get-asset?tokenId=${tokenId}&subcollectionId=${subcollectionId}`)
              .then(response => response.json())
              .then(data => {
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
                setAsset(asset);
              })
          } else if (!data.success) {
            dispatch({
              type: "error",
              message: "Sorry for the error. Please refresh the page and try again.",
              title: "Transaction Failed",
              position: "topR"
            });
            setBuyItemSuccessText(`An error occured. Please refresh and try again.`);
          }
        })
      } else {
        dispatch({
          type: "info",
          message: "Tx failed: Please sign in to donate.",
          title: "Transaction info",
          position: "topR"
        });
      }
  }

  const [isTimeoutSelected, setIsTimeoutSelected] = useState("");
  const [isIrrelevantVisualSelected, setIsIrrelevantVisualSelected] = useState("");
  const [isIncompatibleMeasurementsSelected, setIsIncompatibleMeasurementsSelected] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState("");

  const [reportMessage, setReportMessage] = useState("");

  const [isReportIssuePending, setIsReportIssuePending] = useState(false);
  const [reportIssueSuccessText, setReportIssueSuccessText] = useState("");

  const handleReportIssue = () => {
    const _id = localStorage.getItem("_id");
    if (_id) {
      axios.post(`${URL}:${PORT}/auth/authenticate`, {
        _id: _id
      }).then((res) => {
        if (res.data.success) {

          setIsReportIssuePending(true);

          axios.post(`${URL}:${PORT}/reports/report-issue`, {
            reporter: res.data.donor.school_number.toString(),
            message: reportMessage,
            reportCodes: generateReportCodes(),
            timestamp: Date.now()
          }).then((reportRes) => {
            if (reportRes.data.success && reportRes.data.report) setReportIssueSuccessText("Issue successfully and transparently reported.");
            if (!reportRes.data.success) setReportIssueSuccessText("An error occured while reporting the issue. Please try again.");
            setIsReportIssuePending(false)
          })
        }
      })
    }
  }

  return (
    <>
      <div className='w-full py-20 px-40'>
        {isModalOpen
          ? (<Modal visible={isModalOpen} onCloseButtonPressed={hideModal} onOk={hideModal} onCancel={hideModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Thank you for your contribution!!! 🎉 🎉</h1>}>
            <div className='p-5'>
              <div className='mb-12'>
                <div className='text-2xl flex justify-between'>
                  <div>My Donations</div>
                  <div className='flex text-sm items-center p-2'>
                    <div>Is there something wrong?</div>
                    <div className='p-2 bg-blue-900 text-slate-50 rounded ml-2 cursor-pointer' onClick={() => { showReportModal() }}>Report an Issue</div>
                  </div>
                </div>
                <hr className='mb-3' />
                <ul>
                  {
                    asset.history.map(event => {
                      if (event.buyer && event.openseaTokenId >= 0) {
                        // https://sepolia.etherscan.io/tx/0x0f10b50aad6b472a42910bfa4a1664989486bf917486a97ebc24f98a3f71bf39
                        return (
                          <li className='mb-8'>
                            <div className='text-slate-900'>Donated | <strong>{event.date}</strong></div>
                            <a target='_blank' className='underline text-slate-800 hover:text-slate-600' href={getOpenseaUrl(event.openseaTokenId - 1)}>View certificate</a>. Verify the <strong>donation transaction</strong> <a href={`https://${blockExplorerUrl}/tx/${event.transactionHash}`} target='_blank' className='underline hover:text-slate-800 font-bold'>here</a>. Id #{event.openseaTokenId - 1}
                            <div>
                              {
                                !asset.collaborators.length
                                  ? (<div><button className='underline hover:text-slate-700' target='blank' onClick={() => {
                                    retrieveQRCodeData(`${asset.tokenId}-[${event.openseaTokenId}]`);
                                  }}>View the QR code</button> printed on your physical donation. Click <a className='underline cursor-pointer' href={`/receipt?id=${asset.tokenId}-${event.openseaTokenId}`} target='_blank'>here</a> can download "Bağış Alındı Makbuzu".</div>)

                                  : (
                                    <div>
                                      {
                                        asset.collaborators.map((eachCollaboratorCluster) => {

                                          return eachCollaboratorCluster.map((eachCollaborator) => {

                                            if (eachCollaborator != null) {

                                              const openseaTokenId = eachCollaborator.split("_")[0];
                                              const buyerAddress = eachCollaborator.split("_")[1];
                                              if (openseaTokenId == event.openseaTokenId && buyerAddress == event.buyer) {

                                                const numberOfCollaborators = parseInt(tokenName.split("/")[1].split(")")[0]);
                                                if (eachCollaboratorCluster.length == numberOfCollaborators) {
                                                  return (
                                                    <div><button className='underline hover:text-slate-700' target='blank' onClick={() => {
                                                      let collaboratorsDataArray = [];
                                                      for (let i = 0; i < eachCollaboratorCluster.length; i++) {
                                                        const eachCollaborator = eachCollaboratorCluster[i];
                                                        collaboratorsDataArray.push(parseInt(eachCollaborator.split("_")[0]));
                                                      }
                                                      retrieveQRCodeData(`${asset.tokenId}-${JSON.stringify(collaboratorsDataArray)}`);
                                                    }}>View the QR code</button> printed on your physical donation. Belonging to <strong>{eachCollaboratorCluster.length - 1} people you collaborated.</strong></div>
                                                  )
                                                } else {
                                                  return (<div>Currently waiting for donation of <strong>{numberOfCollaborators - eachCollaboratorCluster.length} more people.</strong> Thank you for your understanding.</div>)
                                                }
                                              }
                                            }
                                          })
                                        })
                                      }
                                    </div>
                                  )

                              }
                            </div>

                            <div>
                              {
                                asset.real_item_history
                                  ? (asset.real_item_history.map(realItemCluster => {

                                    let eventTemplate = {
                                      status: false,
                                      date: "",
                                      latitude: "",
                                      longitude: "",
                                      txHash: ""
                                    }

                                    let stamp = { ...eventTemplate }, shipped = { ...eventTemplate }, delivered = { ...eventTemplate };
                                    realItemCluster.map(realItemEvent => {
                                      if (realItemEvent.openseaTokenId == event.openseaTokenId && realItemEvent.buyer == event.buyer) {
                                        if (realItemEvent.key == "stamp") {
                                          stamp.status = true;
                                          stamp.date = prettyDate(realItemEvent.date);
                                          stamp.latitude = realItemEvent.location.latitude;
                                          stamp.longitude = realItemEvent.location.longitude;
                                          stamp.txHash = realItemEvent.transactionHash;
                                          stamp.visualVerificationTokenId = realItemEvent.visualVerificationTokenId;
                                        } else if (realItemEvent.key == "shipped") {
                                          shipped.status = true;
                                          shipped.date = prettyDate(realItemEvent.date);
                                          shipped.latitude = realItemEvent.location.latitude;
                                          shipped.longitude = realItemEvent.location.longitude;
                                          shipped.txHash = realItemEvent.transactionHash;
                                          shipped.visualVerificationTokenId = realItemEvent.visualVerificationTokenId;
                                        } else if (realItemEvent.key == "delivered") {
                                          delivered.status = true;
                                          delivered.date = prettyDate(realItemEvent.date);
                                          delivered.latitude = realItemEvent.location.latitude;
                                          delivered.longitude = realItemEvent.location.longitude;
                                          delivered.txHash = realItemEvent.transactionHash;
                                          delivered.visualVerificationTokenId = realItemEvent.visualVerificationTokenId;
                                        }
                                      }
                                    })

                                    if (stamp.status || shipped.status || delivered.status) {
                                      return (
                                        <div className='mt-5'>
                                          <div className='relative w-full justify-between flex flex-1 items-center'>
                                            <div className='absolute w-full h-0.5 bg-slate-400'></div>
                                            <div className='flex bg-slate-300 p-3 w-64 rounded-lg z-10'>
                                              <div className={`h-7 my-auto border-2 aspect-square rounded-full flex items-center justify-center text-slate-200 ${stamp.status ? "bg-green-500" : "bg-slate-200"}`}>✓</div>
                                              <div className='flex flex-col ml-4'>
                                                <div className='text-sm'>{stamp.status ? (stamp.date) : "waiting for production 🕒"}</div>
                                                <div className='text-xs mt-2 rounded'>{stamp.status ? (
                                                  <div>
                                                    <span className='mr-2'>Produced</span>
                                                    <a className='px-4 py-1 rounded bg-green-700 text-slate-50' href={`https://${blockExplorerUrl}/tx/${stamp.txHash}`} target='_blank'>Verification</a>
                                                  </div>) : "waiting 🕒"}</div>
                                              </div>
                                            </div>
                                            <div className='flex bg-slate-300 p-3 w-64 rounded-lg z-10'>
                                              <div className={`h-7 my-auto border-2 aspect-square rounded-full flex items-center justify-center text-slate-200 ${shipped.status ? "bg-green-500" : "bg-slate-200"}`}>✓</div>
                                              <div className='flex flex-col ml-4'>
                                                <div className='text-sm'>{shipped.status ? (shipped.date) : "waiting for shipment 🕒"}</div>
                                                <div className='text-xs mt-2 rounded'>{shipped.status ? (
                                                  <div>
                                                    <span className='mr-2'>Supply Center</span>
                                                    <a className='px-4 py-1 rounded bg-green-700 text-slate-50' href={`https://${blockExplorerUrl}/tx/${shipped.txHash}`} target='_blank'>Verification</a>
                                                  </div>) : "waiting 🕒"}</div>
                                              </div>
                                            </div>
                                            <div className='flex bg-slate-300 p-3 w-64 rounded-lg z-10'>
                                              <div className={`h-7 my-auto border-2 aspect-square rounded-full flex items-center justify-center text-slate-200 ${delivered.status ? "bg-green-500" : "bg-slate-200"}`}>✓</div>
                                              <div className='flex flex-col ml-4'>
                                                <div className='text-sm'>{delivered.status ? (delivered.date) : "waiting for delivery 🕒"}</div>
                                                <div className='text-xs mt-2 rounded'>{delivered.status ? (
                                                  <div>
                                                    <span className='mr-2'>Delivered</span>
                                                    <a className='px-4 py-1 rounded bg-green-700 text-slate-50' href={`https://${blockExplorerUrl}/tx/${delivered.txHash}`} target='_blank'>Verification</a>
                                                  </div>) : "waiting 🕒"}</div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className='flex flex-1 mt-3 text-slate-200 items-center'>
                                            <div className='text-slate-700 mr-6'>The <strong>route</strong> and <strong>visual verification</strong> of your donation is <strong>ready.</strong></div>
                                            <div onClick={() => showLocationModal(stamp, shipped, delivered)
                                            } className='mr-5 p-2 w-36 flex justify-center bg-green-700 rounded cursor-pointer shadow-green-600 shadow-lg'>View verification</div>
                                          </div>
                                          <hr className='mt-7' />
                                        </div>
                                      )
                                    }
                                  }))
                                  : ("")}
                            </div>
                          </li>)
                      }
                    })}
                </ul>
              </div>

              {isBuyItemPending
                ? (<div>
                  <div className='text-2xl'>Pending</div>
                  <hr className='mb-3' />
                  <ul>
                    <li>Buy transaction pending, please wait. <strong>Don't close this tab.</strong></li>
                    <li><Loading spinnerColor='gray' spinnerType='loader' /></li>
                  </ul>
                </div>)
                : ("")}
            </div >
          </Modal >)
          :
          isLocationModalOpen
            ? (
              <Modal visible={isLocationModalOpen} onCloseButtonPressed={hideLocationModal} onOk={hideLocationModal} onCancel={hideLocationModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Transparent route of your donation</h1>}>
                <div className='h-96 w-full z-30'>
                  <Map
                    stampCoordinates={displayedStampLocation}
                    shippedCoordinates={displayedShippedLocation}
                    deliveredCoordinates={displayedDeliveredLocation}
                    deliverVisualTokenId={displayedDeliveredTokenId}
                    shipVisualTokenId={displayedShippedTokenId}
                    stampVisualTokenId={displayedStampTokenId}
                    visualVerifications={visualVerifications}
                    route={asset.route}
                    zoom={10}
                  />
                </div>
              </Modal>
            ) : isPaymentModalOpen
              ? (
                <Modal hasFooter={false} 
                width='100%'
                visible={isPaymentModalOpen} onCloseButtonPressed={hidePaymentModal} onOk={hidePaymentModal} onCancel={hidePaymentModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Bağışınızı Tamamlayın</h1>}>
                  <div className='mb-8 text-slate-500'>Sayın {donor.name} {donor.surname}, bağışınızı tamamlamak için son bir adım kaldı. Lütfen kart bilgilerinizi giriniz.</div>
                  <div className='w-full mb-8 h-24 shadow-md relative flex flex-1 items-center justify-between'>
                    <div className='absolute w-full h-0.5 bg-slate-500 z-10'></div>
                    <div className='absolute w-1/2 h-1 bg-green-500 z-10'></div>
                    <div className='h-full flex flex-col ml-24 z-10 items-center'>
                      <div className='w-20 z-10'>
                        <img className='z-10' src="https://www.svgrepo.com/show/108470/id-card.svg" alt="Kimlik" />
                      </div>
                      <div>Kimlik Doğrulama</div>
                    </div>
                    <div className='h-full flex flex-col z-10 items-center'>
                      <div className='w-20 z-10'>
                        <img className='z-10' src="https://www.svgrepo.com/show/108470/id-card.svg" alt="Kimlik" />
                      </div>
                      <div>Kart Bilgileri</div>
                    </div>
                    <div className='h-full flex flex-col mr-24 z-10 items-center'>
                      <div className='w-20 z-10'>
                        <img className='z-10' src="https://www.svgrepo.com/show/108470/id-card.svg" alt="Kimlik" />
                      </div>
                      <div>Onay Sayfası</div>
                    </div>
                  </div>
                  <div className='flex flex-1'>
                    <form className='flex flex-col w-1/2 mr-12 shadow-xl p-10 mb-8' action="" method="post">
                      <Input
                        label='Kart Sahibinin İsmi'
                        style={{
                          border: "1px solid black",
                          borderRadius: "5px",
                          marginBottom: "20px"
                        }}
                        onChange={(e) => setCardOwner((e.target.value))}
                      />
                      <Input
                        type='number'
                        label='Kredi Kartı Numaranız'
                        style={{
                          border: "1px solid black",
                          borderRadius: "5px",
                          marginBottom: "20px"
                        }}
                        onChange={(e) => setPAN((e.target.value))}
                      />
                      <div className='flex mb-8'>
                        <select className='w-1/5 border rounded mr-4 border-black p-2' name="expiryMonth" onChange={(e) => setExpiryMonth((e.target.value))}>
                          <option value="">Ay</option>
                          <option value="01">Ocak</option>
                          <option value="02">Şubat</option>
                          <option value="03">Mart</option>
                          <option value="04">Nisan</option>
                          <option value="05">Mayıs</option>
                          <option value="06">Nisan</option>
                          <option value="07">Haziran</option>
                          <option value="08">Ağustos</option>
                          <option value="09">Eylül</option>
                          <option value="10">Ekim</option>
                          <option value="11">Kasım</option>
                          <option value="12">Aralık</option>
                        </select>
                        <select className='w-1/5 mr-4 border rounded border-black p-2' name="expiryYear" onChange={(e) => setExpiryYear((e.target.value))}>
                          <option value="">Yıl</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                          <option value="2029">2029</option>
                          <option value="2030">2030</option>
                        </select>
                      </div>
                      <div className='flex justify-between mb-4 w-2/5'>
                        <Input 
                          type='number'
                          style={{
                            border: "1px solid black",
                            borderRadius: "5px"
                          }}
                          label='CVV'
                          onChange={(e) => setCVV((e.target.value))}
                        />
                      </div>
                    <div>
                      <hr />
                      <div className='mt-4 mb-2'>Geçerli Ödeme Yöntemleri</div>
                      <div className='flex flex-1 items-center'>
                        <div className='w-24'> 
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" alt="Mastercard" />
                        </div>
                        <div className='w-24'>
                          <img src="https://st4.depositphotos.com/1050070/21934/i/450/depositphotos_219349070-stock-photo-chisinau-moldova-september-2018-visa.jpg" alt="Visa" />
                        </div>
                        <div className='w-24'>
                          <img src="https://pentagram-production.imgix.net/de996aa4-5343-4200-a466-ab8fc7eafa80/am_amex_06.jpg?rect=%2C%2C%2C&w=640&fm=jpg&q=70&auto=format" alt="American Express" />
                        </div>
                      </div>
                    </div>
                    <hr className='mt-4'/>
                    <button
                          className='w-2/3 mt-4 border p-2 rounded-md bg-green-500 text-white font-bold'
                          onClick={() => {
                            handleFiatDonation()
                          }}
                        >
                          Bağış Yap
                        </button>
                    </form>
                    <div className='w-1/2 shadow-xl p-8 mb-8'>
                      <div className='text-gray-600 font-bold text-2xl mb-2'>❤️ Bağış Özeti</div>
                      <div>Sayın, {donor.name} {donor.surname}. Ledgerise ailesine hoş geldiniz.</div>
                      <div className='flex justify-between w-full mt-8'>
                        <div className='font-bold'>Bağış İsmi</div>
                        <div>{company.name} | {tokenName}</div>
                      </div>
                      <div className='flex justify-between w-full mt-4'>
                        <div className='font-bold'>Bağış Tipi</div>
                        <div>Yardım / Erzak Kolisi</div>
                      </div>
                      <div className='flex justify-between w-full mt-4'>
                        <div className='font-bold'>Ödeme Yöntemi</div>
                        <div>Kredi / Banka Kartı</div>
                      </div>
                      <hr className='mt-4'/>
                      <div className='flex justify-between w-full mt-4'>
                        <div className='font-bold'>Toplam Bağış (Türk Lirası)</div>
                        <div>{parseFloat(asset.price)} TL</div>
                      </div>
                    </div>
                  </div>
                </Modal>
              )
              : isReportModalOpen
                ? <Modal visible={isReportModalOpen} onCloseButtonPressed={hideReportModal} onOk={hideReportModal} onCancel={hideReportModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Report an Issue</h1>}>
                  <div>Tell us what's going wrong.</div>
                  <div>
                    <form action="" method='POST' className='flex flex-col'>
                      <div className='flex'>
                        <div onClick={() => { setIsTimeoutSelected(!isTimeoutSelected) }} className={`mr-4 border rounded p-2 cursor-pointer hover:bg-slate-200 transition-all ${isTimeoutSelected ? "bg-slate-300" : "bg-slate-50"}`}>No verification for a long time</div>
                        <div onClick={() => { setIsIrrelevantVisualSelected(!isIrrelevantVisualSelected) }} className={`mr-4 border rounded p-2 cursor-pointer hover:bg-slate-200 transition-all ${isIrrelevantVisualSelected ? "bg-slate-300" : "bg-slate-50"}`}>The image verification are irrelevant</div>
                        <div onClick={() => { setIsIncompatibleMeasurementsSelected(!isIncompatibleMeasurementsSelected) }} className={`mr-4 border rounded p-2 cursor-pointer hover:bg-slate-200 transition-all ${isIncompatibleMeasurementsSelected ? "bg-slate-300" : "bg-slate-50"}`}>Incompatible Measurements</div>
                        <div onClick={() => { setIsOtherSelected(!isOtherSelected) }} className={`mr-4 border rounded p-2 cursor-pointer hover:bg-slate-200 transition-all ${isOtherSelected ? "bg-slate-300" : "bg-slate-50"}`}>Other</div>
                      </div>
                      <div className='mt-12'>Elaborate on the issue you experience.</div>
                      <textarea className='my-2 border outline-none p-2' name="message" id="message" cols="10" rows="5" onChange={(e) => setReportMessage(e.target.value)}></textarea>

                      <div onClick={() => {
                        handleReportIssue()
                      }} className='p-2 bg-blue-900 text-slate-50 rounded border w-fit my-2 cursor-pointer'>Send Report</div>
                      <div>
                        {
                          isReportIssuePending
                            ? <div className='flex'>
                              <div className='mr-2'>Reporting issue. Please wait.</div>
                              <Loading spinnerColor='gray' spinnerType='loader' />
                            </div>
                            : <div>{reportIssueSuccessText}</div>
                        }
                      </div>
                    </form>
                  </div>
                  <hr />
                  <div className='p-2'>
                    {
                      !reports.length
                        ? <div>No past reports. Everything works fine!</div>
                        : reports.map(report => {
                          return (
                            <div className='border p-2 rounded mb-2'>
                              <div className='flex'>
                                <div>{prettyDate(report.timestamp)}</div>
                                <div className='mx-4'>|</div>
                                <div>Issue Code: {report.reportCodes}</div>
                              </div>
                              <div>Message: {report.message}</div>
                            </div>
                          )
                        })
                    }
                  </div>
                </Modal>
                : ("")
        }

        <div className='flex flex-1 items-end relative h-full'>
          <div className='border-2 w-1/2 h-screen flex flex-col justify-center'>
            <Image loader={() => imageURI} src={imageURI} width="500" height="1" />
          </div>
          <div className='p-5'>
            <div className='absolute top-0 flex flex-1 items-center'>
              <div>
                <div className='mr-5 text-xl text-slate-700'>Powered by <strong>{company.name}</strong></div>
                <div className='mr-5 text-slate-800 mt-1'>
                  <span className='text-sm'>{prettyAddress(asset.charityAddress)} </span>
                  <a target='_blank' href={`https://${blockExplorerUrl}/address/${asset.charityAddress}`} className='text-xs underline text-cyan-900'>view on Transparent Verifier</a>
                </div>
                <div className='mt-5'>
                  <Button
                    theme='secondary'
                    text='View My Donation History On This Item'
                    onClick={() => showModal()}
                  />
                </div>
              </div>
              <div className='h-16 aspect-square ml-5 bg-slate-50 border-2 rounded-full flex flex-1 justify-center items-center p-1 relative'>
                <img className='rounded-full' src={company.image} alt={company.name} />
                <img className='absolute w-8 -top-3 -right-3' src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/640px-Twitter_Verified_Badge.svg.png" alt="verified" />
              </div>
            </div>
            <div className='mb-3'>
              <div className='mr-5 text-xl text-slate-400'> #{tokenId}</div>
              <span className='text-slate-900 text-6xl'>{tokenName.toUpperCase()}</span>
            </div>
            <div className='flex flex-1 items-center mt-5 mb-10'>
              <div className='border-2 rounded-full h-10 aspect-square mr-2 flex items-center justify-center'>
                <Blockie seed={asset.seller} />
              </div>
              <div>
                <div className='text-slate-500 text-xs'>Owner</div>
                <div className='text-slate-700 text-sm'>{prettyAddress(asset.seller)}</div>
              </div>
            </div>
            <div className='text-slate-500'>{asset.availableEditions} available stocks</div>
            <hr />

            {
              donor._id && donor._id.length > 0
                ? (
                  <div>
                    <div className='text-sm text-slate-500 mt-3'>Current donation fee:</div>
                    <div className='flex items-center justify-between w-full mt-2'>
                      <div>
                        <span className='text-4xl font-semibold'>{asset.price - 0.01} </span>
                        <span className='text-slate-500'>TL</span>
                      </div>
                      <div className='w-fit mx-2'>
                        <Button isFullWidth="true" theme='primary' type='button' text='Donate USD' onClick={() => {
                          showPaymentModal();
                        }} style={{
                          border: "black",
                          height: "3rem",
                          borderRadius: "100px",
                          fontSize: "16px"
                        }} />
                      </div>
                      <div>or</div>
                      <div className='w-fit mx-2'>
                        <Button isFullWidth="true" theme='primary' type='button' text='Donate TEST' onClick={() => {
                          handleBuyItem()
                        }} style={{
                          border: "black",
                          height: "3rem",
                          borderRadius: "100px",
                          fontSize: "16px"
                        }} />
                      </div>
                    </div>
                  </div>
                )
                : ("")
            }
          </div>
        </div>
        <div className='mt-7 flex flex-1'>
          <div className='w-1/2 mb-36'>
            <div className='mb-16'>
              <div className='text-3xl text-slate-900 mb-1'>Description</div>
              <hr className='mb-3' />
              <div className='text-slate-700'>{tokenDescription}</div>
            </div>
            <div>
              <div className='text-3xl text-slate-900 mb-3'>Distribution Of Earnings</div>
              <hr className='mb-3' />
              <div>

                <div className='flex flex-1 mb-5 border h-24 justify-between rounded'>
                  <div className='flex flex-1 items-center'>
                    <div className='h-full aspect-square flex items-center justify-center bg-slate-50 border-r border-blue-900'>
                      <img className='p-2' src={company.image} alt={company.name} />
                    </div>
                    <div className='ml-4 text-lg'>{company.name}</div>
                  </div>
                  <div className='flex flex-1 flex-col justify-center items-end mr-4'>
                    <div>
                      <span className='font-semibold text-lg'>99.5% </span>
                      <span className='text-sm text-slate-700'>of proceeds</span>
                    </div>
                  </div>
                </div>

                {/* <div className='flex flex-1 mb-5 border h-24 justify-between rounded'>
                  <div className='flex flex-1 items-center'>
                    <div className='h-full aspect-square flex items-center justify-center bg-slate-50 border-r border-blue-900'>
                      <Blockie seed={asset.seller} size={12} />
                    </div>
                    <div className='ml-4 text-lg'>Creator</div>
                  </div>
                  <div className='flex flex-1 flex-col justify-center items-end mr-4'>
                    <div>
                      <span className='font-semibold text-lg'>20% </span>
                      <span className='text-sm text-slate-700'>of the proceeds</span>
                    </div>
                  </div>
                </div> */}

                <div className='flex flex-1 mb-5 border h-24 justify-between rounded'>
                  <div className='flex flex-1 items-center'>
                    <div className='h-full p-2 aspect-square flex items-center justify-center bg-slate-50 border-r border-blue-900'>
                      <img src="logocompact.svg" alt="Ledgerise " />
                    </div>
                    <div className='ml-4 text-lg'>Ledgerise®</div>
                  </div>
                  <div className='flex flex-1 flex-col justify-center items-end mr-4'>
                    <div>
                      <span className='font-semibold text-lg'>0.5% </span>
                      <span className='text-sm text-slate-700'>of proceeds</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className='mt-16'>
              <div className='text-3xl text-slate-900 mb-1'>This aid includes</div>
              <hr className='mb-3' />
              <div>
                {
                  asset.attributes.map(trait => {
                    return (
                      <div className='flex flex-1 justify-between p-5 border rounded mb-4 items-center'>
                        <div>
                          <div className='text-slate-800'>{trait.trait_type}</div>
                          <div className='text-slate-900 text-xl'>{trait.value}</div>
                        </div>
                        <div>
                          <span className='text-sm text-slate-500'>more than</span>
                          <span className='text-xl'> {attributesPercentages[asset.attributes.indexOf(trait)]}%</span>
                          <span className='text-sm text-slate-500'> items in the collection</span>
                        </div>
                      </div>)
                  })}
              </div>
            </div>
          </div>
          <div className='ml-auto'>
            <div className='text-2xl mb-2'>History</div>
            <hr className='mb-2' />
            <div className='flex flex-1 flex-col-reverse relative'>
              <div className='absolute w-px h-full ml-1.5 top-5 bg-slate-300 z-0'></div>
              {
                asset.history.map((event) => {
                  return (
                    <div className='mb-4'>{
                      event.key == "buy"
                        ? <div className='flex-1 flex items-center'>
                          <div className='w-3 h-3 mr-5 rounded-full bg-slate-700 z-0'></div>
                          <div>
                            <div className='text-slate-700'>Item is <strong>donated</strong> for {asset.price-0.01} TL by {prettyAddress(event.buyer)}.</div>
                            <div className='text-slate-500'>{event.date}</div>
                          </div>
                        </div>
                        : event.key == "list"
                          ? (< div className='flex-1 flex items-center'>
                            <div className='w-3 h-3 mr-5 rounded-full bg-slate-700 z-0'></div>
                            <div>
                              <div className='text-slate-700'>Item is listed for {asset.price-0.01} TL.</div>
                              <div className='text-slate-500'>{event.date}</div>
                            </div>
                          </div>)
                          : (< div className='flex-1 flex items-center'>
                            <div className='w-3 h-3 mr-5 rounded-full bg-slate-700 z-0'></div>
                            <div>
                              <div className='text-slate-700'>Item is updated for {asset.price-0.01} TL.</div>
                              <div className='text-slate-500'>{event.date}</div>
                            </div>
                          </div>)
                    }</div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
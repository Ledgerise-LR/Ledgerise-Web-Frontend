import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ethers } from "ethers";
import { Button, Modal, Blockie, useNotification, Loading } from 'web3uikit'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json"
import { calculatePercentage } from '@/utils/calculatePercentage';

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
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [collection, setCollection] = useState({
    charityName: ""
  });
  const [isModalOpen, setIsModalOpen] = useState("");
  const [attributesPercentages, setAttributesPercentages] = useState([]);

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const router = useRouter();
  const tokenId = router.query.id
  const dispatch = useNotification();

  function getOpenseaUrl(openseaTokenId) {
    const openseaUrl = `https://testnets.opensea.io/assets/sepolia/${asset.nftAddress}/${openseaTokenId}`;
    return openseaUrl;
  }

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
    fetch(`http://localhost:4000/get-asset?tokenId=${tokenId}`)
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
          real_item_history: data.activeItem.real_item_history
        }
        setAsset(asset);
      })
  }

  const handleBuyItemError = async () => {
    dispatch({
      type: "error",
      message: "Sorry for the error. Please refresh and try again.",
      title: "Transaction failed",
      position: "topR"
    })
  }

  const chainString = chainId ? parseInt(chainId, 16).toString() : "11155111";

  const marketplaceAddress = networkMapping["Marketplace"][chainString];

  useEffect(() => {
    if (tokenId) {
      fetch(`http://localhost:4000/get-asset?tokenId=${tokenId}`)
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
            real_item_history: data.activeItem.real_item_history
          }
          setAsset(asset);
          fetch(`http://localhost:4000/get-single-collection?id=${asset.subcollectionId}`)
            .then(response => response.json())
            .then(data => {
              setCollection(data.subcollection);
            })
        })
    }
  }, [tokenId, isWeb3Enabled])

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    params: {
      nftAddress: asset.nftAddress,
      tokenId: asset.tokenId,
      charityAddress: asset.charityAddress,
      tokenUri: asset.tokenUri
    },
    msgValue: asset.price
  })

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
    if (isWeb3Enabled && asset) {
      updateUI();
    }
  }, [isWeb3Enabled, asset, isModalOpen, asset.attributes]);


  const retrieveQRCodeData = (nftAddress, tokenId, openseaTokenId, buyer) => {
    console.log(openseaTokenId)
    const qrString = `${nftAddress}-${tokenId}-${openseaTokenId}-${buyer}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrString}`;
    window.open(qrUrl, "_blank")
  }


  return (
    <>
      <div className='w-full h-screen py-20 px-40'>
        {isModalOpen
          ? (<Modal visible={isModalOpen} onCloseButtonPressed={hideModal} onOk={hideModal} onCancel={hideModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Thank you for your contribution!!! 🎉 🎉</h1>}>
            <div className='p-5'>
              <div className='mb-12'>
                <div className='text-2xl'>Completed transactions </div>
                <hr className='mb-3' />
                <ul>
                  {
                    asset.history.map(event => {
                      if (event.buyer && event.buyer.toLowerCase() == account) {
                        // https://sepolia.etherscan.io/tx/0x0f10b50aad6b472a42910bfa4a1664989486bf917486a97ebc24f98a3f71bf39
                        return (
                          <li className='mb-8'>- Bought by you at {event.date}. <a target='_blank' className='underline hover:text-slate-700' href={getOpenseaUrl(event.openseaTokenId - 1)}>See in opensea</a>. Verify the <strong>donation transaction</strong> at <a href={`https://sepolia.etherscan.io/tx/${event.transactionHash}`} target='_blank' className='underline hover:text-slate-800 font-bold'>Etherscan</a>. Id #{event.openseaTokenId - 1}
                            <div><button className='underline hover:text-slate-700' target='blank' onClick={() => {
                              retrieveQRCodeData(asset.nftAddress, asset.tokenId, event.openseaTokenId, event.buyer);
                            }}>View the QR code</button> which is located on the real item this NFT is linked.</div>
                            <div>
                              {
                                asset.real_item_history
                                  ? (asset.real_item_history.map(realItemEvent => {
                                    if (realItemEvent.openseaTokenId === event.openseaTokenId) {
                                      if (realItemEvent.key == "stamp") {
                                        return (<div>The real item this NFT represents is stamped at {prettyDate(realItemEvent.date)} at <a href={`https://www.google.com/maps/@${realItemEvent.location.latitude},${realItemEvent.location.longitude},15z`} target='_blank'>this</a> location. Click here to see the immutable photo of the real item.</div>
                                        )
                                      } else if (realItemEvent.key == "shipped") {
                                        return (<div>The real item this NFT represents is shipped at {prettyDate(realItemEvent.date)} at <a href={`https://www.google.com/maps/@${realItemEvent.location.latitude},${realItemEvent.location.longitude},15z`} target='_blank'>this</a> location.</div>)
                                      } else if (realItemEvent.key == "delivered") {
                                        return (<div>The real item this NFT represents is delivered at {prettyDate(realItemEvent.date)} at <a href={`https://www.google.com/maps/@${realItemEvent.location.latitude},${realItemEvent.location.longitude},15z`} target='_blank'>this</a> location.</div>)
                                      }
                                    }
                                  }))
                                  : ("")}
                            </div>
                          </li>)
                      }
                    })}
                </ul>
              </div>

              {hasTxHashKey != ""
                ? (<div>
                  <div className='text-2xl'>Pending</div>
                  <hr className='mb-3' />
                  <ul>
                    <li>Buy transaction pending, please wait. <strong>Don't close this tab.</strong></li>
                    <li>
                      {"You can trace your transaction from "}
                      <a className='underline text-slate-600 hover:text-slate-400 cursor-pointer' target='_blank' href={`https://sepolia.etherscan.io/tx/${hasTxHashKey}`}>{hasTxHashKey}</a>
                    </li>
                    <li><Loading spinnerColor='gray' spinnerType='wave' /></li>
                  </ul>
                </div>)
                : ("")}
            </div>
          </Modal>)
          : ("")}

        <div className='flex flex-1 items-end relative h-full'>
          <div className='border-2 h-full flex flex-col justify-center'>
            <Image loader={() => imageURI} src={imageURI} width="500" height="1" />
          </div>
          <div className='p-5'>
            <div className='absolute top-0 flex flex-1 items-center'>
              <div>
                <div className='mr-5 text-xl text-slate-700'>Supporting {collection.charityName}</div>
                <div className='mr-5 text-slate-800 mt-1'>
                  <span className='text-sm'>{prettyAddress(asset.charityAddress)} </span>
                  <a target='_blank' href={`https://sepolia.etherscan.io/address/${asset.charityAddress}`} className='text-xs underline text-cyan-900'>view on Etherscan</a>
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
                <img className='rounded-full' src={collection.charityImage} alt={collection.charityName} />
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
                <div className='text-slate-500 text-xs'>Artist</div>
                <div className='text-slate-700 text-sm'>{prettyAddress(asset.seller)}</div>
              </div>
            </div>
            <div className='text-slate-500'>{asset.availableEditions} editions available</div>
            <hr />
            <div>
              <div className='text-sm text-slate-500 mt-3'>Current price:</div>
              <div className='flex items-center justify-between w-96'>
                <div>
                  <span className='text-3xl font-semibold'>{ethers.utils.formatEther(asset.price, "ether")} </span>
                  <span className='text-slate-500'>ETH</span>
                </div>
                <div className='w-60'>
                  <Button isFullWidth="true" theme='primary' type='button' text='Buy Item' onClick={() => {
                    buyItem({
                      onSuccess: handleBuyItemSuccess,
                      onError: (err) => handleBuyItemError()
                    });
                  }} style={{
                    border: "black",
                    height: "3rem",
                    borderRadius: "100px",
                    fontSize: "16px"
                  }} />
                </div>
              </div>
            </div>
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
                      <img className='p-2' src={collection.charityImage} alt={collection.charityName} />
                    </div>
                    <div className='ml-4 text-lg'>{collection.charityName}</div>
                  </div>
                  <div className='flex flex-1 flex-col justify-center items-end mr-4'>
                    <div>
                      <span className='font-semibold text-lg'>70% </span>
                      <span className='text-sm text-slate-700'>of the proceeds</span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-1 mb-5 border h-24 justify-between rounded'>
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
                </div>

                <div className='flex flex-1 mb-5 border h-24 justify-between rounded'>
                  <div className='flex flex-1 items-center'>
                    <div className='h-full aspect-square flex items-center justify-center bg-slate-50 border-r border-blue-900'>
                      <Blockie seed={marketplaceAddress} size={12} />
                    </div>
                    <div className='ml-4 text-lg'>Contract</div>
                  </div>
                  <div className='flex flex-1 flex-col justify-center items-end mr-4'>
                    <div>
                      <span className='font-semibold text-lg'>10% </span>
                      <span className='text-sm text-slate-700'>of the proceeds</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className='mt-16'>
              <div className='text-3xl text-slate-900 mb-1'>Attributes</div>
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
                          <div className='w-3 h-3 mr-5 rounded-full bg-slate-700 z-50'></div>
                          <div>
                            <div className='text-slate-700'>Item is bought for {ethers.utils.formatEther(event.price, "ether")} ETH by {prettyAddress(event.buyer)}.</div>
                            <div className='text-slate-500'>{event.date}</div>
                          </div>
                        </div>
                        : event.key == "list"
                          ? (< div className='flex-1 flex items-center'>
                            <div className='w-3 h-3 mr-5 rounded-full bg-slate-700 z-50'></div>
                            <div>
                              <div className='text-slate-700'>Item is listed for {ethers.utils.formatEther(event.price, "ether")}.</div>
                              <div className='text-slate-500'>{event.date}</div>
                            </div>
                          </div>)
                          : (< div className='flex-1 flex items-center'>
                            <div className='w-3 h-3 mr-5 rounded-full bg-slate-700 z-50'></div>
                            <div>
                              <div className='text-slate-700'>Item is updated for {ethers.utils.formatEther(event.price, "ether")}.</div>
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
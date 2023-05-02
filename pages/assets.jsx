import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ethers } from "ethers";
import { Button, Modal, Blockie, useNotification } from 'web3uikit'
import marketplaceAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json"

export default function Home() {

  function prettyAddress(address) {
    return address.slice(0, 6) + "..." + address.slice(address.length - 6, address.length)
  }

  const { isWeb3Enabled, chainId, account, Moralis } = useMoralis();

  const [asset, setAsset] = useState({
    seller: "0x0000000",
    nftAddress: "0x0000000",
    tokenId: "0",
    charityAddress: "0x0000000",
    tokenUri: "ipfs://",
    price: "1000000000000000000",
    availableEditions: 0,
    history: [{
      key: "",
      date: "",
      price: "1000000000000000000",
      buyer: "",
      openseaTokenId: 0
    }]
  });
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [collection, setCollection] = useState({
    charityName: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const openseaUrl = `https://testnets.opensea.io/assets/goerli/${asset.nftAddress}/${openseaTokenId}`;
    return openseaUrl;
  }

  const handleBuyItemSuccess = async () => {
    dispatch({
      type: "success",
      message: "Tx successful: item bought",
      title: "Transaction Success",
      position: "topR"
    });
    showModal();
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
            history: data.activeItem.history
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
    msgValue: asset.price,
    onTransactionHash: (txHash) => {
      const txHashArray = localStorage.getItem("txHash");
      if (!txHashArray || txHashArray == undefined) {
        localStorage.setItem("txHash", []);
      }
      txHashArray.push(txHash);
      localStorage.setItem("txHash", txHashArray);
    }
  })

  async function updateUI() {
    // get the token Uri
    // using the image tag from tokenURI, get the image

    const tokenUri = asset.tokenUri;
    if (tokenUri && asset) {
      // IPFS Gateway: return ipfs files from a normal url
      const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenUriResponse = await (await fetch(requestUrl)).json();
      const imageURI = tokenUriResponse.image
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenUriResponse.name);
      setTokenDescription(tokenUriResponse.description)
    }
  }

  useEffect(() => {
    if (isWeb3Enabled && asset) {
      updateUI();
    }
  }, [isWeb3Enabled, asset, isModalOpen])

  const [hasTxHashKey, setHasTxHashKey] = useState(false);

  useEffect(() => {
    const key = 'txHash';
    const isKeyAvailable = typeof window !== 'undefined' && localStorage.getItem(key);
    setHasTxHashKey(isKeyAvailable);
  }, []);

  return (
    <>
      <div className='w-full h-screen py-20 px-40'>
        {isModalOpen
          ? (<Modal visible={isModalOpen} onCloseButtonPressed={hideModal} onOk={hideModal} onCancel={hideModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Thank you for your contribution!!! 🎉 🎉</h1>}>
            <div className='p-5'>
              <div className='mb-12'>
                <div className='text-2xl'>Completed transactions</div>
                <hr className='mb-3' />
                <ul>
                  {
                    asset.history.map(event => {
                      if (event.buyer.toLowerCase() == account) {
                        return (<li>Bought by you at {event.date}. <a className='underline hover:text-slate-700' href={getOpenseaUrl(event.openseaTokenId)}>See in opensea</a>. Verify the <strong>donation transaction</strong> at <a className='underline hover:text-slate-800 font-bold' href="">Etherscan</a>. </li>)
                      }
                    })}
                </ul>
              </div>

              {hasTxHashKey
                ? (<div>
                  <div className='text-2xl'>Pending</div>
                  <hr className='mb-3' />
                  <ul>
                    {
                      localStorage.getItem("txHash").map(event => {
                        if (event.buyer.toLowerCase() == account) {
                          return (<li>Buy transaction pending. See on <a className='underline hover:text-slate-700' href={getOpenseaUrl(event.openseaTokenId)}>Etherscan</a>. Verify the <strong>donation transaction</strong> at <a className='underline hover:text-slate-800 font-bold' href="">Etherscan</a>. </li>)
                        }
                      })}
                  </ul>
                </div>)
                : ("")}
            </div>
          </Modal>)
          : ("")}

        <div className='flex flex-1 items-end relative'>
          <div className='border-2'>
            <Image loader={() => imageURI} src={imageURI} width="500" height="100" />
          </div>
          <div className='p-5'>
            <div className='absolute top-0 flex flex-1 items-center'>
              <div>
                <div className='mr-5 text-xl text-slate-700'>Supporting {collection.charityName}</div>
                <div className='mr-5 text-slate-800 mt-1'>
                  <span className='text-sm'>{prettyAddress(asset.charityAddress)} </span>
                  <a href="" className='text-xs underline text-cyan-900'>view on Etherscan</a>
                </div>
                <div className='mt-5'>
                  <Button
                    theme='secondary'
                    text='View My Donation Information'
                    onClick={() => showModal()}
                  />
                </div>
              </div>
              <div className='h-16 aspect-square ml-5 bg-slate-800 border-2 rounded-full'>
                <img className='rounded-full' src={collection.charityImage} alt={collection.charityName} />
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
                      onSuccess: () => handleBuyItemSuccess(),
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
                <div className='flex flex-1 mb-5'>
                  <div className='text-sm flex flex-1 flex-col justify-center px-10 w-1/2 mr-3 text-slate-800 bg-blue-50 h-12 rounded-3xl'>
                    <div>{collection.charityName}</div>
                    <a href='' className='text-xs underline text-slate-600'>{prettyAddress(asset.charityAddress)}</a>
                  </div>
                  <div className='w-1/2 bg-blue-50 h-12 rounded-3xl px-10 py-2'>
                    <div>
                      <span className='text-slate-800 text-xl font-medium'>{ethers.utils.formatEther((parseInt(asset.price) * 0.7).toString(), "ether")} </span>
                      <span className='text-slate-700 text-xs'>ETH </span>
                      <span className='text-slate-600 text-sm mr-4'>(100$) </span>
                      <span className='text-slate-700'>70%</span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-1 mb-5'>
                  <div className='text-sm flex flex-1 flex-col justify-center px-10 w-1/2 mr-3 text-slate-800 bg-blue-50 h-12 rounded-3xl'>
                    <div>Creator</div>
                    <a href='' className='text-xs underline text-slate-600'>{prettyAddress(asset.seller)}</a>
                  </div>
                  <div className='w-1/2 bg-blue-50 h-12 rounded-3xl px-10 py-2'>
                    <div>
                      <span className='text-slate-800 text-xl font-medium'>{ethers.utils.formatEther((parseInt(asset.price) * 0.2).toString(), "ether")} </span>
                      <span className='text-slate-700 text-xs'>ETH </span>
                      <span className='text-slate-600 text-sm mr-4'>(100$) </span>
                      <span className='text-slate-700'>20%</span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-1'>
                  <div className='text-sm flex flex-1 flex-col justify-center px-10 w-1/2 mr-3 text-slate-800 bg-blue-50 h-12 rounded-3xl'>
                    <div>Transaction Fee</div>
                    <a href='' className='text-xs underline text-slate-600'>{prettyAddress(marketplaceAddress)}</a>
                  </div>
                  <div className='w-1/2 bg-blue-50 h-12 rounded-3xl px-10 py-2'>
                    <div>
                      <span className='text-slate-800 text-xl font-medium'>{ethers.utils.formatEther((parseInt(asset.price) * 0.1).toString(), "ether")} </span>
                      <span className='text-slate-700 text-xs'>ETH </span>
                      <span className='text-slate-600 text-sm mr-4'>(100$) </span>
                      <span className='text-slate-700'>10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='ml-auto'>
            <div className='text-2xl mb-2'>History</div>
            <hr className='mb-2' />
            <div>
              {
                asset.history.map((event) => {
                  return (
                    <div>{
                      event.key == "buy"
                        ? <div className='flex-1 flex items-center'>
                          <div className='w-3 h-3 mr-5 rounded-full bg-slate-700'></div>
                          <div>
                            <div className='text-slate-700'>Item is bought for {ethers.utils.formatEther(event.price, "ether")} ETH by {prettyAddress(event.buyer)}.</div>
                            <div className='text-slate-500'>{event.date}</div>
                          </div>
                        </div>
                        : <div>Item is listed</div>
                    }</div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
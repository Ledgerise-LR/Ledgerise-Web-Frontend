
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Image from "next/image";
import { Blockie } from "web3uikit";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';
import RealTimeCounter from "@/components/RealTimeCounter";

export default function AuctionBox({ nftAddress, tokenId, marketplaceAddress, currentBidder, currentBidding, seller, tokenUri, history, startTime, interval }) {

  const [ethToUsdRate, setEthToUsdRate] = useState(null);

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      const rate = await getEthToUsdRate();
      setEthToUsdRate(rate);
    };

    fetchEthToUsdRate();
  }, []);

  function prettyAddress(address) {
    return address.slice(0, 6) + "..." + address.slice(address.length - 6, address.length)
  }

  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const router = useRouter();

  async function updateUI() {
    // get the token Uri
    // using the image tag from tokenURI, get the image;
    if (tokenUri) {
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
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled])

  return (
    <div>
      <div>
        {imageURI ? (
          <div>
            <div className="flex flex-col border-2">
              <div className="italic text-sm">
                <div className="w-full aspect-square flex flex-1 justify-center border-b-2 relative overflow-hidden">
                  <img className="absolute" src={imageURI} />
                </div>
              </div>
              <div className="p-4">
                <div className="text-slate-800 text-2xl uppercase font-semibold mt-2">{tokenName}</div>
                <div className="text-slate-500 mt-1 text-sm">

                  {currentBidder == "0x0000000000000000000000000000000000000000"
                    ? (<div>
                      <div>Current bid</div>
                      <div>-</div>
                      <div>Starting from <strong className="text-slate-800 text-lg font-medium">{ethers.utils.formatEther(currentBidding, "ether")} Ξ</strong> (${Number(ethToUsdRate * Number(ethers.utils.formatEther(currentBidding, "ether"))).toFixed(1)})</div>
                    </div>)
                    : (<div>
                      <div>Current high bid by {prettyAddress(currentBidder)}</div>
                      <div>{currentBidding}</div>
                    </div>)
                  }
                </div>
                <div className=" text-slate-600 mt-2 pt-2 text-sm flex flex-1 justify-between w-1/2">
                  <div className="bg-black p-2 rounded-full flex flex-1 ">
                    <div className="h-full aspect-square rounded-full bg-white animate-pulse"></div>
                    <RealTimeCounter
                      interval={interval - (Math.abs(Date.now() - startTime) / 1000)}
                    />
                  </div>
                </div>
                <div className="text-slate-600 mt-4 border-t-2 pt-2 text-sm">{tokenDescription}</div>
              </div>
            </div>
          </div>
        ) : (<div>Loading...</div>)}
      </div>
    </div>
  )
}

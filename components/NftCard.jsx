
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Image from "next/image";
import { Blockie } from "web3uikit";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller, tokenUri, history, availableEditions }) {

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

  function isAssetUpdated(historyArray) {
    for (let i = 0; i < historyArray.length; i++) {
      const event = historyArray[i];
      if (event.key.toString() === "update") return true;
    }
    return false;
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
                <div className="w-full h-60 flex flex-1 justify-center border-b-2">
                  <img src={imageURI} />
                </div>
              </div>
              <div className="p-4">
                <div className="text-slate-800 text-3xl uppercase font-medium mt-2">{tokenName}</div>
                <div className="text-slate-500 mt-1 text-xs">
                  {isAssetUpdated(history) == true
                    ? ("Updated price")
                    : ("List price")
                  }
                </div>
                <div className="text-slate-700 text-2xl mt-1 font-medium">{price / 1e18} Ξ <span className="text-sm text-slate-500">(${Number(ethToUsdRate * Number(ethers.utils.formatEther(price, "ether"))).toFixed(1)})</span></div>
                <div className="text-slate-500 mt-2 mb-2 text-sm">
                  <span className="text-slate-600 font-medium">{availableEditions} </span>
                  editions available
                </div>
                <div className="flex flex-1 items-center mt-4 mb-3">
                  <div>
                    <Blockie seed={seller} size={7} />
                  </div>
                  <div className="ml-3 text-xs text-slate-500">
                    <div>Artist</div>
                    <div className="text-slate-600">{prettyAddress(seller)}</div>
                  </div>
                </div>
                <div className="text-slate-600 mt-5 border-t-2 pt-2 text-sm">{tokenDescription}</div>
              </div>
            </div>
          </div>
        ) : (<div>Loading...</div>)}
      </div>
    </div>
  )
}

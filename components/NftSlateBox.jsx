
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { PopoverDropdown, PopoverElement } from "web3uikit";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';

export default function NFTSlateBox({ price, tokenUri, availableEditions, editTokenDescription, editTokenImage, editTokenPrice, editTokenName }) {

  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

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
    updateUI();
  }, [])


  return (
    <div>
      <div>
        {imageURI ? (
          <div>
            <div className="flex flex-col border-2">
              <div className="italic text-sm">
                <div className="w-full h-42 aspect-square flex flex-1 justify-center items-center border-b-2 relative overflow-hidden">
                  <img className="absolute" src={editTokenImage ? editTokenImage : imageURI} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex w-full justify-between">
                  <div className="text-slate-800 text-lg uppercase font-medium">{editTokenName ? editTokenName : tokenName}</div>
                </div>
                <div className="text-slate-700 font-medium">{editTokenPrice ? editTokenPrice : price} TL</div>
                <div className="text-slate-500 text-sm">
                  <span className="text-slate-600 font-medium">{availableEditions} </span>
                  mevcut stok
                </div>
                <div className="text-slate-600 border-t-2 pt-2 text-sm">{editTokenDescription ? editTokenDescription.slice(0, 50) : tokenDescription.slice(0, 50)}...</div>
              </div>
            </div>
          </div>
        ) : (<div>Yükleniyor...</div>)}
      </div>
    </div>
  )
}

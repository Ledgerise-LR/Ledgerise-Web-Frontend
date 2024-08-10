
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Blockie } from "web3uikit";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller, tokenUri, history, availableEditions }) {

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
    updateUI();

  }, [])


  const getDonationType = (tokenName) => {

    if (tokenName.includes("(") && tokenName.includes(")") && tokenName.includes("/")) {
      tokenName = tokenName.split(")")[0].replace("(", "");
      if (tokenName.split("/")[0] == "1" && parseInt(tokenName.split("/")[1]) <= 2) {
        return {
          name: "gold",
          className: "bg-yellow-500 text-yellow-200 font-bold font-playfair"
        }
      } else if (tokenName.split("/")[0] == "1" && parseInt(tokenName.split("/")[1]) <= 5) {
        return {
          name: "venti",
          className: "bg-stone-300 text-stone-50 font-bold font-playfair"
        }
      } else if (tokenName.split("/")[0] == "1" && parseInt(tokenName.split("/")[1]) <= 10) {
        return {
          name: "amare",
          className: "bg-amber-800 text-amber-600 font-bold font-playfair"
        }
      }
    } else {
      return {
        name: "diamante",
        className: "bg-sky-300 text-sky-50 font-bold font-playfair"
      }
    }
  }

  return (
    <div>
      <div>
        {imageURI ? (
          <div>
            <div className="flex flex-col border-2">
              <div className="italic text-sm">
                <div className="w-full aspect-square flex flex-col flex-1 justify-center border-b-2 relative overflow-hidden">
                  <img className="absolute" src={imageURI} />
                  <div className={`absolute bottom-0 w-full text-center not-italic uppercase ${(tokenName && tokenName.length > 0) ? getDonationType(tokenName).className : ("")}`}>
                    {(tokenName && tokenName.length > 0) ? getDonationType(tokenName).name : ("")}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="text-slate-800 text-3xl uppercase font-medium mt-2">{tokenName}</div>
                <div className="text-slate-500 mt-1 text-xs">
                  {isAssetUpdated(history) == true
                    ? ("Güncellenmiş fiyat")
                    : ("Listeleme fiyatı")
                  }
                </div>
                <div className="text-slate-700 text-2xl mt-1 font-medium">{Number(price)} TL</div>
                <div className="text-slate-500 mt-2 mb-2 text-sm">
                  <span className="text-slate-600 font-medium">{availableEditions} </span>
                  mevcut stok
                </div>
                <div className="flex flex-1 items-center mt-4 mb-3">
                  <div>
                    <Blockie seed={seller} size={7} />
                  </div>
                  <div className="ml-3 text-xs text-slate-500">
                    <div>Admin</div>
                    <div className="text-slate-600">{prettyAddress(seller)}</div>
                  </div>
                </div>
                <div className="text-slate-600 mt-5 border-t-2 pt-2 text-sm">{tokenDescription}</div>
              </div>
            </div>
          </div>
        ) : (<div>Yükleniyor...</div>)}
      </div>
    </div>
  )
}

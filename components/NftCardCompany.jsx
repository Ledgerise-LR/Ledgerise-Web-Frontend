
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { PopoverDropdown, PopoverElement } from "web3uikit";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';

export default function NFTBoxCompany({ price, tokenUri, availableEditions, handleViewLabelsClick, handleCancelItem, handleUpdateItem }) {

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
                <div className="w-full aspect-square flex flex-1 justify-center border-b-2 relative overflow-hidden">
                  <img className="absolute" src={imageURI} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex w-full justify-between">
                  <div className="text-slate-800 text-lg uppercase font-medium">{tokenName}</div>
                  <div className="w-8 h-8 text-xs bg-blue-500 cursor-pointer text-slate-50 flex justify-center items-center rounded-full">
                    <PopoverDropdown
                      onClick={function noRefCheck(){}}
                      parent={"•••"}
                      position="top"
                      backgroundColor="#505050"
                    >
                      <PopoverElement
                        backgroundColor="transparent"
                        height={30}
                        onClick={() => { handleCancelItem() }}
                        text="Ürünü iptal et"
                        textColor="#f4f4f4"
                        textSize={16}
                        width={250}
                      />
                      <PopoverElement
                        backgroundColor="transparent"
                        height={30}
                        onClick={() => { handleUpdateItem() }}
                        text="Ürün fiyatını güncelle"
                        textColor="#f4f4f4"
                        textSize={16}
                        width={250}
                      />
                    </PopoverDropdown>
                  </div>
                </div>
                <div className="text-slate-700 font-medium">{Number(price)} TL</div>
                <div className="text-slate-500 text-sm">
                  <span className="text-slate-600 font-medium">{availableEditions} </span>
                  mevcut stok
                </div>

                <div 
                  className="w-3/4 flex justify-center items-center my-2 py-2 text-sm bg-slate-100 cursor-pointer hover:bg-slate-200 transition-all"
                  onClick={() => {
                    handleViewLabelsClick();
                  }}
                >
                  Etiketleri görüntüle
                </div>

                <div className="text-slate-600 border-t-2 pt-2 text-sm">{tokenDescription.slice(0, 50)}...</div>
              </div>
            </div>
          </div>
        ) : (<div>Yükleniyor...</div>)}
      </div>
    </div>
  )
}

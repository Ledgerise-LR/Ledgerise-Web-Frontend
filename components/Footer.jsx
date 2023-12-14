
import { useEffect, useState } from "react";
import blockExplorerMapping from "../constants/blockExplorerMapping";
import networkMapping from "../constants/networkMapping";

export default function Footer() {

  const [blockExplorer, setBlockExplorer] = useState("");
  const [marketplaceAddress, setMarketplaceAdress] = useState("");
  const [mainCollectionAddress, setMainCollectionAddress] = useState("");
  const [ledgeriseLensAddress, setLedgeriseLensAddress] = useState("");

  const chainId = "80001";

  useEffect(() => {
    setBlockExplorer(blockExplorerMapping["blockExplorer"][chainId]);
    setMarketplaceAdress(networkMapping["Marketplace"][chainId]);
    setMainCollectionAddress(networkMapping["MainCollection"][chainId]);
    setLedgeriseLensAddress(networkMapping["LedgeriseLens"][chainId]);
  }, []);

  return (
    <div>
      <div>
        <div className="flex flex-col justify-between items-center bg-slate-800 w-full">
          <div className="w-full h-4/5 flex p-24">
            <div className="mr-auto flex w-1/2">
              <div>
                <div className="mb-8">
                  <img src="/icon.svg" alt="Ledgerise logo" />
                </div>
                <div className="w-full font-serif text-yellow-500 text-2xl mb-8 flex">
                  <div className="mr-1">{"See the"}</div>
                  <div className="animate-bounce mr-1 font-bold text-yellow-400">{"change"}</div>
                  <div className="mr-1">{"after you donate"}</div>
                </div>
                <div className="p-4 px-16 w-fit ml-auto bg-slate-900 text-green-500 rounded-full transition-all cursor-pointer border border-green-500 hover:text-slate-50 hover:bg-green-500">Donate now</div>
              </div>
            </div>
            <div className="w-1/2 flex flex-row-reverse">
              <div className="w-1/3 h-full ml-12">
                <div className="text-slate-100 mb-2">Resources</div>
                <div className="text-slate-400">
                  <div className="mb-2">Home</div>
                  <div className="mb-2">Collections</div>
                  <div className="mb-2">Auctions</div>
                  <div className="mb-2">Login</div>
                  <div className="mb-2">Register</div>
                </div>
              </div>
              <div className="w-1/3 h-full ml-12">
                <div className="text-slate-100 mb-2">Company</div>
                <div className="text-slate-400">
                  <div className="mb-2">Terms & Conditions</div>
                  <div className="mb-2">Privacy Policy</div>
                </div>
              </div>
              <div className="w-1/3 h-full ml-12">
                <div className="text-slate-100 mb-2">Transparency</div>
                <div className="text-slate-400">
                  <div className="mb-2">
                    <a href={`https://${blockExplorer}/address/${marketplaceAddress}`}>Ledgerise Donation Marketplace</a>
                  </div>
                  <div className="mb-2">
                    <a href={`https://${blockExplorer}/address/${mainCollectionAddress}`}>Ledgerise Main Collection</a>
                  </div>
                  <div className="mb-2">
                    <a href={`https://${blockExplorer}/address/${ledgeriseLensAddress}`}>Ledgerise Lens</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-slate-500 border w-full"></div>
          <div className="w-full py-8 bg-slate-900 flex px-16 justify-between items-center text-slate-200">
            <div>Ledgerise® - 2024</div>
            <div>Powered by Üsküdar American Academy</div>
          </div>
        </div>
      </div>
    </div>
  )
}

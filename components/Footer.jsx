
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
          <div className="w-full h-4/5 flex py-24 px-12 flex-wrap justify-center">
            <div className="mr-auto flex w-fit mb-12">
              <div>
                <div className="mb-8">
                  <img src="/icon.svg" alt="Ledgerise logo" />
                </div>
                <div className="w-full font-serif text-yellow-500 text-2xl mb-1 flex">
                  <div className="mr-1">{"Bağış hiç olmadığı kadar"}  <span className="font-bold text-yellow-400">{"şeffaf"}</span></div>
                </div>
                <div className="w-full font-serif text-yellow-700 text-lg mb-8 flex">
                  Ledgerise ailesine katılın, bağışınızla kalplere uzanın ❤️
                </div>
                <a href="collections" className="p-4 px-8 w-fit ml-auto bg-slate-900 text-green-500 rounded-full transition-all cursor-pointer border border-green-500 hover:text-slate-50 hover:bg-green-500">Kampanyalar</a>
              </div>
            </div>
            <div className="w-100 flex">
              <div className="w-1/3 h-full ml-12">
                <div className="text-slate-100 mb-2">Kaynaklar</div>
                <div className="text-slate-400">
                  <div className="mb-2">
                    <a href="/">Anasayfa</a>
                  </div>
                  <div className="mb-2">
                    <a href="/collections">Kampanyalar</a>
                  </div>
                  <div className="mb-2">
                    <a href="/login">Giriş yap</a>
                  </div>
                  <div className="mb-2">
                    <a href="/register">Kayıt ol</a>
                  </div>
                </div>
              </div>
              <div className="w-1/3 h-full ml-12">
                <div className="text-slate-100 mb-2">İlgili</div>
                <div className="text-slate-400">
                  <div className="mb-2">Şartlar & Koşullar</div>
                  <div className="mb-2">Gizlilik Politikası</div>
                </div>
              </div>
              <div className="w-1/3 h-full ml-12">
                <div className="text-slate-100 mb-2">Şeffaflık</div>
                <div className="text-slate-400">
                  <div className="mb-2">
                    <a href={`https://${blockExplorer}/address/${marketplaceAddress}`}>Bağış Platformu</a>
                  </div>
                  <div className="mb-2">
                    <a href={`https://${blockExplorer}/address/${mainCollectionAddress}`}>Ana kampanya</a>
                  </div>
                  <div className="mb-2">
                    <a href={`https://${blockExplorer}/address/${ledgeriseLensAddress}`}>Lens</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-slate-500 border w-full"></div>
          <div className="w-full py-8 bg-slate-900 flex px-16 justify-between items-center text-slate-200">
            <div>Ledgerise® - 2024</div>
            <div>Powered by LR</div>
          </div>
        </div>
      </div>
    </div>
  )
}

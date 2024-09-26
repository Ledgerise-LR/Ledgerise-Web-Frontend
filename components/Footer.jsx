
import { useEffect, useState } from "react";
import blockExplorerMapping from "../constants/blockExplorerMapping";
import networkMapping from "../constants/networkMapping";
import {Mail, Pin} from '@web3uikit/icons'

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
        <div className="flex flex-col justify-between items-center bg-[linear-gradient(20deg,rgba(20,0,63,1)_0%,rgba(40,24,0,1)_75%)] w-full z-10">
          <div className="w-full h-4/5 flex py-24 px-12 flex-wrap justify-center">
            <div className="mr-auto flex w-fit mb-12">
              <div>
                <div className="mb-8">
                  <img src="/whitelogo.svg" alt="Ledgerise logo" />
                </div>
                <div className="w-fit text-white text-2xl mb-1 font-light flex">
                  <div className="mr-1">{"Sürdürülebilir gelecek için stok fazlalarını değere dönüştürüyoruz"}</div>
                </div>
                <div className="text-gray-300 text-sm mb-8 flex w-96">
                  STK'ların bağışçılarına, firmaların kaliteli stoklarını, ihtiyaç sahibine elleriyle teslim eder gibi ulaştırmalarını sağlıyoruz.
                </div>
                <div className="contact-wrapper text-gray-400 font-light">
                  İletişim
                  <div className="flex items-center text-gray-500 gap-4">
                    <Mail fontSize='16px'/>
                    <div>admin@ledgerise.org</div>
                  </div>
                  <div className="flex items-center text-gray-500 gap-4">
                    <Pin fontSize='16px'/>
                    <div>Sarıyer, İstanbul/Türkiye</div>
                  </div>
                </div>
                {/* <a href="collections" className="p-4 px-8 w-fit ml-auto rounded transition-all cursor-pointer border bg-orange-100 bg-opacity-10 shadow shadow-white text-white border-white">Kampanyalar</a> */}
              </div>
            </div>
            <div className="w-100 flex flex-col h-full">
              <div className="w-full flex">
                <div className="w-1/3 h-full ml-12">
                  <div className="text-gray-200 font-light mb-2">Kaynaklar</div>
                  <div className="text-gray-400 font-light">
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
                  <div className="text-gray-200 font-light mb-2">İlgili</div>
                  <div className="text-gray-400 font-light">
                    <div className="mb-2">Şartlar & Koşullar</div>
                    <div className="mb-2">Gizlilik Politikası</div>
                  </div>
                </div>
                <div className="w-1/3 h-full ml-12">
                  <div className="text-gray-200 font-light mb-2">Şeffaflık</div>
                  <div className="text-gray-400 font-light">
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
              <div className="flex flex-col justify-end items-end mt-28">
                <div className="flex items-center">
                  <div className="h-16 w-fit">
                    <img className="w-full h-full" src="itucekirdek.png" alt="" />
                  </div>
                  <div className="text-gray-300 text-sm ml-2">Ön Kuluçka Girişimidir</div>
                </div>
                <div className="text-gray-600 font-light text-sm">© Ledgerise Teknoloji 2023. Tüm Hakları Saklıdır</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
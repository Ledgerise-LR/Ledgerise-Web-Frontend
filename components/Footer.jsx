import { useEffect, useState } from "react";
import blockExplorerMapping from "../constants/blockExplorerMapping";
import networkMapping from "../constants/networkMapping";
import { FaEnvelope, FaMapPin, FaInstagram, FaLinkedin } from "react-icons/fa";

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
    <div className="flex flex-col items-center md:flex-row flex-wrap justify-between max-md:gap-8 p-6 lg:p-10 bg-[linear-gradient(20deg,rgba(20,0,63,1)_0%,rgba(40,24,0,1)_75%)]">
      <div className="flex flex-col max-md:items-center justify-start w-4/5 md:w-2/5 lg:w-1/3">
        <img className="h-20 md:w-fit mb-8" src="/whitelogo.svg" alt="Ledgerise logo" />
        <div>
          <div className="text-white text-xl lg:text-2xl mb-1">
            Sürdürülebilir gelecek için stok fazlalarını değere dönüştürüyoruz
          </div>
          <div className="text-[#aaa] text-sm mb-8">
            STK'ların bağışçılarına, firmaların kaliteli stoklarını, ihtiyaç sahibine elleriyle teslim eder gibi ulaştırmalarını sağlıyoruz.
          </div>
          <div className="text-sm text-gray-200 font-light">
            İletişim
            <div className="flex items-center text-gray-500 gap-4">
              <FaEnvelope fontSize='16px' />
              <a href="mailto:info@ledgerise.org" target="_blank">info@ledgerise.org</a>
            </div>
            <div className="flex items-center text-gray-500 gap-4">
              <FaMapPin fontSize='16px' />
              <div>Sancaktepe, İstanbul/Türkiye</div>
            </div>
            <div className="flex items-center text-gray-500 gap-4">
              <FaInstagram fontSize='16px' />
              <a href="https://www.instagram.com/ledgerise" target="_blank">ledgerise</a>
            </div>
            <div className="flex items-center text-gray-500 gap-4">
              <FaLinkedin fontSize='16px' />
              <a href="https://www.linkedin.com/company/ledgerise-lr" target="_blank">Ledgerise (LR)</a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-around md:w-1/2 lg:w-1/3 xs:whitespace-nowrap">
        <div className="flex justify-center gap-5 lg:gap-10 xl:gap-16 max-xs:text-sm">
          <div>
            <div className="text-gray-200 font-semibold mb-2">Kaynaklar</div>
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
          <div>
            <div className="text-gray-200 font-semibold mb-2">İlgili</div>
            <div className="text-gray-400 font-light">
              <div className="mb-2">Şartlar & Koşullar</div>
              <div className="mb-2">Gizlilik Politikası</div>
            </div>
          </div>
          <div>
            <div className="text-gray-200 font-semibold mb-2">Şeffaflık</div>
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
        <div className="flex flex-col items-center">
          <div className="flex flex-col xl:flex-row items-center">
            <img className="h-1/2 lg:h-3/4" src="itucekirdek.png" alt="itu-cekirdek-logo" />
            <div className="text-gray-300 text-sm ml-2">
              Ön Kuluçka Girişimidir
            </div>
          </div>
          <div className="text-gray-600 font-light text-sm">
            © Ledgerise Teknoloji 2023. Tüm Hakları Saklıdır
          </div>
        </div>
      </div>
    </div>
  )
}

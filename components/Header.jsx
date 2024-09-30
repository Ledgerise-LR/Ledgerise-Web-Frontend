import { ConnectButton, Button } from "web3uikit";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { URL, PORT } from '@/serverConfig';
import { FaBars, FaTimes, FaAngleDown } from "react-icons/fa";
import {Sandbox, Shield, EyeClosed} from '@web3uikit/icons';

export default function Header() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("_id");
    window.location.reload();
  };

  const setLastVisitedUrl = () => {
    localStorage.setItem("lastVisitedUrl", window.location.href);
  };

  useEffect(() => {
    // Authentication check
    const authenticateUser = async () => {
      try {
        const { data } = await axios.post(`${URL}:${PORT}/auth/authenticate`, {
          _id: localStorage.getItem("_id") || "null",
        });
        if (data.success && data.donor) {
          setUsername(data.donor.email.split("@")[0]);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUsername("");
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };
    authenticateUser();
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b z-50 max-md:fixed top-0 left-0 w-full bg-white">
      <div className={`flex items-center justify-between mx-auto p-4 ${isMobileMenuOpen ? "border-b-2" : ""}`}>
        <Link href="/">
          <img src="/logo.svg" alt="Ledgerise Logo" className="h-8 md:h-8 lg:h-10" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex ml-12 mr-auto justify-center gap-3 lg:gap-6 items-center">
          <NavigationLinks isDesktop={true} />
        </div>
        <div className="hidden md:flex items-center">
          {isAuthenticated ?
            (<UserSection username={username} handleLogout={handleLogout} />)
            :
            (<AuthButtons setLastVisitedUrl={setLastVisitedUrl} />)}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={handleMobileMenuToggle}>
          {isMobileMenuOpen ? <FaTimes className="text-3xl" /> : <FaBars className="text-3xl" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-6 px-8 z-40 bg-white shadow-md">
          <div className="flex flex-col gap-6">
            <NavigationLinks isDesktop={false} closeMenu={closeMobileMenu} />
            {isAuthenticated ? (
              <UserSection username={username} handleLogout={handleLogout} />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const navigationItems = [
  { desktop: true, mobile: true, href: "/collections", label: "Kampanyalar" },
  { desktop: true, mobile: false, href: "/#", label: "Ürünler" },
  { desktop: true, mobile: false, href: "/api-documentation", label: "Entegrasyon" },
  { desktop: true, mobile: true, href: "/team", label: "Hakkımızda" },
  { desktop: false, mobile: true, href: "/login", label: "Giriş Yap" },
  { desktop: false, mobile: true, href: "/register", label: "Hesap Oluştur" }
];

const dropdownMenu = {
  "Ürünler": [
    {
      title: "Stok Yönetim",
      content: ["LR Dashboard", "LR Entegrasyon", "LR Collaborate"],
      description: ["Tek tıkla e-bağış pazaryeri.", "1 saatten kısa sürede entegrasyon.", "Ortak amaç, ortak bağış."],
      href: ["dashboard", "entegration", "collaborate"]
    },
    {
      title: "Güvenilir Bağış",
      content: ["LR ESCROW", "LR Lens", "LR LensBot"],
      description: ["Paranız, ürün sahibine ulaşana kadar güvendedir.", "Gücünü NFT'den alan AI kamera.", "Kargo anlaşması şart değil."],
      href: ["deliverTrust", "lens", "lensBot"]
    },
    {
      title: "Gizlilik",
      content: ["SafeView"],
      description: ["İhtiyaç sahibi verileri gizlidir."],
      href: ["safeView"]
    }
  ],
  "Hakkımızda": [
    {
      title: "Hakkımızda",
      content: ["Hikayemiz", "Newsroom"],
      description: ["Sürdürülebilir stok yönetimi için çalışıyoruz. Detaylı bilgi ve yönetim kurulunu görüntülemek için tıklayınız.", "Teknoloji gündemine konu olan haberleri görüntülemek için tıklayın."],
      href: ["team", "#newsroom"]
    }
  ],
  "Entegrasyon": [
    {
      title: "Firmalar için",
      content: ["Dashboard", "API Dökümentasyonu"],
      description: ["Tek tıkla e-ticaret altyapısı ile Ledgerise ihtiyaç pazaryerinde ürünlerinizi indirimli fiyatına listeleyebilirsiniz.", "E-ticaret altyapınız hazırsa, API dökümentasyonu üzerinden ürün listeleme işlemlerinizi hali hazırdaki sisteminize entegre edebilirsiniz."],
      href: ["company", "api-documentation"]
    }
  ]
}

const NavigationLinks = ({ isDesktop, closeMenu }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownLabel, setDropDownLabel] = useState("");

  return (
    <>
      {navigationItems.map((item) => {
        if (isDesktop ? item.desktop : item.mobile) {
          return (
            <div
              key={item.href}
              className="relative"
              onMouseLeave={() => {
                setDropDownLabel("")
                setIsDropdownOpen(false)
              }} // Close on mouse leave
            >
              <Link
                href={item.href}
                className="flex items-center max-md:text-xl md:text-sm lg:text-base hover:text-orange-500 transition"
                onMouseEnter={() => {
                  setDropDownLabel(item.label)
                  setIsDropdownOpen(true)
                }}
              >
                {item.label}
                {(item.label === "Ürünler" || item.label === "Hakkımızda" || item.label === "Entegrasyon") ? <FaAngleDown /> : ""}
              </Link>

              {((item.label === "Ürünler" || item.label === "Hakkımızda" || item.label === "Entegrasyon") && (item.label === dropdownLabel) && isDropdownOpen) && (
                <div className="flex w-fit absolute left-0 bg-white border rounded-md shadow-lg z-50">
                  {dropdownMenu[item.label].map((menu, index) => (
                    <div key={menu.title} className="p-4 border-r">
                      <div className="font-semibold text-lg mb-2 flex items-center">
                        <div className="text-purple-500 p-2 bg-purple-500 bg-opacity-10 border-purple-500 border rounded mr-2">
                        {
                            index == 0
                              ? <Sandbox fontSize='16px'/>
                              : index == 1
                                ? <Shield fontSize='16px'/>
                                : index == 2
                                  ? <EyeClosed fontSize='16px'/>
                                  : ("")
                          }
                        </div>
                        <div>
                          {menu.title}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 p-4 w-64">
                        {menu.content.map((content, index) => (
                          <div className="mb-4">
                            <Link key={index} href={`${item.label == "Ürünler" ? `/?section=${menu.href[index]}`: `/${menu.href[index]}`}`} onClick={closeMenu} className="text-md hover:text-orange-500 transition">
                              {content}
                            </Link>
                            <p className="text-sm text-gray-500">{menu.description[index]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};




const UserSection = ({ username, handleLogout }) => (
  <div
    className="flex items-center gap-4 p-2 rounded-lg max-md:bg-gray-200 max-md:border max-md:border-gray-300 bg-transparent"
  >
    <span className="font-medium text-gray-600 max-md:text-gray-800">
      {username}
    </span>
    <button
      onClick={handleLogout}
      className="text-red-500 hover:underline max-md:text-red-600"
    >
      Çıkış Yap
    </button>
  </div>
);


const AuthButtons = ({ setLastVisitedUrl }) => (
  <div className="flex items-center space-x-4">
    <Link href="/login" onClick={setLastVisitedUrl} className="max-lg:text-sm py-2 px-4 text-gray-700 border rounded hover:bg-gray-100">
      Giriş Yap
    </Link>
    <Link href="/login?register" onClick={setLastVisitedUrl} className="max-lg:text-sm py-2 px-4 bg-[rgb(255,168,82)] text-black rounded hover:bg-[rgb(255,145,65)]">
      Hesap Oluştur
    </Link>
  </div>
);

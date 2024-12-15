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
      <div className={`flex items-center px-8 justify-between mx-auto p-4 ${isMobileMenuOpen ? "border-b-2" : ""}`}>
        <Link href="/">
          <img src="/logo.svg" alt="Ledgerise Logo" className="h-8 md:h-8 lg:h-10" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex ml-12 justify-center gap-3 lg:gap-6 items-center">
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
  { desktop: true, mobile: true, href: "/collections", label: "Campaigns" },
  { desktop: true, mobile: false, href: "/#", label: "Solutions" },
  { desktop: true, mobile: false, href: "/api-documentation", label: "Integration" },
  { desktop: true, mobile: true, href: "/team", label: "About Us" },
  { desktop: false, mobile: true, href: "/login", label: "Log In" },
  { desktop: false, mobile: true, href: "/register", label: "Create Account" }
];

const dropdownMenu = {
  "Solutions": [
    {
      title: "Stock Management",
      content: ["LR Dashboard", "LR Entegration", "LR Collaborate"],
      description: ["One-click e-donation marketplace.", "Integration in less than 1 hour.", "Common goal, common donation."],
      href: ["dashboard", "entegration", "collaborate"]
    },
    {
      title: "Reliable Donation",
      content: ["LR ESCROW", "LR Lens", "LR LensBot"],
      description: ["Your money is safe until the product reaches its owner.", "AI camera powered by NFT.", "Shipping agreement not required."],
      href: ["deliverTrust", "lens", "lensBot"]
    },
    {
      title: "Privacy",
      content: ["SafeView"],
      description: ["The data of beneficiaries remain confidential."],
      href: ["safeView"]
    }
  ],
  "About Us": [
    {
      title: "About Us",
      content: ["Our Story", "Newsroom"],
      description: ["We work for sustainable stock management. Click here for detailed information and to view the board of directors.", "Click here to view the news on the technology agenda."],
      href: ["team", "#newsroom"]
    }
  ],
  "Integration": [
    {
      title: "For companies",
      content: ["Dashboard", "API Documentation"],
      description: ["With one click, you can list your products at a discounted price on the Ledgerise marketplace with e-commerce infrastructure.", "If your e-commerce infrastructure is ready, you can integrate your product listing processes into your existing system via API documentation."],
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
                {(item.label === "Solutions" || item.label === "About Us" || item.label === "Integration") ? <FaAngleDown /> : ""}
              </Link>

              {((item.label === "Solutions" || item.label === "About Us" || item.label === "Integration") && (item.label === dropdownLabel) && isDropdownOpen) && (
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
                            <Link key={index} href={`${item.label == "Solutions" ? `/?section=${menu.href[index]}`: `/${menu.href[index]}`}`} onClick={closeMenu} className="text-md hover:text-orange-500 transition">
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
      Log Out
    </button>
  </div>
);


const AuthButtons = ({ setLastVisitedUrl }) => (
  <div className="flex items-center space-x-4">
    <Link href="/login" onClick={setLastVisitedUrl} className="font-semibold text-sm py-2 px-4 text-gray-700 border rounded hover:bg-gray-100">
      Log In
    </Link>
    <Link href="/login?register" onClick={setLastVisitedUrl} className="font-semibold text-sm py-2 px-4 bg-[rgb(255,168,82)] text-black rounded hover:bg-[rgb(255,145,65)]">
      Create Account
    </Link>
  </div>
);

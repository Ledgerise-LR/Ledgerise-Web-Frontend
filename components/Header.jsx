
import { ConnectButton, Button } from "web3uikit";
import Link from "next/link";
import { AES, enc } from "crypto-js";
import { useDeferredValue, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { URL, PORT } from '@/serverConfig';

export default function Header() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: "",
    height: ""
  });

  const setLastVisitedUrl = () => {
    localStorage.setItem("lastVisitedUrl", window.location.href);
  }

  useEffect(() => {

    const handleResize = () => {
      const hamburgerMenu = document.getElementById("hamburger-menu");
      hamburgerMenu.style.left = `-${window.innerWidth}px`;
      hamburgerMenu.style.display = "block";
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log(localStorage.getItem("_id"))
    axios.post(`${URL}:${PORT}/auth/authenticate`, {
      _id: localStorage.getItem("_id") || "null"
    })
      .then(data => {
        if (!data.data.success && data.data.err == "authentication_failed") {
          setIsAuthenticated(false);
          setUsername("");
        } else if (data.data.success && !data.data.err && data.data.donor) {
          setIsAuthenticated(true);
          setUsername(data.data.donor.email.split("@")[0])
        }
      })

  }, []);

  const handleLogoutClick = () => {
    localStorage.setItem("_id", "");
    window.location.reload();
  }

  console.log(windowSize.width)

  return (
    <nav>
      <div id="hamburger-menu" className="hamburger-menu w-screen h-screen absolute bg-white z-10 p-8 transition-all hidden">
        <div className="flex justify-between items-center">
          <a href="/">
            <img className="h-12" src="logo.svg" alt="Ledgerise | Decentralized Fundrasing-delivering trace protocol" />
          </a>
          <div className="text-3xl text-slate-700" onClick={() => {
            const hamburgerMenu = document.getElementById("hamburger-menu");
            hamburgerMenu.style.left = `-${windowSize.width}px`;
          }}>✕</div>
        </div>
        <div className="flex flex-col pt-16 px-4 h-1/2 justify-between">
          <a href="/" className="flex justify-between items-center">
            <div className="text-2xl text-slate-700">Anasayfa</div>
            <img className="w-4" src="right-arrow.png" alt="right-arrow" />
          </a>
          <a href="/collections" className="flex justify-between items-center">
            <div className="text-2xl text-slate-700">Kampanyalar</div>
            <img className="w-4" src="right-arrow.png" alt="right-arrow" />
          </a>
          <a href="/login" onClick={() => { setLastVisitedUrl() }} className="flex justify-between items-center">
            <div className="text-2xl text-slate-700">Giriş yap</div>
            <img className="w-4" src="right-arrow.png" alt="right-arrow" />
          </a>
          <a href="/register" onClick={() => { setLastVisitedUrl() }} className="flex justify-between items-center">
            <div className="text-2xl text-slate-700">Kayıt ol</div>
            <img className="w-4" src="right-arrow.png" alt="right-arrow" />
          </a>
        </div>
        <div className='w-6/7 mt-16 ml-auto mr-auto'>
              <a href="/collections">
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white"
                  }}
                  customize={{
                    onHover: "lighten",
                    color: "white"
                  }}
                  isFullWidth="true"
                  text='Nereye bağış yapabilirim?'
                  theme='custom'
                  size='xl'
                />
              </a>
            </div>
            {
              isAuthenticated
                ? (
                  <div className="flex absolute bottom-12 w-10/12 justify-between">
                    <div>{username}</div>
                    <div className="w-6 ml-2 cursor-pointer hover:animate-pulse" onClick={() => { handleLogoutClick() }}>
                      <img src="/logout.png" alt="Logout" />
                    </div>
                  </div>
                )
                : ("")
            }
      </div>
      {
        windowSize.width > 400
          ? (
            <div className="p-2 border-b-2 flex flex-row justify-between items-center w-full overflow-x-hidden">
      <h1 className="pl-12 w-40">
        <a href="/">
          <img className="h-20" src="logo.svg" alt="Ledgerise | Decentralized Fundrasing-delivering trace protocol" />
        </a>
      </h1>
      <div className="w-fit flex flex-row items-center">
        <Link href="/collections" className="p-6 text-sm" >
          Kampanyalar
        </Link>
        {
          router.pathname == "/admin"
            ? <ConnectButton moralisAuth={false} />
            : (<div className="mr-36 h-fit">
              {
                isAuthenticated
                  ? (<div className="flex">
                    <div>{username}</div>
                    <div className="w-6 ml-2 cursor-pointer hover:animate-pulse" onClick={() => { handleLogoutClick() }}>
                      <img src="/logout.png" alt="Logout" />
                    </div>
                    <div>
                      <img src="/user.png" alt="" />
                    </div>
                  </div>)
                  : (
                    <div className="flex items-center border-2 rounded-full pr-2">
                      <a href="/login" onClick={() => { setLastVisitedUrl() }} className="border-2 text-sm rounded-full px-12 py-2 mr-2 bg-blue-900 text-slate-100 cursor-pointer hover:bg-blue-800 transition-all">Login</a>
                    </div>
                  )
              }
            </div>)
        }
      </div>
            </div>
          )
          : (
            <div className="flex justify-between py-2 px-8 w-full border-b-2 items-center">
              <div>
                <h1 className="w-24 h-20">
                  <a href="/">
                    <img className="h-20" src="logo.svg" alt="Ledgerise | Decentralized Fundrasing-delivering trace protocol" />
                  </a>
                </h1>
              </div>
              <div onClick={() => {
                const hamburgerMenu = document.getElementById("hamburger-menu");
                hamburgerMenu.style.left = "0";
              }}>
                <div className="w-8 border border-black"></div>
                <div className="w-8 border border-black my-1.5"></div>
                <div className="w-8 border border-black"></div>
              </div>
            </div>
          )
      }
    </nav>
  )
}

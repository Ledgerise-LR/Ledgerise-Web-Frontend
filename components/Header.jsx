
import { ConnectButton, Button } from "web3uikit";
import Link from "next/link";
import { AES, enc } from "crypto-js";
import { useDeferredValue, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { URL, PORT } from '@/serverConfig';

export default function Header(isApiHeader) {

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

  return (
    <nav className={`overflow-x-hidden z-20 w-full mb-4 bg-white`}>
      <div id="hamburger-menu" className="hamburger-menu w-screen h-screen absolute bg-white z-20 p-8 transition-all hidden overflow-x-hidden">
        <div className="flex justify-between items-center overflow-x-hidden">
          <a href="/">
            <img className="h-12" src="logo.svg" alt="Ledgerise | Bağış hiç olmadığı kadar şeffaf" />
          </a>
          <div className="text-3xl text-slate-700" onClick={() => {
            const hamburgerMenu = document.getElementById("hamburger-menu");
            hamburgerMenu.style.left = `-${windowSize.width}px`;
          }}>✕</div>
        </div>
        <div className="flex flex-col pt-16 px-4 h-1/2 justify-between overflow-x-hidden">
          <a href="/" className="flex justify-between items-center">
            <div className="text-2xl text-slate-700">Anasayfa</div>
            <img className="w-4" src="right-arrow.png" alt="right-arrow" />
          </a>
          <a href="/collections" className="flex justify-between items-center">
            <div className="text-2xl text-slate-700">Kampanyalar</div>
            <img className="w-4" src="right-arrow.png" alt="right-arrow" />
          </a>
          <a href="/collections" className="flex justify-between items-center">
            <div className="text-2xl text-slate-700">Hakkımızda</div>
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
        <div className='w-6/7 mt-16 ml-auto mr-auto overflow-x-hidden'>
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
        windowSize.width > 800
          ? (
            <div className={`px-24 border-b py-10 items-center z-20 flex w-screen bg-white ${router.pathname == "/api-documentation" ? "h-16 overflow-y-hidden" : "h-16 overflow-y-hidden"}`}>
      <div className={`h-10 w-fit overflow-hidden`}>
        <a href="/">
          <img className="h-full" src="logo.svg" alt="Ledgerise | Bağış hiç olmadığı kadar şeffaf" />
        </a>
      </div>
      <div className="z-20 w-fit ml-12 flex flex-row items-center text-sm font-medium text-black">
        <Link href="/collections" className="mx-4 hover:border-b-2 w-fit hover:mt-0.5 border-orange-200" >
          Kampanyalar
        </Link>
        <Link href="/how-to-donate-collections" className="mx-4 hover:border-b-2 hover:mt-0.5 border-orange-200" >
          Nasıl bağış yapılır?
        </Link>
        <Link href="/api-documentation" className="mx-4 hover:border-b-2 hover:mt-0.5 border-orange-200" >
          Entegrasyon
        </Link>
        <Link href="/team" className="mx-4 hover:border-b-2 hover:mt-0.5 border-orange-200" >
          Hakkımızda
        </Link>
      </div>
      <div className="z-20 w-fit flex flex-row items-center text-sm font-medium text-black ml-auto">
        {
          router.pathname == "/admin"
            ? <ConnectButton moralisAuth={false} />
            : router.pathname != "/company" 
              ? (<div className="h-fit">
                {
                  isAuthenticated
                    ? (<div className="flex items-center">
                      <div>{username}</div>
                      <div className="w-6 ml-2 text-sm cursor-pointer hover:animate-pulse" onClick={() => { handleLogoutClick() }}>
                        <img src="/logout.png" alt="Logout" />
                      </div>
                      <div>
                        <img src="/user.png" alt="" />
                      </div>
                    </div>)
                    : (
                      <div className="flex">
                        <div className="flex items-center">
                          <a href="/login" onClick={() => { setLastVisitedUrl() }} className="px-8 py-2 mr-2 text-gray-800 cursor-pointer rounded hover:bg-purple-700 hover:text-white transition-all">Giriş Yap</a>
                        </div>
                        <div className="flex items-center">
                          <a href="/login" onClick={() => { setLastVisitedUrl() }} className="bg-[linear-gradient(20deg,rgba(60,0,70,1)_0%,rgba(60,30,0,1)_75%)] px-8 py-2 mr-2 rounded text-slate-100 cursor-pointer hover:bg-orange-700 transition-all">Kayıt Ol</a>
                        </div>
                      </div>
                      
                    )
                }
            </div>)
            : ("")
        }
      </div>
            </div>
          )
          : (
            <div className="flex z-30 justify-between px-8 bg-white w-full border-b-2 items-center h-16 fixed">
              <div>
                <h1 className="w-24 h-16">
                  <a href="/">
                    <img className="h-16" src="logo.svg" alt="Ledgerise | Bağış hiç olmadığı kadar şeffaf" />
                  </a>
                </h1>
              </div>
              <div onClick={() => {
                const hamburgerMenu = document.getElementById("hamburger-menu");
                hamburgerMenu.style.left = "0";
              }}>
                <div className="w-8 border border-black"></div>
                <div className="w-8 border border-black my-1"></div>
                <div className="w-8 border border-black"></div>
              </div>
            </div>
          )
      }
    </nav>
  )
}


import { ConnectButton } from "web3uikit";
import Link from "next/link";
import { AES, enc } from "crypto-js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { URL, PORT } from '@/serverConfig';

export default function Header() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <nav className="p-2 border-b-2 flex flex-row justify-between items-center w-screen overflow-x-hidden">
      <h1 className="pl-12 w-48">
        <a href="/">
          <img className="h-20" src="logo.svg" alt="Ledgerise | Decentralized Fundrasing-delivering trace protocol" />
        </a>
      </h1>
      <div className="flex flex-row justify-between items-center">
        <Link href="/" className="mr-4 p-6">
          Home
        </Link>
        <Link href="/collections" className="mr-4 p-6" >
          Aid Campaigns
        </Link>
        <Link href="/auctions" className="mr-4 p-6">
          Charity Auctions
        </Link>
        <div className="w-20">
          <div></div>
        </div>
        {
          router.pathname == "/admin"
            ? <ConnectButton moralisAuth={false} />
            : (<div className="w-fit mr-36 h-fit">
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
                      <a href="/login" className="border-2 rounded-full px-12 py-2 mr-2 bg-blue-900 text-slate-100 cursor-pointer hover:bg-blue-800 transition-all">Login</a>
                      <div>to donate</div>
                    </div>
                  )
              }
            </div>)
        }
      </div>
    </nav>
  )
}

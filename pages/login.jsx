import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AES } from "crypto-js";
import { URL, PORT } from '@/serverConfig';
import { FaHome } from 'react-icons/fa';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { GoogleLogin } from '@react-oauth/google';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [success, setSuccess] = useState(null);
  const [successText, setSuccessText] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (router.query.register !== undefined) {
      setIsLogin(false); 
    } else {
      setIsLogin(true); 
    }
  }, [router.query]);
  

  const handleClick = () => {
    const encryptedPassword = AES.encrypt(password, 'secret_key').toString();  

    axios.post(`${URL}:${PORT}/auth/${isLogin ? 'login' : 'register'}`, { 
      email: email,
      password: password
    })
      .then(response => {
        const { success, err, donor } = response.data;
        if (!success) {
          setSuccess(false);
          setSuccessText(err === "bad_request"
            ? "An error occurred, please check your internet connection and try again."
            : "The email or password you've entered may be incorrect. Please try again."
          );
        } else {
          setSuccess(true);
          if (isLogin) {
            localStorage.setItem("_id", donor._id);
            const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");
            router.push(lastVisitedUrl || "/");
          } else {
            setSuccessText("Registration successful! Please log in.");
            setIsLogin(true);
          }
        }
      })
      .catch(() => {
        setSuccess(false);
        setSuccessText("An unexpected error occurred. Please try again.");
      });
  };

  useEffect(() => {
    const starsContent = document.getElementById("stars-content");
    for (let i = 0; i < 200; i++) {
      const star = document.createElement("div");
      star.style.position = "absolute";
      star.style.color = "white";
      star.style.fontSize = "2px";
      star.innerHTML = "★";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * (100 - Math.random() * 40)}%`;
      starsContent.appendChild(star);
    }
  }, []);

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className="flex max-sm:flex-col-reverse shadow-slate-600 sm:shadow-lg lg:rounded-2xl h-full w-full lg:w-4/5 xl:w-3/4 2xl:w-2/3 lg:h-3/4">
        <a href='/' className='absolute max-sm:text-sm max-sm:right-4 max-sm:top-4 sm:m-6 z-20 py-2 px-2 xs:px-4 rounded bg-orange-400 text-sm w-fit text-black cursor-pointer'>
          <span className="hidden xs:inline">Ana Sayfa</span>
          <span className="inline xs:hidden">
            <FaHome size={20} />
          </span>
        </a>
        <div className={`flex flex-col bg-[linear-gradient(0deg,rgba(255,100,0,0.75)_0%,rgba(20,50,150,0.75)_75%)] relative p-8 max-sm:h-1/2 w-full sm:w-1/2 ${isLogin ? "lg:rounded-l-2xl" : "lg:rounded-r-2xl max-sm:-translate-y-full sm:translate-x-full"} transition-all duration-700 z-10`}>
          <div id="stars-content" className='absolute top-0 left-0 z-0 w-full h-full animate-pulse'></div>
          <div className='w-full flex flex-col items-center gap-3 my-auto'>
            <img className='h-24 xs:h-36 z-10 rounded border-2' src="icon.svg" alt="Ledgerise" />
            <div className='text-slate-50 text-2xl lg:text-3xl xl:text-4xl'>Hoşgeldiniz!</div>
            <div className='text-slate-200 text-lg text-center px-0 max-sm:px-6'>
              {!isLogin ? "Halihazırda hesabınız var mı? Hemen bağış yapmak için giriş yapın." : "Hesabınız yok mu? İhtiyaç sahiplerine bağış yapabilmek için kayıt olun."}
            </div>
            <a onClick={() => { setIsLogin(!isLogin) }} className='bg-transparent font-semibold text-slate-100 border-2 border-slate-100 rounded-full p-3 transition-all cursor-pointer z-10'>
              {isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </a>
          </div>
          <div className='ml-auto text-slate-100 z-10'>LR 2023</div>
        </div>

        <div className={`flex flex-col p-8 justify-center max-sm:h-1/2 w-full sm:w-1/2 lg:rounded-2xl ${isLogin ? "" : "max-sm:translate-y-full sm:-translate-x-full"} transition-all duration-700 z-0`}>
          <div className='text-2xl mb-8 flex items-center'><img className='h-10' src="/logo.svg" alt="Logo" />&nbsp; | &nbsp;{isLogin ? "Giriş Yap" : "Kayıt Ol"}</div>
          {/* <div className='mb-2'>
            {isLogin ? (
             e <div><strong>Güvenli</strong> ve <strong>%100 şeffaf</strong>, <strong>uçtan uca</strong> bağış takip sistemine katılın.</div>
            ) : (
              "Şeffaf bağış sistemimize katılmak için aşağıdaki bilgileri doldurun."
            )}
          </div> */}
          {/* <div className='mb-4'>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse)
              }}

              onError={() => {
                console.log("Login failed.")
              }}
            />
          </div> */}
          <div className='flex flex-col mb-4'>
            <input className='bg-gray-50 rounded p-2 mb-4' type="text" placeholder='E-posta adresi'
              onChange={(e) => setEmail(e.target.value)} />
            {/* <div>
              <PhoneInput 
                className='p-2 bg-slate-50 mb-4'
                placeholder="Enter phone number"
                value={telephone}
                onChange={setTelephone}
              />
            </div> */}
            {/* <input className='bg-gray-50 rounded p-2 mb-4' type="password" placeholder='Şifre'
              onChange={(e) => setPassword(e.target.value)} /> */}
            <input className='bg-gray-50 rounded p-2 mb-4' type="password" placeholder='Şifre'
              onChange={(e) => setPassword(e.target.value)} />
            {success !== null && (
              <div className={`${success ? "text-green-600" : "text-red-600"} mb-2`}>
                {successText}
              </div>
            )}
            <div className='ml-auto text-white bg-slate-900 px-4 py-2 rounded-lg cursor-pointer' onClick={handleClick}>
              → {!isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

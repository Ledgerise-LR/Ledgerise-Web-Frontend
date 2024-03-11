
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AES, enc } from "crypto-js";
import { URL, PORT } from '@/serverConfig';

export default function Home() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [successText, setSuccessText] = useState("");

  useEffect(() => {
    ;
  }, [success, successText])

  const handleClick = () => {
    axios.post(`${URL}:${PORT}/auth/login`, {
      email: email,
      password: password
    })
      .then(data => {
        if (!data.data.success && data.data.err) {
          setSuccess("false");
          if (data.data.err == "bad_request") setSuccessText("An error occured, please check your internet connection, and try again.");
          else if (data.data.err == "verify_error") setSuccessText("The email or password you've entered may be inappropriate. Please try again.");
        } else if (data.data.success && !data.data.error && data.data.donor) {
          setSuccess("true")
          localStorage.setItem("_id", data.data.donor._id);
          router.push("/");
        }
      })
  }

  useEffect(() => {
    const startsContent = document.getElementById("starts-content");

    for (let i = 0; i < 100; i++) {
      const star = document.createElement("div");
      star.style.position = "absolute";
      star.style.color = "white";
      star.style.fontSize = "2px"
      star.innerHTML = "★";
      star.style.left = (Math.random() * 95).toString() + "%";
      star.style.top = (Math.random() * (120 - (Math.random() * 40))).toString() + "%";
      startsContent.appendChild(star);
    }
  }, []);

  return (
    <div className='w-screen h-screen flex items-center justify-center sm:flex'>
      <div className='w-fit h-5/6 flex shadow-slate-600 shadow-lg flex-wrap flex-row-reverse'>
        <div className='flex flex-col w-100 h-full bg-[linear-gradient(0deg,rgba(255,100,0,0.75)_0%,rgba(20,50,150,0.75)_75%)] justify-between p-4 relative'>
          <div id="starts-content" className='absolute z-0 w-full h-36 animate-pulse'></div>
          <a href='/' className='z-10 py-2 px-4 rounded bg-blue-500 w-fit text-slate-100 cursor-pointer'>← Back to main</a>
          <div className='w-full flex flex-col items-center'>
            <div className='flex items-center'>
              <img className='h-36 z-10' src="icon.svg" alt="Ledgerise" />
              {/* <div className='text-2xl text-slate-50 mx-4'>×</div>
              <img className='h-36' src="uaa.png" alt="Üsküdar American Academy" /> */}
            </div>
            <div className='text-slate-50 text-4xl my-4'>Ledgerise'a hoşgeldiniz</div>
            <div className='text-slate-200 text-lg text-center'>Gönül rahatlığıyla bağış yapın. Bağışınızın ihtiyaç sahiplerine ulaştığını görün.</div>
            {/* <div className='mt-4 flex items-center'>
              <div className='mr-4 text-slate-600'>New to Ledgerise?</div>
              <a href='/register' className='bg-blue-900 text-slate-100 py-3 px-8 rounded-lg border hover:border-blue-900 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer'>Sign Up</a>
            </div> */}
          </div>
          <div className='ml-auto text-slate-900'>Ledgerise 2024</div>
        </div>
        <div className='flex flex-col w-100 h-full p-4 px-16 justify-between bg-white'>
          <div></div>
          <div>
            <div className='text-2xl mb-8'>Ledgerise | Login</div>
            <hr />
            <div className='mb-8'><strong>Güvenli</strong> ve <strong>%100 şefaf</strong>, <strong>uçtan uca</strong> bağış takip sistemine katılın.</div>
            <div className='flex flex-col mb-4'>
              <input className='bg-slate-100 rounded p-2 mb-4' type="text" placeholder='Email address' onChange={(e) => setEmail(e.target.value)} />
              <input className='bg-slate-100 rounded p-2 mb-4' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
              <div className={`${success == "true" ? ("text-green-600") : (success == "false" ? ("text-red-600") : (""))}`}>{successText}</div>
              <div className='ml-auto w-1/4 border text-slate-50 bg-blue-900 p-2 rounded flex flex-row-reverse cursor-pointer hover:animate-pulse' onClick={() => { handleClick() }}>→ Login</div>
            </div>
          </div>
          <div className='ml-auto'>Powered by LR</div>
        </div>
      </div>
    </div>
  )
}


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

    if (email != "" && password != "") {

      axios.post(`${URL}:${PORT}/auth/login-verifier`, {
        code: email,
        password: password
      }).then(res => {
        console.log(res)
        const data = res.data;
          if (!data.success && data.err) {
            setSuccess("false");

            if (data.err == "bad_request") setSuccessText("An error occured, please check your internet connection, and try again.");
            else if (data.err == "verify_error") setSuccessText(`Girdiğiniz eposta adresi ile şifre eşlenemedi`);
          } else if (data.success && !data.error && data.company) {
            console.log("hello")
            setSuccess("true")
            setSuccessText("Successfully registered. Proceeding main.")
            localStorage.setItem("company_code", data.company.code);
            router.push("/company");
          }
        })
    } else {
      setSuccess("false");
      setSuccessText("Please fill all fields appropriately.");
    }
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='w-9/12 h-5/6 flex shadow-slate-600 shadow-lg'>

        <div className='flex flex-col w-full h-full p-4 px-16 justify-between'>
          <div></div>
          <div>
            <div className='text-2xl mb-8'>STK & Organizasyon Girişi</div>
            <hr />
            <div className='mb-8'>Kullanıcı bilgilerinizi girerek %100 şeffaf bağış ağına katılın</div>
            <div className='flex flex-col mb-4'>
              <input className='bg-slate-100 rounded p-2 mb-4 w-1/2' type="text" placeholder='Kurum kodu' onChange={(e) => setEmail(e.target.value)} />
              <input className='bg-slate-100 rounded p-2 mb-4 w-1/2 mr-4' type="text" placeholder='Şifre' onChange={(e) => setPassword(e.target.value)} />
              <div className={`${success == "true" ? ("text-green-600") : (success == "false" ? ("text-red-600") : (""))}`}>{successText}</div>
              <div className='ml-auto w-36 border text-slate-50 bg-blue-900 p-2 rounded flex flex-row-reverse cursor-pointer' onClick={() => { handleClick() }}>→ Giriş Yap</div>
            </div>
          </div>
          <div className='ml-auto'>Powered by LR</div>
        </div>
      </div>
    </div>
  )
}

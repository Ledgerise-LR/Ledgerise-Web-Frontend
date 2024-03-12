
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AES, enc } from "crypto-js";
import { URL, PORT } from '@/serverConfig';

export default function Home() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [schoolNumber, setSchoolNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nationalIdentificationNumber, setNationalIdentificationNumber] = useState("");


  const [success, setSuccess] = useState("");
  const [successText, setSuccessText] = useState("");

  useEffect(() => {
    ;
  }, [success, successText])

  const handleClick = () => {

    if (email != "" && password != "") {
      axios.post(`${URL}:${PORT}/auth/register`, {
        email: email,
        school_number: email,
        password: password
      })
        .then(data => {
          if (!data.data.success && data.data.err) {
            setSuccess("false");
            if (data.data.err == "bad_request") setSuccessText("An error occured, please check your internet connection, and try again.");
            else if (data.data.err == "duplicate_key") setSuccessText(`The account with email ${email} already exists`);
          } else if (data.data.success && !data.data.error && data.data.donor) {
            setSuccess("true")
            setSuccessText("Successfully registered. Proceeding main.")
            localStorage.setItem("_id", data.data.donor._id);
            router.push("/");
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
        {/* <div className='flex flex-col w-1/2 h-full bg-blue-800 justify-between p-4'>
          <a href='/' className='py-2 px-4 rounded bg-blue-500 w-fit text-slate-100 cursor-pointer'>← Back to main</a>
          <div className='w-full flex flex-col items-center'>
            <div className='flex items-center'>
              <img className='h-36' src="logocompact.svg" alt="Ledgerise" />
              <div className='text-2xl text-slate-50 mx-4'>×</div>
              <img className='h-36' src="uaa.png" alt="Üsküdar American Academy" />
            </div>
            <div className='text-slate-50 text-5xl my-4'>Welcome to Ledgerise</div>
            <div className='text-slate-200 text-xl'>Donate with a piece of mind. See your donation meeting beneficiaries.</div>
            <div className='mt-4 flex items-center'>
              <div className='mr-4 text-slate-300'>Already a donor?</div>
              <a href='/login' className='bg-blue-900 text-slate-100 py-3 px-8 rounded-lg border hover:border-blue-900 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer'>Login</a>
            </div>
          </div>
          <div className='ml-auto text-slate-300'>Ledgerise 2023</div>
        </div> */}
        <div className='flex flex-col w-full h-full p-4 px-16 justify-between'>
          <div></div>
          <div>
            <div className='text-2xl mb-8'>Ledgerise | Giriş</div>
            <hr />
            <div className='mb-8'>Email adresinizi ve şifrenizi girerek raporunuzu görüntüleyin.</div>
            <div className='flex flex-col mb-4'>
              <input className='bg-slate-100 rounded p-2 mb-4' type="text" placeholder='Email address' onChange={(e) => setEmail(e.target.value)} />
              <input className='bg-slate-100 rounded p-2 mb-4 w-1/2 mr-4' type="text" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
              <div className={`${success == "true" ? ("text-green-600") : (success == "false" ? ("text-red-600") : (""))}`}>{successText}</div>
              <div className='ml-auto w-24 border text-slate-50 bg-blue-900 p-2 rounded flex flex-row-reverse cursor-pointer hover:animate-bounce' onClick={() => { handleClick() }}>→ Sign Up</div>
            </div>
          </div>
          <div className='ml-auto'>Powered by Üsküdar American Academy</div>
        </div>
      </div>
    </div>
  )
}


import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AES, enc } from "crypto-js";

export default function Home() {

  const router = useRouter();

  const hashStringAES = (value) => {
    const encryptedValue = AES.encrypt(enc.Utf8.parse(value), `${process.env.AUTHENTICATION_KEY}`);
    return encryptedValue.toString();
  }

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [schoolNumber, setSchoolNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [success, setSuccess] = useState("");
  const [successText, setSuccessText] = useState("");

  useEffect(() => {
    ;
  }, [success, successText])

  const handleClick = () => {

    if (email != "" && phoneNumber != "" && schoolNumber != "" && password != "" && confirmPassword != "" && password == confirmPassword) {
      axios.post("http://localhost:4000/auth/register", {
        email: email,
        school_number: schoolNumber,
        phone_number: phoneNumber,
        password: password
      })
        .then(data => {
          if (!data.data.success && data.data.err) {
            setSuccess("false");
            if (data.data.err == "bad_request") setSuccessText("An error occured, please check your internet connection, and try again.");
          } else if (data.data.success && !data.data.error && data.data.donor) {
            setSuccess("true")
            setSuccessText("Successfully registered. Proceeding main.")
            localStorage.setItem("_id", hashStringAES(data.data.donor._id));
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
        <div className='flex flex-col w-1/2 h-full bg-blue-800 justify-between p-4'>
          <a href='/' className='py-2 px-4 rounded bg-blue-500 w-fit text-slate-100 cursor-pointer'>← Back to main</a>
          <div className='w-full flex flex-col items-center'>
            <div className='flex items-center'>
              <img className='h-36' src="logocompact.svg" alt="Ledgerise" />
              <div className='text-2xl text-slate-50 mx-4'>×</div>
              <img className='h-36' src="uaa.png" alt="Üsküdar American Academy" />
            </div>
            <div className='text-slate-50 text-5xl my-4'>Welcome to Ledgerise</div>
            <div className='text-slate-200 text-xl'>Donate with a piece of mind. See your donation meeting beneficiaries.</div>
          </div>
          <div className='ml-auto text-slate-300'>Ledgerise 2023</div>
        </div>
        <div className='flex flex-col w-1/2 h-full p-4 px-16 justify-between'>
          <div></div>
          <div>
            <div className='text-2xl mb-8'>Ledgerise | Login</div>
            <hr />
            <div className='mb-8'>Join the <strong>trustworthy</strong> and completely <strong>transparent</strong>, <strong>end-to-end</strong> donation trace system.</div>
            <div className='flex flex-col mb-4'>
              <input className='bg-slate-100 rounded p-2 mb-4' type="text" placeholder='Email address' onChange={(e) => setEmail(e.target.value)} />
              <input className='bg-slate-100 rounded p-2 mb-4' type="number" placeholder=' School Number' onChange={(e) => setSchoolNumber(e.target.value)} />
              <input className='bg-slate-100 rounded p-2 mb-4' type="text" placeholder='Phone Number' onChange={(e) => setPhoneNumber(e.target.value)} />
              <input className='bg-slate-100 rounded p-2 mb-4' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
              <input className='bg-slate-100 rounded p-2 mb-4' type="password" placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} />

              <div className={`${success == "true" ? ("text-green-600") : (success == "false" ? ("text-red-600") : (""))}`}>{successText}</div>
              <div className='ml-auto w-1/4 border text-slate-50 bg-blue-900 p-2 rounded flex flex-row-reverse cursor-pointer hover:animate-bounce' onClick={() => { handleClick() }}>→ Login</div>
            </div>
          </div>
          <div className='ml-auto'>Powered by Üsküdar American Academy</div>
        </div>
      </div>
    </div>
  )
}

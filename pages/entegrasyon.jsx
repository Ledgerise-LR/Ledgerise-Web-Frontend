
import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL, PORT } from '@/serverConfig';
import { Select, Input, Button } from 'web3uikit';

export default function Home() {

  const [selectedCompany, setSelectedCompany] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {

    const _id = localStorage.getItem("_id");

    axios.post(`${URL}:${PORT}/auth/authenticate`, {
      _id: _id
    })
      .then((res) => {
        const data = res.data;
        if (data.success && data.donor) {
          ;
        } else {
          window.location.href = "/";
        }
      })
  }, [])

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='w-full h-full p-4'>
        <div className='mb-4'>İhtiyaçlar</div>
        <div className='flex flex-col h-full'>
          <div className='w-11/12 border-2 h-96'>
            
          </div>
        </div>
      </div>
    </div>
  )
}

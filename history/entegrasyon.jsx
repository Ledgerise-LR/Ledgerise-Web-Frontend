
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
    <div className='w-screen h-screen flex items-center justify-center sm:flex'>
      <div className='w-full h-full p-4'>
        <div>
          <div className='text-lg'>Bağışınızı hangi şirket aracılığıyla gönderdiniz?</div>
          <Select
            label='Kargo aracı kurum'
            options={[
              {
                label: "HepsiBurada",
                id: "hepsiburada"
              },
              {
                label: "Migros Sanal Market",
                id: "migroshemen"
              }
            ]}
            onChange={(e) => {
              setSelectedCompany(e.label);
            }}
          />
        </div>
        <div className='mt-8'>
          <div>{selectedCompany ? selectedCompany : "Seçtiğiniz kurum"} için kimlik bilgilerinizi doğrulayınız</div>
          <div className='mt-8'>
            <Input
              label='Kullanıcı adınız'
              type='text'
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              style={{
                marginBottom: "20px"
              }}
            />
            <Input
              label='Şifreniz'
              type='password'
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </div>
        </div>
        <div className='mt-8 mb-8'>
          <div className='mb-8'>Bağış gönderimini gerçekleştirdiğiniz satıcı kodunu ve sipariş numarasını giriniz.</div>
          <Input
            label='Satıcı kodu'
            type='text'
            onChange={(e) => {
              setMerchantId(e.target.value)
            }}
            style={{
              marginBottom: "20px"
            }}
          />
          <Input
            label='Sipariş Numarası'
            type='text'
            onChange={(e) => {
              setOrderNumber(e.target.value)
            }}
          />
        </div>
        <Button
          style={{
            backgroundColor: "#fec35b",
            color: "white",
            borderColor: "green"
          }}
          customize={{
            onHover: "lighten",
            color: "white"
          }}
          text='Bağışımı onayla!'
          theme='custom'
          size='xl'
        />
      </div>
    </div>
  )
}

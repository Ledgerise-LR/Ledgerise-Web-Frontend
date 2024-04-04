
import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL, PORT } from '@/serverConfig';
import { Select, Input, Button, Modal } from 'web3uikit';

export default function Home() {


  const [needs, setNeeds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [depotAddress, setDepotAddress] = useState("HB İZMİR DEPO");
  const [donationName, setDonationName] = useState("Xiaomi Redmi Note 7");
  const [donationPrice, setDonationPrice] = useState(18000);
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("Atatürk Mah. Çarşı Cad. Kare Sok. 2/4");
  const [orderNumber, setOrderNumber] = useState("49537952075");

  const [quantityDetermined, setQuantityDetermined] = useState(0);
  
  const showModal = () => {
    setIsModalOpen(true);
  }

  const hideModal = () => {
    setIsModalOpen(false);
  }

  const handleListNeedItemClick = () => {

    axios.post(`${URL}:${PORT}/needs/list-need-item`, {
      beneficiaryAddress: beneficiaryAddress,
      beneficiaryPhoneNumber: needs[0].beneficiaryPhoneNumber,
      orderNumber: orderNumber,
      donationPrice: donationPrice,
      donationName: donationName,
      depotAddress: depotAddress,
      quantitySatisfied: quantityDetermined
    })
      .then((res) => {
        const data = res.data;
        console.log(data);
      })
  }

  useEffect(() => {

    const _id = localStorage.getItem("_id");

    axios.post(`${URL}:${PORT}/auth/authenticate`, {
      _id: _id
    })
      .then((res) => {
        const data = res.data;
        if (data.success && data.donor) {
          axios.get(`${URL}:${PORT}/needs/get-all-needs`,
          {})
            .then((res) => {
              const data = res.data;
              setNeeds(data.needs);
            })
        } else {
          window.location.href = "/";
        }
      })
  }, [])

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      {
        isModalOpen
          ? (
            <Modal visible={isModalOpen} width='100%' onCloseButtonPressed={hideModal} onOk={hideModal} onCancel={hideModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Bağışınız için teşekkürler 🎉</h1>}>
              <div className='w-1/5'>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Hepsiburada_logo_official.svg/2560px-Hepsiburada_logo_official.svg.png" alt="Hepsiburada" />
              </div>
              <div className='w-full p-4'>
                <div className='w-1/3 h-full flex border-2 p-4'>
                  <div className='w-1/2'>
                    <div>
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9U36dKtoEBdLFOMVy1gwDM4MJZ8njtzOouz6YQcjWzg&s" alt="Telefon" />
                    </div>
                    <div className='text-xl'>{donationName}</div>
                    <div className='text-lg'>{donationPrice-1} ₺</div>
                  </div>
                  <div className='w-1/2 relative'>
                    {
                      needs && needs.length
                       ?<div>
                          <div className='font-bold text-black'>İhtiyaç sahibi telefon</div>
                          <div>{needs[0].beneficiaryPhoneNumber}</div>
                        </div>
                       : ("")
                    }
                    <div>
                      <div className='font-bold text-black'>Depo Adresi</div>
                      <div>{depotAddress}</div>
                    </div>
                    <div>
                      <div className='font-bold text-black'>İhtiyaç sahibi adres</div>
                      <div>{beneficiaryAddress}</div>
                    </div>
                    <div>
                      <div className='font-bold text-black'>Sipariş numarası</div>
                      <div>{orderNumber}</div>
                    </div>
                    <div className='flex'>
                      <div className='p-4 border rounded'>{quantityDetermined}</div>
                      <div>
                        <div className='cursor-pointer p-2 flex justify-center items-center border rounded-lg' onClick={() => {setQuantityDetermined(quantityDetermined+1)}}>+</div>
                        <div className='cursor-pointer p-2 flex justify-center items-center border rounded-lg' onClick={() => {setQuantityDetermined(quantityDetermined-1)}}>-</div>
                      </div>
                    </div>
                    <div className='absolute bottom-4 right-4 bg-red-600 text-slate-50 p-2 cursor-pointer' onClick={() => {
                      handleListNeedItemClick();
                    }}>İhtiyacı karşıla</div>
                  </div>
                </div>
              </div>
            </Modal>
            /*
                  address nftAddress,
                  uint256 tokenId,
                  uint256 price,
                  address charityAddress,
                  string memory tokenUri,
                  uint256 subCollectionId,
                  NeedDetails memory needDetails
            */
          )
          : ("")
      }
      <div className='w-full h-full p-4'>
        <div className='mb-4'>İhtiyaçlar</div>
        <div className='flex flex-col h-full'>
          <div className='m-4 w-11/12 h-96'>
            {
              needs && needs.length > 0
                ? needs.map(need => {
                  return (
                    <div className='w-full border-2 p-4 relative mb-4'>
                      <div>{need.name}</div>
                      <div>{need.quantity} adet</div>
                      <div onClick={() => {showModal()}} className='absolute bottom-4 right-4 bg-red-600 text-slate-50 p-2 cursor-pointer'>İhtiyacı karşıla</div>
                    </div>
                  )
                }) 
                : (
                  <div>İhtiyaç başvurusu şu an mevcut değil.</div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

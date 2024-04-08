
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { URL, PORT } from '@/serverConfig';
import { Select, Input, Button, Modal } from 'web3uikit';
import dynamic from "next/dynamic"

export default function Home() {


  const [needs, setNeeds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const [depotAddress, setDepotAddress] = useState("HB İZMİR DEPO");
  const [donationName, setDonationName] = useState("Xiaomi Redmi Note 7");
  const [donationPrice, setDonationPrice] = useState(18000);
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("Atatürk Mah. Çarşı Cad. Kare Sok. 2/4");
  const [orderNumber, setOrderNumber] = useState("49537952075");
  const [tokenUri, setTokenUri] = useState("ipfs://QmZF2GAphvYsfLapAM7TFc64U7mqZfk2w2hhrErsSz4Svi");
  const [needId, setNeedId] = useState("");

  const [donor, setDonor] = useState({});

  const [quantityDetermined, setQuantityDetermined] = useState(0);
  

  const [needItemsArray, setNeedItemsArray] = useState([]);

  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => <p>The map is loading...</p>,
      ssr: false
    }
  ), [])

  const showReportModal = () => {
    setIsReportModalOpen(true);
  }

  const hideReportModal = () => {
    setIsReportModalOpen(false);
  }

  const [displayedStampLocation, setDisplayedStampLocation] = useState({});
  const [displayedStampDetails, setDisplayedStampDetails] = useState({});
  const [displayedNeedTokenUri, setDisplayedNeedTokenUri] = useState("");
  const [displayedNeedItem, setDisplayedNeedItem] = useState({});
  const [displayedNeed, setDisplayedNeed] = useState("");

  const [visualVerifications, setVisualVerifications] = useState([]);

  const showMapModal = (needDetails, deliverDetails, needTokenUri, need, needItem) => {

    hideReportModal();
    axios.post(`${URL}:${PORT}/depot/get-depot-location`, {
      depotName: needDetails.depotAddress
    })
      .then((res) => {
        const stampLocation = res.data.depotLocation;

        setDisplayedNeedItem(needItem)
        setDisplayedStampLocation(stampLocation);
        setDisplayedStampDetails(needDetails);
        setDisplayedNeedTokenUri(needTokenUri);
        setDisplayedNeed(need);
        setIsMapModalOpen(true);
      })
  }

  const hideMapModal = () => {

    setIsMapModalOpen(false);
    setIsReportModalOpen(true);
  }

  const showModal = (needId) => {
    setNeedId(needId)
    setIsModalOpen(true);
  }

  const hideModal = () => {
    setNeedId("");
    setIsModalOpen(false);
  }

  const handleListNeedItemClick = () => {

    axios.post(`${URL}:${PORT}/needs/list-need-item`, {
      beneficiaryAddress: beneficiaryAddress,
      needId: needId,
      orderNumber: orderNumber,
      donorPhoneNumber: donor.school_number, 
      price: donationPrice,
      name: donationName,
      depotAddress: depotAddress,
      quantitySatisfied: quantityDetermined,
      tokenUri: tokenUri
    })
      .then((res) => {
        const data = res.data;
        alert("Ürün başarıyla bağışlandı")
      })
  }

  function prettyDate(timestamp) {

    const date = new Date(timestamp * 1);
    const formattedDate = date.toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    return formattedDate;
  }

  useEffect(() => {

    const _id = localStorage.getItem("_id");

    axios.post(`${URL}:${PORT}/auth/authenticate`, {
      _id: _id
    })
      .then((res) => {
        const data = res.data;
        if (data.success && data.donor) {
          const dataDonor = data.donor
          setDonor(data.donor)
          axios.get(`${URL}:${PORT}/needs/get-all-needs`,
          {})
            .then((res) => {
              const data = res.data;
              setNeeds(data.needs);
              
              axios.post(`${URL}:${PORT}/needs/get-satisfied-donations-of-donor`, {
                buyer: dataDonor.school_number
              })
                .then((res) => {
                  const data = res.data;
                  if (data.success) {
                    setNeedItemsArray(data.needItemsArray);

                    fetch(`${URL}:${PORT}/get-all-visual-verifications`)
                      .then(response => response.json())
                      .then(data => {
                        setVisualVerifications(data.data);
                      })
                  } else {
                    alert("An error occured, please try again.")
                  }
                })
            })
        } else {
          window.location.href = "/";
        }
      })
  }, [])

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      {
        isMapModalOpen
          ? <Modal visible={isMapModalOpen} width='100%' onCloseButtonPressed={hideMapModal} onOk={hideMapModal} onCancel={hideMapModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Bağışınızın şeffaf güzergahı 🎉</h1>}>
            <div className='w-full h-96'>
              <Map
                nftAddress={displayedNeed.nftAddress}
                stampCoordinates={displayedStampLocation}
                isNeedItem={true}
                needItemInfo={displayedStampDetails}
                zoom={10}
                needTokenUri={displayedNeedTokenUri}
                need={displayedNeed}
                visualVerifications={visualVerifications}
                deliveredCoordinates={displayedNeedItem.real_item_history[0].location || {}}
                deliverVisualTokenId={displayedNeedItem.real_item_history[0].visualVerificationTokenId || 0}
              />
            </div>
          </Modal>
          : ("")
      }
      {
        isReportModalOpen
          ? <Modal visible={isReportModalOpen} width='100%' onCloseButtonPressed={hideReportModal} onOk={hideReportModal} onCancel={hideReportModal} okText='Continue' title={<h1 className='text-3xl text-slate-900'>Bağışınız için teşekkürler 🎉</h1>}>
            <div className='w-full h-full'>
              {
                needItemsArray
                  ? needItemsArray.map(needItem => {
                    return(
                      <div className='w-full h-fit mb-8 p-4 border-2'>
                        <div>
                          <div>{needItem.need.name}</div>
                          <div><strong>{prettyDate(needItem.needDetails.donateTimestamp)}</strong> tarihinde ihtiyacın <strong>{needItem.needDetails.quantitySatisfied}</strong> tanesini karşıladınız</div>
                        </div>
                        <div>Bağışınızın gönderildiği kolinin üzerindeki <a target='_blank' className='underline hover:text-slate-300' href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${needItem.needItem.tokenId}-[${needItem.needItem.history[0].openseaTokenId}]`}>QR koda ulaşmak için tıklayın</a></div>
                        <div className='flex items-center mt-4'>
                          <div>Bağışınızın şeffaf güzergahını görüntülemek için</div>
                          <div className='p-2 bg-green-700 text-slate-50 rounded ml-4 cursor-pointer' onClick={() => { showMapModal(needItem.needDetails, needItem.deliverDetails, needItem.needItem.tokenUri, needItem.need, needItem.needItem) }}>Tıklayın</div>
                        </div>
                      </div>
                    )
                  })
                  : ("Karşıladığınız ihtiyaç bulunamadı")
              }
            </div>
          </Modal>
          : ("")
      }
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
                      <img src={`https://ipfs.io/ipfs/QmeUHLwaCEMUZE5kezM71Y1gw7t958UtzbfJh4er8CRKec`} alt="Telefon" />
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
        <div className='w-full h-24'>
        <Button
          size='xl'
          style={{
            fontSize: "24px"
          }}
          theme='secondary'
          text='KARŞILADIĞINIZ İHTİYAÇLARIN RAPORUNU GÖRÜNTÜLEYİN'
          onClick={() => showReportModal()}
        />
        </div>
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
                      <div onClick={() => {showModal(need._id)}} className='absolute bottom-4 right-4 bg-red-600 text-slate-50 p-2 cursor-pointer'>İhtiyacı karşıla</div>
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

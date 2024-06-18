
import { useState, useEffect, useMemo } from 'react';
import axios from "axios";
import { Modal, useNotification, Checkbox, Input, Loading } from 'web3uikit';
import NFTBoxCompany from '@/components/NftCardCompany';
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import { URL, PORT } from '@/serverConfig';
import dynamic from 'next/dynamic';
import { QRCode } from 'react-qrcode-logo';
import QrCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from 'next/router';
import NFTSlateBox from '@/components/NftSlateBox';
import NFTCardPreview from '@/components/NftCardPreview';


export default function Home() {


  function prettyAddress (address) {
    return address.slice(0, 6) + "..." + address.slice(address.length - 6, address.length);
  }

  const router = useRouter();

  const downloadAsPDF = async (divId, fileName) => {
    const div = document.getElementById(divId);

    const canvas = await html2canvas(div);

    const pdf = new jsPDF("l");
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', pdf.internal.pageSize.getWidth() * 0 * -1, 0, pdf.internal.pageSize.getWidth() * 1, pdf.internal.pageSize.getHeight());

    pdf.save(fileName);
  };

  const handleDownloadPDF = (qrId, qrValue) => {
    downloadAsPDF(qrId, `LR_${qrValue}.pdf`);
  };

  const Map = useMemo(() => dynamic(
    () => import('@/components/SelectionMap'),
    {
      loading: () => <p>The map is loading...</p>,
      ssr: false
    }
  ), [])

  const dispatch = useNotification();

  const [collections, setCollections] = useState([]);
  const [qrCodesArray, setQrCodesArray] = useState([]);
  
  const [generalQrCodeData, setGeneralQrCodeData] = useState({});

  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isCreateActiveItemModalOpen, setIsCreateActiveItemModalOpen] = useState(false);

  const [activeItemCollectionObject, setAddActiveItemCollectionObject] = useState({});
  
  const showLabelModal = () => {
    setIsLabelModalOpen(true)
  }

  const hideLabelModal = () => {
    setIsLabelModalOpen(false)
  }

  const showCreateAssetModal = () => {
    setIsCreateActiveItemModalOpen(true)
  }

  const hideCreateAssetModal = () => {
    setIsCreateActiveItemModalOpen(false)
  }

  const updateUI = (code) => {
    axios.get(`${URL}:${PORT}/company/get-company-panel-data?code=${code}`)
      .then(res => {
        const panelData = res.data.data;
        setCollections(panelData);
      })
  }

  const [company, setCompany] = useState({});
  const [statistics, setStatistics] = useState("");
  
  useEffect(() => {

    const companyCode = localStorage.getItem("company_code");
    if (companyCode) {
      axios.get(`${URL}:${PORT}/auth/authenticate-company?code=${companyCode}`)
        .then((res) => {
          const data = res.data;
          if (data.success && data.company) {
            setCompany(data.company);

            axios.get(`${URL}:${PORT}/company/get-company-statistics?code=${companyCode}`)
              .then((response) => {

                const statisticsData = response.data.data;
                setStatistics(statisticsData);
                updateUI(companyCode);
              })
          } else {
            router.push("company-login")
          }
        })
    } else {
      router.push("company-login")
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [selectedImage, setSelectedImage] = useState("");

  const [createAssetName, setCreateAssetName] = useState("");
  const [createAssetAvailableEditions, setCreateAssetAvailableEditions] = useState("");
  const [createAssetPrice, setCreateAssetPrice] = useState("");
  const [createAssetDescription, setCreateAssetDescription] = useState("");
  const [createAssetProperties, setCreateAssetProperties] = useState("");

  const [tempStampLocation, setTempStampLocation] = useState([null, null]);
  const [tempShippedLocation, setTempShippedLocation] = useState([null, null]);
  const [tempDeliveredLocation, setTempDeliveredLocation] = useState([null, null]);

  const [currentSelectingEvent, setCurrectSelectingEvent] = useState("stamp");

  const handleActiveItemCreate = () => {

    const routeData = {
      stampLocation: {
        latitude: parseInt(tempStampLocation[0] * 1000),
        longitude: parseInt(tempStampLocation[1] * 1000),
        decimals: 3
      },

      shipLocation: {
        latitude: parseInt(tempShippedLocation[0] * 1000),
        longitude: parseInt(tempShippedLocation[1] * 1000),
        decimals: 3
      },

      deliverLocation: {
        latitude: parseInt(tempDeliveredLocation[0] * 1000),
        longitude: parseInt(tempDeliveredLocation[1] * 1000),
        decimals: 3
      }
    }

    const companyCode = localStorage.getItem("company_code") || "no_code";

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('name', createAssetName);
    formData.append('description', createAssetDescription);
    formData.append('attributes', createAssetProperties);
    formData.append('companyCode', companyCode);


    axios.post(`${URL}:${PORT}/tokenuri/create`, formData)
        .then((response) => {

          const tokenUri = response.data.tokenUri;

          axios.post(`${URL}:${PORT}/active-item/list-item`, {
            nftAddress: activeItemCollectionObject.nftAddress,
            price: createAssetPrice,
            subcollectionId: activeItemCollectionObject.subcollectionId,
            availableEditions: createAssetAvailableEditions,
            route: routeData,
            tokenUri: tokenUri
          })
            .then((res) => {
              const data = res.data;
              if (data.success && !data.err) {
                
                dispatch({
                  type: "success",
                  message: "Bağış ürünü başarıyla oluşturuldu",
                  title: "İşlem tamamlandı",
                  position: "topR"
                });

                updateUI();

              } else {
                
                dispatch({
                  type: "error",
                  message: "Bağış ürünü oluşturulamadı",
                  title: "Tamamlanmayan işlem",
                  position: "topR"
                });
              }
            })
        })
        .catch((error) => {
          alert(error);
        });
  }

  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  const showCreateCampaignModal = () => {
    setIsCampaignModalOpen(true);
  }

  const hideCampaignModal = () => {
    setIsCampaignModalOpen(false)
  }

  const [createCampaignName, setCreateCampaignName] = useState("");
  const [createCampaignDescription, setCreateCampaignDescription] = useState("");

  const handleSubcollectionCreate = () => {

    const companyCode = localStorage.getItem("company_code") || "no_code";

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('name', createCampaignName);
    formData.append('description', createCampaignName);
    formData.append('companyCode', companyCode);

    axios.post(`${URL}:${PORT}/subcollection/create-subcollection`, formData)
      .then((res) => {
        const data = res.data;

        if (data.success && data.subcollection && !data.err) {
          dispatch({
            type: "success",
            message: "Bağış kampanyası başarıyla oluşturuldu",
            title: "İşlem tamamlandı",
            position: "topR"
          });

          updateUI();
        } else if (!data.success && data.err) {
          dispatch({
            type: "warning",
            message: "Bağış kampanyası oluşturulamadı",
            title: "Tamamlanmayan işlem",
            position: "topR"
          });

          updateUI();
        }
      })
  }

  
  const handleCancelAsset = (nftAddress, tokenId) => {

    axios.post(`${URL}:${PORT}/active-item/cancel-item`, {
      nftAddress: nftAddress,
      tokenId: tokenId
    })
      .then((res) => {
        if (res.data.success && !res.data.err) {
          dispatch({
            type: "success",
            message: "Bağış ürünü başarıyla iptal edildi",
            title: "İşlem tamamlandı",
            position: "topR"
          });

          updateUI();
        } else if (!res.data.success && res.data.err) {
          dispatch({
            type: "warning",
            message: "Bağış ürünü iptal edilmedi",
            title: "Tamamlanmayan işlem",
            position: "topR"
          });
        }
      })

  }


  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState("");
  const [updateAsset, setUpdateAsset] = useState({});
  
  const [updateAssetPrice, setUpdateAssetPrice] = useState("");
  const [updateAssetDescription, setUpdateAssetDescription] = useState("");
  const [updateAssetProperties, setUpdateAssetProperties] = useState("");
  const [updateAssetInitialProperties, setUpdateAssetInitialProperties] = useState("");

  const handleUpdateAsset = async (asset) => {
    if (updateAssetInitialProperties != updateAssetProperties || updateAsset.price != updateAssetPrice || updateAssetDescription != "" || selectedImage != "") {
      if (updateAssetInitialProperties != updateAssetProperties || updateAssetDescription != "" || selectedImage != "") {
        
        // create a new tokenUri first, then update the price with the newTokenUri

        const companyCode = localStorage.getItem("company_code");

        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('name', (await (await fetch(updateAsset.tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/"))).json()).name);
        formData.append('description', updateAssetDescription);
        formData.append('attributes', updateAssetProperties);
        formData.append('companyCode', companyCode);
    
    
        axios.post(`${URL}:${PORT}/tokenuri/create`, formData)
            .then((response) => {
    
              const tokenUri = response.data.tokenUri;
              
              axios.post(`${URL}:${PORT}/active-item/update-item`, {
                nftAddress: updateAsset.nftAddress,
                tokenId: updateAsset.tokenId,
                price: updateAssetPrice ? parseFloat(updateAssetPrice) : updateAsset.price,
                tokenUri: tokenUri
              })
                .then(res => {
                  const data = res.data;
                  if (data.success && !data.err) {
                    dispatch({  type: "success",  message: "Bağış ürünü başarıyla güncellendi",  title: "İşlem tamamlandı",  position: "topR"});
                    updateUI();
                  } else if (!data.success && data.err) {
                    if (data.err == "cannot_found") return  dispatch({  type: "warning",  message: "Ürün bulunamadı",  title: "Tamamlanmayan işlem",  position: "topR"});
                    else return dispatch({  type: "warning",  message: "Ürün güncellemesi başarısız.",  title: "Tamamlanmayan işlem",  position: "topR"});
                  }
                })
            })
      } else {

        //  carry on with the current tokenUri, only update the price

        axios.post(`${URL}:${PORT}/active-item/update-item`, {
          nftAddress: asset.nftAddress,
          tokenId: asset.tokenId,
          price: updateAssetPrice,
          tokenUri: asset.tokenUri
        })
          .then(res => {
            const data = res.data;
            if (data.success && !data.err) {
              dispatch({  type: "success",  message: "Bağış ürünü başarıyla güncellendi",  title: "İşlem tamamlandı",  position: "topR"});
              updateUI();
            } else if (!data.success && data.err) {
              dispatch({  type: "warning",  message: "Bağış ürünü güncellenmedi",  title: "Tamamlanmayan işlem",  position: "topR"});
            }
          })
      }
    }
  }

  const showUpdateModal = (asset) => {
    setUpdateAsset(asset);

    let tempAttributesString = "";
    for (let i = 0; i < asset.attributes.length; i++) {
      const eachAttribute = asset.attributes[i];
      tempAttributesString += (`${eachAttribute.trait_type}:${eachAttribute.value},`);
    }

    setUpdateAssetInitialProperties(tempAttributesString);
    setUpdateAssetProperties(tempAttributesString);
    
    setIsUpdateModalOpen(true);
  }

  const hideUpdateModal = () => {
    setUpdateAsset({});
    setUpdateAssetInitialProperties("");
    setUpdateAssetProperties("");
    setIsUpdateModalOpen(false);
  }

  
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateAsset, setDonateAsset] = useState({});

  const [donateAssetDonorEmail, setDonateAssetDonorEmail] = useState("");
  const [donateAssetIsApprovalChecked, setDonateAssetIsApprovalChecked] = useState(false);

  const showDonateModal = (asset) => {
    setIsDonateModalOpen(true);
    setDonateAsset(asset);
  }
  
  const hideDonateModal = () => {
    setIsDonateModalOpen(false);
    setDonateAsset({});
  } 

  const handleDonateAsset = () => {
    if (donateAssetIsApprovalChecked && donateAssetDonorEmail && donateAsset.nftAddress && donateAsset.tokenId.toString()) {
      axios.post(`${URL}:${PORT}/donate/payment/already_bought`, {
        nftAddress: donateAsset.nftAddress,
        tokenId: donateAsset.tokenId,
        phone_number: donateAssetDonorEmail
      })
        .then(res => {
          if (res.data.success && !res.data.err) {
            dispatch({  type: "success",  message: "Manuel bağış başarıyla kaydedildi",  title: "İşlem tamamlandı",  position: "topR"});
            updateUI();
          } else if (!res.data.success && res.data.err) {
            dispatch({  type: "warning",  message: "Manuel bağış girdisi kaydedilemedi",  title: "Tamamlanmayan işlem",  position: "topR"});
          }
        })
    } else {
      dispatch({  type: "warning",  message: "Manuel bağış girdisi kaydedilemedi",  title: "Tamamlanmayan işlem",  position: "topR"});
    }
  }


  return (
    <div className='w-screen h-fit py-8 px-12 bg-slate-50 scroll-smooth'>
        {
          isLabelModalOpen
            ? (<Modal title={"Etiketlerinizi görüntüleyin, indirin ve yazdırın"} okText='İleri' cancelText='geri' isCancelDisabled={true} width='100%' onCancel={() => hideLabelModal()}  onOk={() => hideLabelModal()} onCloseButtonPressed={() => hideLabelModal()}>

              <div className='w-full flex flex-wrap'>
                {
                   qrCodesArray
                    ? qrCodesArray.map(eachQrData => {
                      if (eachQrData) return (
                        <div className='relative w-1/2'>
                        <div className='w-full p-4 py-12 relative z-0' id={`${generalQrCodeData.tokenId}-[${eachQrData}]`}>
                        <div className='flex'>
                        <div className='w-1/4'>
                          <div className='w-full aspect-square relative flex justify-center items-center'>
                            <QRCode logoImage='/qrlogo.png' className='w-full h-full' value={`${generalQrCodeData.tokenId}-[${eachQrData}]`} />
                          </div>
                          <div className='w-full flex items-center flex-col'>
                            <div className='text-xs'>bağış bilgisi</div>
                            <div className='-mt-1 text-xs font-bold'>{`${generalQrCodeData.tokenId}-[${eachQrData}]`}</div>
                          </div>
                          <div className='flex w-full h-24'><QrCode className='w-1/2 aspect-square h-full mr-4' value={`${generalQrCodeData.tokenId}-[${eachQrData}]`} /><QrCode className='w-1/2 aspect-square h-full' value={`${generalQrCodeData.tokenId}-[${eachQrData}]`} /></div>
                        </div>
                        <div className="w-3/4 ml-4 h-fit">
                          <div className='border border-black'>
                            <div className='w-full h-4 bg-black'></div>
                            <div className='pb-4 border-b border-black h-fit text-sm'>Kampanya ismi: <strong>{generalQrCodeData.campaignName || "empty"}</strong></div>
                            <div className='pb-4 border-b border-black h-fit text-sm'>Ürüm ismi: <strong>{generalQrCodeData.assetName || "empty"}</strong></div>
                            <div className='flex border-b border-black'>
                              <div className='border-r border-black p-2 text-sm'>
                                <div className='text-xs'>Üretim lokasyonu</div>
                                <div className='font-bold'>{generalQrCodeData.stampLocation.latitude || ""}, {generalQrCodeData.stampLocation.longitude || ""}</div>
                              </div>
                              <div className='border-r border-black p-2 text-sm'>
                                <div className='text-xs'>Depo lokasyonu</div>
                                <div className='font-bold'>{generalQrCodeData.shipLocation.latitude || ""}, {generalQrCodeData.shipLocation.longitude || ""}</div>
                              </div>
                              <div className='p-2 text-sm'>
                                <div className='text-xs'>Teslim lokasyonu</div>
                                <div className='font-bold'>{generalQrCodeData.deliverLocation.latitude || ""}, {generalQrCodeData.deliverLocation.longitude || ""}</div>
                              </div>
                            </div>
                            <div>
                              <div className='border-b border-black pb-2'>
                                <div className='text-xs'>{"Pazaryeri  adresi"}</div>
                                <div className='text-xs font-bold'>{generalQrCodeData.marketplaceAddress}</div>
                              </div>
                              <div className='border-b border-black pb-2'>
                                <div className='text-xs'>{"Ana  koleksiyon  adresi"}</div>
                                <div className='text-xs font-bold'>{generalQrCodeData.nftAddress}</div>
                              </div>
                              <div className='pb-2'>
                                <div className='text-xs'>{"LR  Lens  adresi"}</div>
                                <div className='text-xs font-bold'>{generalQrCodeData.ledgeriseLensAddress}</div>
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center'>
                            <div className='ml-auto mr-4 text-white bg-black w-fit font-bold px-2 mt-4 mb-4 pb-4 h-8'>BAĞIŞ ÜRÜNÜDÜR</div>
                            <div className='h-12 w-fit'>
                              <img className='w-full h-full' src="/labellogo.png" alt="labellogo" />
                            </div>
                          </div>
                        </div>
                        </div>
                        </div>
                        <div 
                          onClick={(e) => {
                            handleDownloadPDF(e.target.previousSibling.id, e.target.previousSibling.id.toString());
                            axios.post(`${URL}:${PORT}/active-item/mark-qr-code-as-printed`, {
                              nftAddress: generalQrCodeData.nftAddress,
                              tokenId: generalQrCodeData.tokenId,
                              openseaTokenIdArray: eachQrData
                            }, (res) => {
                              if (res.data.success) return window.location.reload();
                              else alert("error");
                            })
                          }}
                          style={{ transition: "all 0.25s ease" }} className='z-100 absolute left-1/2 top-1/2 py-2 px-4 text-slate-100 cursor-pointer bg-opacity-40 bg-slate-950 hover:bg-opacity-70'>Yazdırın</div>

                          {
                            eachQrData && generalQrCodeData.openseaTokenIdToIsPrintedMapping[typeof eachQrData == "number" ? eachQrData : eachQrData[0]]
                              ? <div className='w-12 h-12 bg-green-600 absolute right-0 top-4 rounded-full flex justify-center items-center text-slate-50 text-xl'>✓</div>
                              : ("")
                          }
                        </div>
                      )
                    })
                    : ("")
                }
              </div> 
            
            </Modal>)
            : isCreateActiveItemModalOpen
              ? (<Modal title={"Bir bağış ürünü oluşturun"} okText='İleri' cancelText='geri' isCancelDisabled={true} width='100%' onCancel={() => hideCreateAssetModal()}  onOk={() => hideCreateAssetModal()} onCloseButtonPressed={() => hideCreateAssetModal()}>
                <div className='mb-12 w-full h-fit bg-white'>
                  <div className='w-full h-fit flex flex-col justify-center'>
                    <div className='text-gray-600 border-b w-full px-12'>ÖNİZLEME</div>
                    <div className='w-full flex h-fit my-4 justify-center relative items-center'>
                      <div className='h-full w-1/5 bg-white z-10'>
                        <NFTCardPreview
                          price={""}
                          charityAddress={company.charityAddress}
                          companyName={company.name}
                          availableEditions={""}
                          tokenDescription={""}
                          tokenName={""}
                          tokenImage={""}
                        />
                      </div>
                      <div className='h-full w-1/5 mx-8 bg-white z-10'>
                        <NFTCardPreview
                          price={createAssetPrice}
                          charityAddress={company.charityAddress}
                          companyName={company.name}
                          availableEditions={createAssetAvailableEditions}
                          tokenDescription={createAssetDescription}
                          tokenName={createAssetName}
                          tokenImage={selectedImage}
                        />
                      </div>
                      <div className='w-72 h-4/5 bg-yellow-200 bg-opacity-70 rounded-full blur-xl absolute z-0'></div>
                      <div className='h-full w-1/5 bg-white z-10'>
                        <NFTCardPreview
                          price={""}
                          charityAddress={company.charityAddress}
                          companyName={company.name}
                          availableEditions={""}
                          tokenDescription={""}
                          tokenName={""}
                          tokenImage={""}
                        />
                      </div>
                      <div className='h-full w-1/4 bg-white absolute right-0 z-20 border-l-8 border-l-gray-200 border-opacity-40'></div>
                      <div className='h-full w-1/4 bg-white absolute left-0 z-20 border-r-8 border-r-gray-200 border-opacity-40'></div>
                    </div>
                  </div>
                  <div className='border-t'>Bağış ürünü oluşturun</div>
                  <div className='w-full flex'>
                    <div className='w-1/2 mr-2'>
                      <input className='w-full p-2 border mb-2' type="text" placeholder='Ürün ismi' onChange={(e) => setCreateAssetName(e.target.value)}/>
                      <input className='w-full p-2 border mb-2' type="number" placeholder='Bağış ürününden kaç adet üretilecek' onChange={(e) => {setCreateAssetAvailableEditions(e.target.value)}}/>
                      <div className='w-full relative'>
                        <input className='w-full p-2 border mb-2' type="number" placeholder='Bir ürün için gereken toplam bağış' onChange={(e) => setCreateAssetPrice(e.target.value)}/>
                        <div className='h-fit p-2 flex justify-center items-center px-12 border absolute right-0 top-0 bg-white'>TL</div>
                      </div>
                    </div>
                    <div className='w-1/2'>
                      <div className='w-full relative'>
                        <input className='w-full p-1 px-2 border mb-2' type="file" onChange={handleImageChange}/>
                        <div className='h-fit p-2 flex justify-center items-center px-12 border absolute right-0 top-0 bg-white'>Ürün fotoğrafı</div>
                      </div>                      
                      <div className='flex w-full items-center'>
                        <input className='w-1/2 border p-2' type="text" placeholder='içerik ismi'/>
                        <input className='w-1/4 border p-2' type="number" placeholder='adet' />
                        <div onClick={(e) => {
                          if (!createAssetProperties.includes(e.target.previousSibling.previousSibling.value)) {
                            const tempCreateAssetProperties = createAssetProperties.concat(`${e.target.previousSibling.previousSibling.value}:${e.target.previousSibling.value},`)
                            setCreateAssetProperties(tempCreateAssetProperties);
                          }
                        }} className='w-1/6 mx-4 rounded-lg flex justify-center border p-2 bg-blue-600 text-slate-100'>ekle</div>
                      </div>
                      <div className='flex overflow-x-auto mb-2'>
                        {
                          createAssetProperties
                            ? createAssetProperties.split(",").map(eachProperty => {
                              if (eachProperty.length > 0) {
                                return(
                                  <div className='bg-blue-500 bg-opacity-20 p-2 flex mr-4'>
                                    <div>{eachProperty}</div> 
                                    <div onClick={(e) => {
                                      const tempCreateAssetProperties = createAssetProperties.replace(`${e.target.previousSibling.innerHTML},`, "");
                                      setCreateAssetProperties(tempCreateAssetProperties)
                                    }} className='cursor-pointer ml-2 w-6 h-6 rounded-full text-slate-50 bg-red-500 bg-opacity-50 flex items-center justify-center'>x</div>
                                  </div>
                                )
                              }                            
                            })
                            : ("")
                        }
                      </div>
                    </div>
                  </div>
                  <textarea className='w-full p-2 border' type="text" placeholder='Ürünün açıklamasını yazınız' onChange={(e) => {setCreateAssetDescription(e.target.value)}} />
                  <div>
                    <div className='w-full flex'>
                      <div className={`p-4 cursor-pointer bg-slate-500 ${currentSelectingEvent == "stamp" ? "text-green-500" : "text-slate-50"}`} onClick={() => setCurrectSelectingEvent("stamp")}>Üretim Yeri</div>
                      <div className={`p-4 cursor-pointer bg-slate-500 ${currentSelectingEvent == "shipped" ? "text-green-500" : "text-slate-50"}`} onClick={() => setCurrectSelectingEvent("shipped")}>Dağıtım Merkezi (ara depo)</div>
                      <div className={`p-4 cursor-pointer bg-slate-500 ${currentSelectingEvent == "delivered" ? "text-green-500" : "text-slate-50"}`} onClick={() => setCurrectSelectingEvent("delivered")}>Teslimat yeri</div>
                    </div>
                    <div className='h-96 w-full'>
                      <Map
                        stampCoordinates={tempStampLocation}
                        shippedCoordinates={tempShippedLocation}
                        deliveredCoordinates={tempDeliveredLocation}
                        zoom={10}
                        currentSelectingEvent={currentSelectingEvent}
                        onUpdate={(coordiantesArray) => {
                          setTempStampLocation(coordiantesArray[0])
                          setTempShippedLocation(coordiantesArray[1])
                          setTempDeliveredLocation(coordiantesArray[2])
                        }}
                      />
                    </div>
                  </div>
                  <div className='py-2 px-8 uppercase font-semibold bg-blue-700 bg-opacity-90 w-fit text-slate-50 mt-8 cursor-pointer' onClick={() => {
                    if (createAssetAvailableEditions != "" && createAssetDescription != "" && createAssetName != "" && createAssetPrice != "" && createAssetProperties != "" && tempDeliveredLocation != "" && tempStampLocation != "" && tempShippedLocation != "") {
                      handleActiveItemCreate();
                    } else {
                      dispatch({
                        type: "error",
                        message: "Lütfen gerekli tüm bilgileri doldurunuz",
                        title: "Tamamlanmayan işlem",
                        position: "topR"
                      });
                    }
                  }}>Bağış ürünü oluştur</div>
                </div>
              </Modal>)
              : isCampaignModalOpen
                  ? (
                    <Modal title={"Bağış ürününü güncelleyin"} okText='İleri' cancelText='geri' isCancelDisabled={true} width='100%' onCancel={() => hideCampaignModal()}  onOk={() => hideCampaignModal()} onCloseButtonPressed={() => hideCampaignModal()}>
                      <div className='flex'>
                        <div className='w-1/2 pr-12'>
                          <div className='mb-4'>Kampanyanızı tasarlayın</div>
                          <input className='p-2 mb-4 w-full bg-slate-50 border rounded' type="text" placeholder='Kampanyanıza bir isim verin' onChange={(e) => {setCreateCampaignName(e.target.value)}} />
                          <input className='p-2 mb-4 w-full bg-slate-50 border rounded' type="text" placeholder='Kampanyanıza bir açıklama yazın' onChange={(e) => {setCreateCampaignDescription(e.target.value)}} />

                          <div className='relative w-full'>
                            <input className='w-full p-1 px-2 border mb-2' type="file" onChange={handleImageChange}/>
                            <div className='h-fit p-2 flex justify-center items-center px-12 border absolute right-0 top-0 bg-white'>Kampanya fotoğrafı</div>
                          </div>  
                        </div>
                        <div className='w-2 h-full bg-slate-900'></div>
                        <div className='w-1/2 mb-12'>
                          <div>Önizleme</div>
                          <hr />
                          <div className='w-full h-fit px-24 my-2'>
                            <div className='w-full h-full border p-4 relative'>
                              <div className='h-36 border mb-4 flex justify-center items-center bg-[linear-gradient(0deg,rgba(255,100,0,0.50)_0%,rgba(20,50,150,0.50)_75%)]'>
                                {
                                  selectedImage
                                    ? <img className='h-full rounded-md' src={`${selectedImage}`} alt="Önizleme fotoğraf" />
                                    : ("")
                                }
                              </div>
                              <div className='w-full uppercase text-xl text-gray-800'>{createCampaignName || "KAMPANYA ÖNİZLEME"}</div>
                              <div className='w-full text-wrap text-gray-700'>{createCampaignDescription || "Bu kampanyada ihtiyaç sahiplerine güvenle ulaşabilirsiniz"}</div>
                              <div className='w-1/2 p-2 my-4 rounded-md text-gray-200 bg-gray-700 font-bold'>3 <span className='text-sm font-normal text-gray-400'>bağış kolisi</span></div>
                              <div className='text-sm'><span className='font-semibold uppercase'>Tema vakfı</span> kampanyasıdır</div>
                              {
                                createCampaignName.length > 0 && createCampaignDescription.length > 0 && selectedImage
                                  ? (
                                    <div className='bg-white w-full mt-4 flex justify-center h-12 absolute'>
                                      <div onClick={() => handleSubcollectionCreate()} className='cursor-pointer w-72 h-full uppercase font-semibold flex items-center justify-center text-slate-50 border-neutral-700 rounded-md border-opacity-55 border bg-blue-700 bg-opacity-50 hover:bg-opacity-90 transition-all'>Yayınla</div>
                                    </div>
                                  )
                                  : ("")
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>
                  )
                  : isUpdateModalOpen
                    ? <Modal title={"Bağış ürününü güncelleyin"} okText='İleri' cancelText='geri' isCancelDisabled={true} width='100%' onCancel={() => hideUpdateModal()}  onOk={() => hideUpdateModal()} onCloseButtonPressed={() => hideUpdateModal()}>
                        <div className='w-full h-full flex'>
                        <div className='w-1/2'>
                          <div className='w-full mb-4'>
                            <input className='p-2 bg-slate-50 w-full' type="text" placeholder='Bağış ürünü açıklaması' onChange={(e) => {setUpdateAssetDescription(e.target.value)}} />
                          </div>
                          <div className='w-full relative mb-4'>
                            <input className='w-full p-2 px-2 border mb-2 bg-slate-50' type="file" onChange={handleImageChange}/>
                            <div className='h-fit p-2 flex justify-center items-center px-12 border absolute right-0 top-0 bg-white'>Ürün fotoğrafı</div>
                          </div>  
                          <div>
                              <div className='flex w-full items-center'>
                        <input className='w-1/2 border p-2' type="text" placeholder='içerik ismi'/>
                        <input className='w-1/4 border p-2' type="number" placeholder='adet' />
                        <div onClick={(e) => {
                          if (!updateAssetProperties.includes(e.target.previousSibling.previousSibling.value)) {
                            const tempCreateAssetProperties = updateAssetProperties.concat(`${e.target.previousSibling.previousSibling.value}:${e.target.previousSibling.value},`)
                            setUpdateAssetProperties(tempCreateAssetProperties);
                          }
                        }} className='w-1/6 mx-4 rounded-lg flex justify-center border p-2 bg-blue-600 text-slate-100'>ekle</div>
                      </div>
                      <div className='flex overflow-x-auto mb-2'>
                        {
                          updateAssetProperties
                            ? updateAssetProperties.split(",").map(eachProperty => {
                              if (eachProperty.length > 0) {
                                return(
                                  <div className='bg-blue-500 bg-opacity-20 p-2 flex mr-4'>
                                    <div>{eachProperty}</div> 
                                    <div onClick={(e) => {
                                      const tempCreateAssetProperties = updateAssetProperties.replace(`${e.target.previousSibling.innerHTML},`, "");
                                      setUpdateAssetProperties(tempCreateAssetProperties)
                                    }} className='cursor-pointer ml-2 w-6 h-6 rounded-full text-slate-50 bg-red-500 bg-opacity-50 flex items-center justify-center'>x</div>
                                  </div>
                                )
                              }                            
                            })
                            : ("")
                        }
                      </div>
                            </div>
                              <div className='w-full mt-4'>
                                <input className='p-2 bg-slate-50 w-full' type="number" placeholder='Bağış ürünü yeni fiyatı' onChange={(e) => {setUpdateAssetPrice(e.target.value)}} />
                              </div>
                              <div onClick={() => handleUpdateAsset()} className='p-2 px-12 flex justify-center items-center w-1/3 mt-4 cursor-pointer bg-blue-500 text-slate-100 rounded bg-opacity-90 hover:bg-blue-600 transition-all'>
                                Kaydet
                              </div>
                            </div>
                            <div className='w-1/2 h-fit flex flex-col items-center ml-4'>
                              <div className='uppercase font-semibold text-gray-600 border-b mb-2 w-full px-12'>ÖNİZLEME</div>
                              <div className='w-1/2 h-full border'>
                                <NFTSlateBox 
                                  tokenUri={updateAsset.tokenUri}
                                  price={updateAsset.price}
                                  availableEditions={updateAsset.availableEditions}
                                  editTokenDescription={updateAssetDescription}
                                  editTokenImage={selectedImage}
                                  editTokenPrice={updateAssetPrice}
                                  editTokenName={""}
                                />
                              </div>
                            </div>
                        </div>
                      </Modal>
                    : isDonateModalOpen
                        ? (
                          <Modal title={"Manuel bağış ekleyin"} okText='İleri' cancelText='geri' isCancelDisabled={true} width='50%' onCancel={() => hideDonateModal()}  onOk={() => hideDonateModal()} onCloseButtonPressed={() => hideDonateModal()}>
                            {
                              donateAsset
                                ? <div className='w-full'>
                                <div className='mb-4'>
                                  <Input
                                    onChange={(e) => {setDonateAssetDonorEmail(e.target.value)}}
                                    width='full'
                                    label="Bağışçı e-posta adresi"
                                    placeholder="hello@ledgerise.org"
                                    type="email"
                                    validation={{
                                      maxLength: 48,
                                      minLength: 1,
                                      pattern: '^[^@s]+@[^@s]+.[^@s]+$',
                                      regExpInvalidMessage: 'That is not a valid email address',
                                      required: true
                                    }}
                                  />
                                </div>
                                <div>
                                  <Checkbox
                                    id={`${donateAsset.nftAddress}-${donateAsset.tokenId}`}
                                    label={<div className='text-sm'>{`Yukarıda e-posta adresini belirttiğim bağışçının ${donateAsset.price} TL değerindeki ${donateAsset.name} ürününü ayni veya nakdi surette bağışladığını onaylıyorum.`}</div>}
                                    name={`${donateAsset.nftAddress}-${donateAsset.tokenId}-checkbox`}
                                    onChange={(e) => {setDonateAssetIsApprovalChecked(e.target.value.toString() == "false")}}
                                  />
                                </div>
                                <div className='px-4 flex justify-center items-center bg-blue-500 w-fit text-slate-50 font-semibold py-2 rounded-lg my-4 cursor-pointer' onClick={() => { handleDonateAsset() }}>
                                  Bağışı kaydet
                                </div>
                              </div>
                                : ("")
                            }
                          </Modal>
                        )
                        : ("")
        }
        <div className='w-full h-full scroll-smooth'>
          <div className='flex w-full'>
            <div className='w-3/4 h-80 border pb-4 bg-white rounded-xl overflow-hidden mr-4'>
              <div className='w-full h-24 bg-[linear-gradient(0deg,rgba(255,100,0,0.2)_0%,rgba(20,50,150,0.2)_75%)]'></div>
              <div className='flex w-full px-24 mb-8'>
                <div className='h-32 aspect-square shadow-md mr-4 -mt-12'>
                  <img className='w-full h-full' src={company.image} alt={company.name} />
                </div>
                <div>
                  <div className='text-slate-600 uppercase text-4xl font-semibold'>{company.name}</div>
                  <div className='text-sm text-slate-500 -mt-2'>{company.code}</div>
                  <div className='text-sm text-slate-600'>{company.receipientName} • {(company.charityAddress || "")} • {company.IBAN} </div>
                </div>
              </div>
              <div className='w-full flex justify-end text-gray-700 px-4'>
                <div className='font-semibold mx-2'>{statistics.collectionCount}</div> bağış kampanyası
                <div className='font-semibold mx-2'>• {statistics.donationCount}</div> bağışçı
                <div className='font-semibold mx-2'>• {statistics.activeItemsCount}</div> bağış ürünü
                <div className='font-semibold mx-2'>• {statistics.verificationCount}</div> gönderi
              </div>
            </div>
            <div className='w-1/4 bg-white rounded-xl border p-4 h-80 overflow-y-auto'>
              <div className='text-sm uppercase font-semibold text-gray-600 border-b mb-4'>Kampanyalar</div>
              {
                collections && collections.length
                  ? collections.map(collection => {
                    return (
                        <div 
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(`${collection.nftAddress}-${collection.subcollectionId}`).scrollIntoView({ behavior: "smooth" });
                        }} className='flex w-full items-center mb-2 border-b pb-1 cursor-pointer'>
                          <div className='mr-4'><img className="w-3" src="right-arrow.png" alt="right-arrow" /></div>
                          <div className='text-sm'>
                            <div className='font-semibold text-gray-800 hover:text-gray-500 transition-all'>{collection.name}</div>
                            <div className='text-xs text-gray-500'>{prettyAddress(collection.nftAddress)}-{collection.subcollectionId}</div>
                          </div>
                        </div>
                    )
                  })
                  : ("")
              }
              <div className='flex w-full items-center'>
                <div className='mr-4'><img className="w-3" src="right-arrow.png" alt="right-arrow" /></div>
                <div className='w-3/5 bg-gray-100 h-8 mr-4'></div>
                <div className='w-8 flex justify-center items-center text-slate-100 bg-opacity-90 hover:bg-opacity-100 transition-all cursor-pointer rounded-full aspect-square bg-green-500 mr-4' onClick={() => {showCreateCampaignModal()}}>+</div>
              </div>
            </div>
          </div>
        <div className='w-full h-full'>
          <div className='uppercase font-semibold text-lg text-gray-600 mb-4'>Kampanyalarım</div>
          <div className='bg-white rounded-lg'>
            {
              collections && collections.length > 0
              ? collections.map(collection => {
                return (
                  <div className='w-full rounded shadow-md mb-4 p-4' id={`${collection.nftAddress}-${collection.subcollectionId}`}>
                    <div>
                      <div className='font-semibold text-gray-700'>{collection.name} <span className='text-gray-500 font-normal text-sm'># {collection.subcollectionId}</span></div>
                      <div className='text-xs -mt-1 text-gray-600'>{collection.assets.length} bağış ürünü</div>
                    </div>
                    <hr className='my-2' />
                    <div className='h-full flex flex-wrap'>
                      {
                        collection.assets
                          ? collection.assets.map(asset => {
                            return (
                              <div className='w-72 mr-4 relative'>
                                <NFTBoxCompany
                                  price={asset.price}
                                  tokenUri={asset.tokenUri}
                                  availableEditions={asset.availableEditions}
                                  handleViewLabelsClick={() => {
                                    setQrCodesArray(asset.qrCodesArray);

                                    const generalQrCodeData = {
                                      tokenId: asset.tokenId,
                                      campaignName: collection.name,
                                      assetName: asset.name,
                                      nftAddress: collection.nftAddress,
                                      marketplaceAddress: collection.marketplaceAddress,
                                      ledgeriseLensAddress: collection.ledgeriseLensAddress,
                                      stampLocation: asset.stampLocation,
                                      shipLocation: asset.shipLocation,
                                      deliverLocation: asset.deliverLocation,
                                      openseaTokenIdToIsPrintedMapping: asset.openseaTokenIdToIsPrintedMapping
                                    };

                                    setGeneralQrCodeData(generalQrCodeData);

                                    showLabelModal();
                                  }}
                                  handleCancelItem={() => { handleCancelAsset(collection.nftAddress, asset.tokenId) }}
                                  handleUpdateItem={() => { showUpdateModal(asset) }}
                                  handleDonateItemClick={() => { showDonateModal(asset) }}
                                />
                                {
                                  asset.isCanceled
                                    ? <div className='w-full h-full absolute bg-red-200 bg-opacity-75 left-0 top-0 flex justify-center items-center text-gray-700'>
                                      Bağış ürünü iptal edilmiştir
                                    </div>
                                    : ("")
                                }
                              </div>
                            )
                          })
                          : ("")
                      }
                      <div className='flex flex-col items-center justify-center w-72 border-2 border-dashed py-auto'>
                        <div onClick={() => {
                          setAddActiveItemCollectionObject({
                            nftAddress: collection.nftAddress,
                            subcollectionId: collection.subcollectionId
                          })
                          showCreateAssetModal();
                        }} className='bg-green-600 bg-opacity-80 hover:bg-opacity-90 cursor-pointer transition-all text-slate-50 w-8 h-8 text-xl flex justify-center rounded-full'>+</div>
                        <div>Bağış ürünü ekleyin</div>
                      </div>
                    </div>
                  </div>
                )
              })
              : (
                <div className='w-full h-24 text-slate-900 flex items-center justify-center'>
                  <Loading spinnerColor='navy' />
                </div>
              )
            }
            <div className='w-full mt-4 h-24 border border-dashed flex justify-center items-center'>
              <div onClick={() => {
                  showCreateCampaignModal();
                }} className='bg-green-600 mr-4 bg-opacity-80 hover:bg-opacity-90 cursor-pointer transition-all text-slate-50 w-8 h-8 text-xl flex justify-center items-baseline rounded-full'>+</div>
              <div>Bir kampanya başlatın</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

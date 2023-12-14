
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { useRouter } from 'next/router';
import { ethers } from "ethers";
import { getEthToUsdRate } from '@/utils/getEthToUsdRate';

export default function Home() {

  const router = useRouter();
  const id = router.query.id;

  const [donor, setDonor] = useState({});
  const [history, setHistory] = useState({
    price: 0
  });

  const downloadAsPDF = async (divId, fileName) => {
    const div = document.getElementById(divId);

    const canvas = await html2canvas(div);

    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', pdf.internal.pageSize.getWidth() * 0.25 * -1, 0, pdf.internal.pageSize.getWidth() * 1.5, pdf.internal.pageSize.getHeight());

    pdf.save(fileName);
  };

  const handleDownloadPDF = () => {
    downloadAsPDF('main', 'UAAOAB Bağış Alındı Makbuzu.pdf');
  };

  const getNumberAsWord = (number) => {

    if (number.includes(".")) {
      number = number.split(".")[0];
    }

    const numberLength = number.length;
    let zeroCluster = "";
    for (let j = 0; j < (4 - numberLength); j++) {
      zeroCluster += "0";
    }

    number = `${zeroCluster}${number}`;

    const step0 = ["", "BİN", "İKİBİN", "ÜÇBİN", "DÖRTBİN", "BEŞBİN", "ALTI BİN", "YEDİ BİN", "SEKİZ BİN", "DOKUZ BİN"];
    const step1 = ["", "YÜZ", "İKİYÜZ", "ÜÇYÜZ", "DÖRTYÜZ", "BEŞYÜZ", "ALTIYÜZ", "YEDİYÜZ", "SEKİZYÜZ", "DOKUZYÜZ"];
    const step2 = ["", "ON", "YİRMİ", "OTUZ", "KIRK", "ELLİ", "ALTMİŞ", "YETMİŞ", "SEKSEN", "DOKSAN"];
    const step3 = ["", "BİR", "İKİ", "ÜÇ", "DÖRT", "BEŞ", "ALTI", "YEDİ", "SEKİZ", "DOKUZ"];

    let numString = "";

    for (let i = 0; i < number.toString().length; i++) {
      const element = number.toString()[i];
      numString += eval(`step${i}`)[parseInt(element)];
    }

    numString = numString.toUpperCase();

    return numString;
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

  const [ethToUsdRate, setEthToUsdRate] = useState(null);

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      const rate = await getEthToUsdRate();
      setEthToUsdRate(rate);
    };

    fetchEthToUsdRate();
  }, []);

  const [tokenId, setTokenId] = useState(0);


  useEffect(() => {

    if (id) {
      const tokenId = id.split("-")[0];
      const openseaTokenId = id.split("-")[1];

      setTokenId(tokenId)

      const _id = localStorage.getItem("_id");

      axios.post(`http://localhost:4000/auth/authenticate`, {
        _id: _id
      })
        .then((res) => {
          const data = res.data;
          if (data.success && data.donor) {
            setDonor(data.donor);
            axios.post(`http://localhost:4000/donor/get-receipt-data`, {
              buyer: donor.school_number,
              tokenId: tokenId,
              openseaTokenId: openseaTokenId
            })
              .then(dataRes => {
                console.log(dataRes.data.history);
                const dataResdata = dataRes.data;
                if (dataResdata.success) return setHistory(dataResdata.history)
              })
          }
        })
    }
  }, [id, ethToUsdRate])



  return (
    <div>
      <div className='w-2/3 cursor-pointer m-auto my-2 flex justify-between items-center' onClick={() => { handleDownloadPDF() }}>
        <div>NAKDÎ BAĞIŞ MAKBUZU</div>
        <div className='bg-slate-900 text-slate-50 p-2 rounded-lg'>Download ↓</div>
      </div>
      <div id="main">
        <div className='w-screen h-full flex flex-col items-center justify-center font-serif'>
          <div className='w-2/3 border-2 p-12'>
            <div className='flex justify-end'>EK-1</div>
            <div>
              <div className='flex justify-center'>OKUL-AİLE BİRLİĞİ AYNİ/ NAKDÎ BAĞIŞ ALINDI BELGESİ</div>
              <div className='flex flex-col border border-black p-1'>
                <div className='flex border'>
                  <div className='flex flex-col w-3/4 border'>
                    <div className='p-1 border border-black'>Birliğin</div>
                    <div className='p-1 border border-black'>Adı    : <strong className='uppercase'>Üsküdar Amerikan Lisesi Okul Aile Birliği</strong></div>
                    <div className='p-1 border border-black h-24'>Adresi    : <strong>Selamiali, Vakıf Sk. No:1, 34664 Üsküdar/İstanbul</strong></div>
                  </div>
                  <div className='flex flex-col w-1/4 border border-black p-1'>
                    <div className='mb-2 h-1/4'>Seri No : <strong className='uppercase'>LR-{history.subcollectionId}</strong></div>
                    <div className='mb-2 h-1/4'>Cilt No : <strong className='uppercase'>LR-{tokenId}</strong></div>
                    <div>Sıra No : <strong className='uppercase'>LR-{history.openseaTokenId}</strong></div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className='w-1/3 border border-black p-2'>Telefon No: <strong>0(212) 412 44 22</strong></div>
                  <div className='w-1/3 border border-black p-2'>Faks No: <strong>0(212) 412 44 44</strong></div>
                  <div className='w-1/3 border border-black p-2'>e-posta Adresi: <strong>okulailebirligi@my.uaa.k12.tr</strong></div>
                </div>
              </div>
            </div>
            <div className='mt-16'>
              <div className='flex justify-center'>NAKDÎ BAĞIŞLAR</div>
              <div className='flex flex-col'>
                <div className='flex justify-between'>
                  <div className='border border-black w-16 p-1 flex justify-center items-center'>Sıra No</div>
                  <div className='border-t border-black w-2/3 p-1 flex justify-center items-center'>Bağışın Cinsi (TL/Döviz )</div>
                  <div className='border border-black w-1/3 p-1 flex justify-center items-center'>Tutar</div>
                </div>
                <div className='flex justify-between'>
                  <div className='border-x border-black w-16 p-1 flex justify-center items-center'><strong>1</strong></div>
                  <div className='border-t border-black w-2/3 p-1 flex justify-center items-center h-10'><strong>TÜRK LİRASI</strong></div>
                  <div className='border-x border-black w-1/3 p-1 flex justify-center items-center font-bold'>{((history.price / 1e18) * ethToUsdRate).toFixed(2)}</div>
                </div>
                <div className='flex justify-between'>
                  <div className='border-x border-t border-black w-16 p-1 flex justify-center items-center'></div>
                  <div className='border-t border-black w-2/3 p-1 flex justify-center items-center h-10'></div>
                  <div className='border-x border-t border-black w-1/3 p-1 flex justify-center items-center'></div>
                </div>
                <div className='flex justify-between'>
                  <div className='border border-black w-16 p-1 flex justify-center items-center'></div>
                  <div className='border-y border-black w-2/3 p-1 flex justify-center items-center h-10'></div>
                  <div className='border border-black w-1/3 p-1 flex justify-center items-center'></div>
                </div>
                <div className='flex justify-between'>
                  <div className='w-16 border-l border-b border-black p-1 flex justify-center items-center h-8'></div>
                  <div className='border-b border-black w-2/3 p-1 flex justify-center items-center text-sm'>Toplam</div>
                  <div className='border-b border-x border-black w-1/3 p-1 flex justify-center items-center'></div>
                </div>
                <div className='flex justify-center mt-4'>
                  <div>Yalnız ............................................................................................. TL/Döviz tahsil edilmiştir.</div>
                  <div className='absolute font-bold -ml-36'>{getNumberAsWord(((history.price / 1e18) * ethToUsdRate).toFixed(2))}</div>
                </div>
              </div>
              <div>
                <div className='mt-12'>Yukarıda belirtilen ayni/nakdî bağışı teslim aldım.</div>
                <div className='flex justify-between'>
                  <div className='flex flex-col w-5/12'>
                    <div className='border border-black flex justify-center p-2'>Teslim Eden</div>
                    <div className='flex'>
                      <div className='border-x border-black flex justify-center p-2 w-5/12'>Adı Soyadı</div>
                      <div className='border-r border-black flex justify-center p-2 w-full font-bold uppercase'>{donor.name} {donor.surname}</div>
                    </div>
                    <div className='flex'>
                      <div className='border border-black flex justify-center p-2 w-5/12'>T.C. Kimlik No</div>
                      <div className='border-y border-r border-black flex justify-center p-2 w-full font-bold uppercase'>{donor.national_identification_number}</div>
                    </div>
                    <div className='flex h-24'>
                      <div className='border-l border-black flex justify-center p-2 w-5/12 items-center'>Adresi</div>
                      <div className='border-x border-black flex justify-center p-2 w-full items-center'></div>
                    </div>
                    <div className='flex'>
                      <div className='border-y border-l border-black flex justify-center p-2 w-5/12 items-center'>Tarih-İmza</div>
                      <div className='border border-black flex justify-center p-2 w-full items-center font-bold'>{prettyDate(Date.now())}</div>
                    </div>
                  </div>
                  <div className='flex flex-col w-5/12'>
                    <div className='border border-black flex justify-center p-2'>Teslim Alan</div>
                    <div className='flex'>
                      <div className='border-x border-black flex justify-center p-2 w-5/12'>Adı Soyadı</div>
                      <div className='border-r border-black flex justify-center p-2 w-full font-bold'>John Doe</div>
                    </div>
                    <div className='flex'>
                      <div className='border border-black flex justify-center p-2 w-5/12'>Görevi</div>
                      <div className='border-y border-r border-black flex justify-center p-2 w-full font-bold'>Yetkili</div>
                    </div>
                    <div className='flex h-20'>
                      <div className='border-l border-black flex justify-center p-2 w-5/12 items-center'>T.C. Kimlik No</div>
                      <div className='border-x border-black flex justify-center p-2 w-full items-center font-bold'>12345678901</div>
                    </div>
                    <div className='flex h-20'>
                      <div className='border-y border-l border-black flex justify-center p-2 w-5/12 items-center'>Tarih-İmza</div>
                      <div className='border border-black flex justify-center p-2 w-full items-center font-bold'>{prettyDate(Date.now())}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )

}

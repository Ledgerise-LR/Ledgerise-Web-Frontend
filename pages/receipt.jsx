
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

export default function Home() {

  const downloadAsPDF = async (divId, fileName) => {
    const div = document.getElementById(divId);

    // Use html2canvas to capture the content of the div as an image
    const canvas = await html2canvas(div);

    // Create a PDF document
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', pdf.internal.pageSize.getWidth() * 0.5 * -1, 0, pdf.internal.pageSize.getWidth() * 2, pdf.internal.pageSize.getHeight());

    // Save the PDF
    pdf.save(fileName);
  };

  const handleDownloadPDF = () => {
    downloadAsPDF('main', 'UAAOAB Bağış Alındı Makbuzu.pdf');
  };


  return (
    <div>
      <div className='cursor-pointer bg-slate-900 rounded-lg text-slate-50 p-2 w-fit m-auto my-2' onClick={() => { handleDownloadPDF() }}>Download ↓</div>
      <div id="main">
        <div className='w-screen h-full flex flex-col items-center justify-center font-serif'>
          <div className='w-1/2 border border-black p-12'>
            <div className='flex justify-end'>EK-1</div>
            <div>
              <div className='flex justify-center'>OKUL-AİLE BİRLİĞİ AYNİ/ NAKDÎ BAĞIŞ ALINDI BELGESİ</div>
              <div className='flex flex-col border border-black p-1'>
                <div className='flex border'>
                  <div className='flex flex-col w-3/4 border'>
                    <div className='p-1 border border-black'>Birliğin</div>
                    <div className='p-1 border border-black'>Adı    : <strong>Üsküdar Amerikan Lisesi Okul Aile Birliği</strong></div>
                    <div className='p-1 border border-black h-24'>Adresi    : <strong>Selamiali, Vakıf Sk. No:1, 34664 Üsküdar/İstanbul</strong></div>
                  </div>
                  <div className='flex flex-col w-1/4 border border-black p-1'>
                    <div className='mb-2 h-1/4'>Seri No :</div>
                    <div className='mb-2 h-1/4'>Cilt No :</div>
                    <div>Sıra No :</div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className='w-1/3 border border-black p-2'>Telefon No:</div>
                  <div className='w-1/3 border border-black p-2'>Faks No:</div>
                  <div className='w-1/3 border border-black p-2'>e-posta Adresi</div>
                </div>
              </div>
            </div>
            <div className='mt-16'>
              <div className='flex justify-center'>NAKDÎ BAĞIŞLAR</div>
              <div className='flex flex-col'>
                <div className='flex justify-between'>
                  <div className='border border-black w-16 p-1 flex justify-center items-center'>Sıra No</div>
                  <div className='border border-black w-2/3 p-1 flex justify-center items-center'>Bağışın Cinsi (TL/Döviz )</div>
                  <div className='border border-black w-1/3 p-1 flex justify-center items-center'>Tutar</div>
                </div>
                <div className='flex justify-between'>
                  <div className='border border-black w-16 p-1 flex justify-center items-center h-8'></div>
                  <div className='border border-black w-2/3 p-1 flex justify-center items-center'></div>
                  <div className='border border-black w-1/3 p-1 flex justify-center items-center'></div>
                </div>
                <div className='flex justify-between'>
                  <div className='border border-black w-16 p-1 flex justify-center items-center h-8'></div>
                  <div className='border border-black w-2/3 p-1 flex justify-center items-center'></div>
                  <div className='border border-black w-1/3 p-1 flex justify-center items-center'></div>
                </div>
                <div className='flex justify-between'>
                  <div className='border border-black w-16 p-1 flex justify-center items-center h-8'></div>
                  <div className='border border-black w-2/3 p-1 flex justify-center items-center'></div>
                  <div className='border border-black w-1/3 p-1 flex justify-center items-center'></div>
                </div>
                <div className='flex justify-between'>
                  <div className='w-16 border-l border-b border-black p-1 flex justify-center items-center h-8'></div>
                  <div className='border-b border-black w-2/3 p-1 flex justify-center items-center text-sm'>Toplam</div>
                  <div className='border-b border-x border-black w-1/3 p-1 flex justify-center items-center'></div>
                </div>
                <div className='flex justify-center mt-4'>
                  <div>Yalnız ............................................................................................. TL/Döviz tahsil edilmiştir.</div>
                  <div className='absolute font-bold -ml-36'></div>
                </div>
              </div>
              <div>
                <div className='mt-12'>Yukarıda belirtilen ayni/nakdî bağışı teslim aldım.</div>
                <div className='flex justify-between'>
                  <div className='flex flex-col w-5/12'>
                    <div className='border border-black flex justify-center p-2'>Teslim Eden</div>
                    <div className='flex'>
                      <div className='border border-black flex justify-center p-2 w-5/12'>Adı Soyadı</div>
                      <div className='border border-black flex justify-center p-2 w-full'></div>
                    </div>
                    <div className='flex'>
                      <div className='border border-black flex justify-center p-2 w-5/12'>T.C. Kimlik No</div>
                      <div className='border border-black flex justify-center p-2 w-full'></div>
                    </div>
                    <div className='flex h-24'>
                      <div className='border border-black flex justify-center p-2 w-5/12 items-center'>Adresi</div>
                      <div className='border border-black flex justify-center p-2 w-full items-center'></div>
                    </div>
                    <div className='flex'>
                      <div className='border border-black flex justify-center p-2 w-5/12 items-center'>Tarih-İmza</div>
                      <div className='border border-black flex justify-center p-2 w-full items-center'></div>
                    </div>
                  </div>
                  <div className='flex flex-col w-5/12'>
                    <div className='border border-black flex justify-center p-2'>Teslim Eden</div>
                    <div className='flex'>
                      <div className='border border-black flex justify-center p-2 w-5/12'>Adı Soyadı</div>
                      <div className='border border-black flex justify-center p-2 w-full'></div>
                    </div>
                    <div className='flex'>
                      <div className='border border-black flex justify-center p-2 w-5/12'>Görevi</div>
                      <div className='border border-black flex justify-center p-2 w-full'></div>
                    </div>
                    <div className='flex h-20'>
                      <div className='border border-black flex justify-center p-2 w-5/12 items-center'>T.C. Kimlik No</div>
                      <div className='border border-black flex justify-center p-2 w-full items-center'></div>
                    </div>
                    <div className='flex h-20'>
                      <div className='border border-black flex justify-center p-2 w-5/12 items-center'>Tarih-İmza</div>
                      <div className='border border-black flex justify-center p-2 w-full items-center'></div>
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

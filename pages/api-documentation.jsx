
import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL, PORT } from '@/serverConfig';
import ApiSlot from '@/components/ApiSlot';
import ApiTab from '@/components/ApiTab';

export default function Home() {

  const [focusedApiEndpoint, setFocusedApiEndpoint] = useState(1);

  return (
    <div className='w-screen h-screen flex overflow-x-hidden border-t-4 border-t-yellow-500'>
      <nav className='h-full w-2/12 border-r-2 p-4 overflow-y-scroll'>
        <div className='text-slate-800 mb-4 uppercase text-sm'>Ledgerise - Organizasyon Entegrasyonu</div>
        <div className='text-slate-600'>
          <div className='mb-2'>Bağış ürünü</div>
          <div onClick={() => setFocusedApiEndpoint(1)}>
            <ApiTab title={"Bağış ürünü detayları"} method={"GET"}/>
          </div>
          <div onClick={() => setFocusedApiEndpoint(2)}>
            <ApiTab title={"Bağış ürünlerini filtrele"} method={"POST"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(3)}>
            <ApiTab title={"Vitrin için rastgele bir bağış ürünü"} method={"GET"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(5)}>
            <ApiTab title={"Verifikasyonları filtrele"} method={"POST"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(6)}>
            <ApiTab title={"Bağış ürünü listele"} method={"POST"}/>
          </div>
        </div>
        
        <div className='text-slate-600 mt-6'>
          <div className='mb-2'>Bağış kampanyası</div>
          <div  onClick={() => setFocusedApiEndpoint(7)}>
            <ApiTab title={"Kampanyanın bağış ürünlerini sorgula"} method={"GET"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(8)}>
            <ApiTab title={"Bağış kampanyalarını filtrele"} method={"POST"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(9)}>
            <ApiTab title={"Kampanya detayları"} method={"GET"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(10)}>
            <ApiTab title={"Sırala & filtrele (fiyat artan)"} method={"GET"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(11)}>
            <ApiTab title={"Sırala & filtrele (fiyat azalan)"} method={"GET"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(12)}>
            <ApiTab title={"Sırala & filtrele (eski-yeni)"} method={"GET"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(13)}>
            <ApiTab title={"Sırala & filtrele (yeni-eski)"} method={"GET"}/>
          </div>
          <div  onClick={() => setFocusedApiEndpoint(14)}>
            <ApiTab title={"Kampanyanın bağış ürünleri (filtresiz)"} method={"GET"}/>          
          </div>
          <div  onClick={() => setFocusedApiEndpoint(15)}>
            <ApiTab title={"Kampanya yarat"} method={"POST"}/>          
          </div>
          <div  onClick={() => setFocusedApiEndpoint(16)}>
            <ApiTab title={"Kampanya görselini güncelle"} method={"POST"}/>          
          </div>
        </div>

        <div className='text-slate-600 mt-6'>
          <div className='mb-2'>Otorizasyon</div>
          <div  onClick={() => setFocusedApiEndpoint(17)}>
          <ApiTab title={"Bağışçı (register)"} method={"POST"}/>          
          </div>
          <div  onClick={() => setFocusedApiEndpoint(18)}>
          <ApiTab title={"Bağışçı (login)"} method={"POST"}/>          
          </div>
          <div  onClick={() => setFocusedApiEndpoint(19)}>
          <ApiTab title={"İhtiyaç sahibi (register)"} method={"POST"}/>          
          </div>
          <div  onClick={() => setFocusedApiEndpoint(20)}>
            <ApiTab title={"İhtiyaç sahibi (login)"} method={"POST"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(21)}>
            <ApiTab title={"Şirket (login)"} method={"POST"}/>            
          </div>
        </div>

        <div className='text-slate-600 mt-6'>
          <div className='mb-2'>Şirket</div>
          <div  onClick={() => setFocusedApiEndpoint(22)}>
            <ApiTab title={"Kampanyalarınızı sorgulayın"} method={"POST"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(23)}>
            <ApiTab title={"Şirket detayları"} method={"POST"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(24)}>
            <ApiTab title={"Şirket ismi sorgula"} method={"POST"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(25)}>
            <ApiTab title={"Bağış ürünlerinizi sorgulayın"} method={"POST"}/>            
          </div>
        </div>

        <div className='text-slate-600 mt-6'>
          <div className='mb-2'>Depo</div>
          <div  onClick={() => setFocusedApiEndpoint(26)}>
            <ApiTab title={"Depo lokasyonu sorgula"} method={"POST"}/>            
          </div>
        </div>

        <div className='text-slate-600 mt-6'>
          <div className='mb-2'>Bağışçı</div>
          <div  onClick={() => setFocusedApiEndpoint(27)}>
            <ApiTab title={"Fatura bilgisi sorgula"} method={"POST"}/>            
          </div>
        </div>

        <div className='text-slate-600 mt-6'>
          <div className='mb-2'>Rapor & sorun bildirme</div>
          <div  onClick={() => setFocusedApiEndpoint(28)}>
            <ApiTab title={"Raporları sorgula"} method={"GET"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(29)}>
            <ApiTab title={"Rapor & sorun bildir"} method={"POST"}/>            
          </div>
        </div>

        <div className='text-slate-600 mt-6'>
          <div className='mb-2'>İhtiyaç</div>
          <div  onClick={() => setFocusedApiEndpoint(30)}>
            <ApiTab title={"İhtiyaçları filtrele"} method={"POST"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(31)}>
            <ApiTab title={"İhtiyaç başvurusu"} method={"POST"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(32)}>
            <ApiTab title={"İhtiyacı karşıla"} method={"POST"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(33)}>
            <ApiTab title={"İhtiyacın karşılandığı ürünün detaylarını sorgula"} method={"GET"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(34)}>
            <ApiTab title={"Bağışçının karşıladığı ihtiyaçları sorgula"} method={"GET"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(35)}>
            <ApiTab title={"İhtiyaç sahibinin ihtiyaçlarını sorgula"} method={"GET"}/>            
          </div>
        </div>

        <div className='text-slate-600 mt-6'>
          <div className='mb-2'>Bağışlar & ödeme</div>
          <div  onClick={() => setFocusedApiEndpoint(36)}>
            <ApiTab title={"Bağışla (ödeme gerçekleşmiş)"} method={"POST"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(37)}>
            <ApiTab title={"Bağışla (kredi kartı)"} method={"POST"}/>            
          </div>
          <div  onClick={() => setFocusedApiEndpoint(38)}>
            <ApiTab title={"Bağışla (kripto)"} method={"POST"}/>            
          </div>
        </div>

        <div className='text-slate-600 mt-6'>
          <div className='mb-2'>Bağış ürünü kimliği: tokenUri</div>
          <div  onClick={() => setFocusedApiEndpoint(39)}>
            <ApiTab title={"tokenUri filtrele"} method={"GET"}/>     
          </div>
          <div  onClick={() => setFocusedApiEndpoint(40)}>
            <ApiTab title={"tokenUri oluştur"} method={"POST"}/>          
          </div>
        </div>
      </nav>
      <div className='h-full w-10/12 border-r-2 overflow-y-scroll'>
        {
          focusedApiEndpoint == 1
            ? (
              <ApiSlot
                title={"Bağış ürünü detayları"}
                method={"GET"}
                url={"https://api-ledgerise.onrender.com/active-item/get-asset?tokenId=<tokenId>&subcollectionId=<subcollectionId>&nftAddress=<nftAddress>"}
                description={"Ledgerise da her koli veya karşılanan her ihtiyaç bir bağış ürünü olarak adlandırılır. Söz konusu metod bu ürünler hakkında bilgi almak için kullanılır."}
                importantNote={"openseaTokenId parametresi Satın alma numarasına karşılık gelmektedir."}
                parameters={[
                  ["nftAddress", "string", "Bağış ürününün dahil olduğu yardım kampanyasının nftAddress değeri", true],
                  ["subcollectionId", "number", "Bağış ürününün dahil olduğu yardım kampanyasının itemId si", true],
                  ["id", "number", "Bağış ürününün tokenId si", true]
                ]}
                resEx={[
                  ["seller", "string"],
                  ["nftAddress", "string"],
                  ["tokenId", "number"],
                  ["charityAddress", "string"],
                  ["tokenUri", "string"],
                  ["price", "string"],
                  ["availableEditions", "string"],
                  ["subcollectionId", "string"],
                  ["history", "Array", [
                    ["event", "string"],
                    ["date", "string"],
                    ["price", "string"],
                    ["buyer", "string"],
                    ["openseaTokenId", "number"],
                    ["transactionHash", "string"],
                  ]],
                  ["attributes", "Array", [
                    ["trait_type", "string"],
                    ["value", "number"]
                  ]],
                  ["real_item_history", "Array", [
                    ["key", "string"],
                    ["buyer", "string"],
                    ["openseaTokenId", "number"],
                    ["date", "string"],
                    ["location", "object"],
                    ["transactionHash", "string"],
                    ["visualVerificationTokenId", "number"]
                  ]],
                  ["route", "Array", [
                    ["stampLocation", "location"],
                    ["shippedLocation", "location"]
                    ["deliveryLocation", "location"]
                  ]],
                  ["listTransactionHash", "string"],
                  ["collaborators", "Array", [
                    ["openseaTokenId", "number"]
                  ]],
                ]}
              />
            )
            : focusedApiEndpoint == 2
                ?(
                  <ApiSlot
                    title={"Bağış ürünlerini filtrele"}
                    method={"POST"}
                    url={"https://api-ledgerise.onrender.com/active-item/get-all-active-items"}
                    description={"Ledgerise kapsamındaki bütün kolilere uyguladığınız filtreler kapsamında ulaşabilirsiniz"}
                    importantNote={"Otorizasyona gerek yoktur."}
                    parameters={[
                      ["nftAddress", "string", "Bağış ürününün dahil olduğu yardım kampanyasının nftAddress değeri", false],
                      ["subcollectionId", "number", "Bağış ürününün dahil olduğu yardım kampanyasının itemId si", false],
                      ["tokenId", "number", "Bağış ürününün blockchain tokenId si", false],
                      ["_id", "ObjectId", "Ürünün veritabanı id'si", false]
                    ]}
                    resEx={[["activeItems", "Array", [
                      ["seller", "string"],
                      ["nftAddress", "string"],
                      ["tokenId", "number"],
                      ["charityAddress", "string"],
                      ["tokenUri", "string"],
                      ["price", "string"],
                      ["availableEditions", "string"],
                      ["subcollectionId", "string"],
                      ["history", "Array", [
                        ["event", "string"],
                        ["date", "string"],
                        ["price", "string"],
                        ["buyer", "string"],
                        ["openseaTokenId", "number"],
                        ["transactionHash", "string"],
                      ]],
                      ["attributes", "Array", [
                        ["trait_type", "string"],
                        ["value", "number"]
                      ]],
                      ["real_item_history", "Array", [
                        ["key", "string"],
                        ["buyer", "string"],
                        ["openseaTokenId", "number"],
                        ["date", "string"],
                        ["location", "object"],
                        ["transactionHash", "string"],
                        ["visualVerificationTokenId", "number"]
                      ]],
                      ["route", "Array", [
                        ["stampLocation", "location"],
                        ["shippedLocation", "location"]
                        ["deliveryLocation", "location"]
                      ]],
                      ["listTransactionHash", "string"],
                    ]]]}
                  />
                )
                : focusedApiEndpoint == 3
                    ? <ApiSlot
                    title={"Vitrin için rastgele bir bağış ürün"}
                    method={"GET"}
                    url={"https://api-ledgerise.onrender.com/active-item/get-random-featured-asset"}
                    description={"Bu metod herhangi bir anasayfada veya tasarım kapsamında bir slayt gösterimi olarak sergilemek için rastgele bir bağış ürününü sunar."}
                    importantNote={"Otorizasyona gerek yoktur."}
                    parameters={[]}
                    resEx={[
                      ["nftAddress", "string"],
                      ["tokenId", "number"],
                      ["charityAddress", "string"],
                      ["tokenUri", "string"],
                      ["price", "string"],
                      ["collectionName", "string"],
                      ["subcollectionId", "string"],
                      ["totalRaised", "string"],
                      ["totalDonated", "number"]
                    ]}
                  />
                    : focusedApiEndpoint == 5
                      ? <ApiSlot
                      title={"Verifikasyonları filtrele"}
                      method={"POST"}
                      url={"https://api-ledgerise.onrender.com/active-item/get-visual-verifications-filter"}
                      description={"Bağış ürünleri kritik noktalarda (üretim, depo, teslim) eş zamanlı olarak QR kodları okutulup fotoğrafları çekilerek doğrulanır. Bu metod sayesinde bu doğrulamalara istediğiniz filtreleri uygulayarak ulaşabilirsiniz."}
                      importantNote={"Otorizasyona gerek yoktur."}
                      parameters={[
                        ["buyer", "string", "Ürünün bağışçısını temsil eder.", false],
                        ["key", "string", "Hangi noktada doğrulandığını gösterir; stamp: üretim, shipped: depo, delivered: teslim", false],
                        ["visualVerificationTokenId", "number", "Ürün doğrulandığında çekilen resim bir NFT olarak mint edilir. Bu değer verifikasyon NFT'sinin tokenId'sini temsil eder.", false],
                        ["tokenUri", "string", "Ürün doğrulandığında çekilen resmin tokenUri'sidir. (imageString)", false],
                        ["isUploadedToBlockchain", "boolean", "Doğrulamanın blockchain'e yüklenip yüklenmediğini gösterir.", false],
                        ["nftAddress", "string", "Doğrulamanın gerçekleştiği nft adresi.", false],
                        ["tokenId", "string", "Bağış ürünün blockchain kodu.", false],
                        ["openseaTokenId", "string", "Bağış ürünün satın alma numarası.", false],
                      ]}
                      resEx={[
                        ["buyer", "string"],
                        ["key", "string"],
                        ["openseaTokenId", "number"],
                        ["tokenId", "string"],
                        ["tokenUri", "string"],
                        ["base64_image", "string"],
                        ["location", "Array", [
                          ["latitude", "number"],
                          ["longitude", "number"]
                        ]],
                        ["isUploadedToBlockchain", "boolean"],
                        ["date", "string"],
                        ["transactionHash", "string"],
                        ["bounds", "Array", [
                          ["x", "number"],
                          ["y", "number"]
                        ]],
                        ["visualVerificationTokenId", "number"],
                        ["nftAddress", "string"]
                      ]}
                    />
                      : focusedApiEndpoint == 6
                        ? <ApiSlot
                        title={"Bağış ürünü listele"}
                        method={"POST"}
                        url={"https://api-ledgerise.onrender.com/active-item/list-item"}
                        description={"Önceden stoklarınızda hazır bulunan bağış ürünleriniz var ise, bağış kolisi gibi, bu metod bu ürünleri ledgerise'da listelemeye yarıyor."}
                        importantNote={"Önemli: Otorizasyon gerekiyor. Şirket (login) sekmesine tıklayarak bu metodu çağırmadan önce adımları takip ederek login olmalısınız."}
                        parameters={[
                          ["nftAddress", "string", "Ürünü listelemek istediğiniz kampanyanın (subcollection) NFT adresi.", true],
                          ["price", "string", "Ürünün fiyatı (TRY)", true],
                          ["subcollectionId", "string", "Ürünü listelemek istediğiniz kampanyanın (subcollection) itemId'si.", true],
                          ["availableEditions", "string", "Üründen elinizde bulunan stok sayısı.", true],
                          ["route", "object", "Ürünün takip edeceği rota.", true, [
                            ["stampLocation", "object", "Ürünün üretileceği lokasyon", true, [
                              ["latitude", "number", "Lokasyonun latitude değerinin 1000 ile çarpılmış hali (40.123: 40123)", true],
                              ["longitude", "number", "Lokasyonun longitude değerinin 1000 ile çarpılmış hali (40.123: 40123)", true],
                              ["decimals", "number", "3 sayısını veriniz", true]
                            ]],
                            ["shipLocation", "object", "Ürünün ulaştığı deponun lokasyonu", true, [
                              ["latitude", "number", "Lokasyonun latitude değerinin 1000 ile çarpılmış hali (40.123: 40123)", true],
                              ["latitude", "number", "Lokasyonun longitude değerinin 1000 ile çarpılmış hali (40.123: 40123)", true],
                              ["decimals", "number", "3 sayısını veriniz", true]
                            ]],
                            ["deliverLocation", "object", "Ürünün teslim edileceği bölgenin genel lokasyonu", true, [
                              ["latitude", "number", "Lokasyonun latitude değerinin 1000 ile çarpılmış hali (40.123: 40123)", true],
                              ["latitude", "number", "Lokasyonun longitude değerinin 1000 ile çarpılmış hali (40.123: 40123)", true],
                              ["decimals", "number", "3 sayısını veriniz", true]
                            ]]
                          ]],
                          ["tokenUri", "string", "tokenUri ürünün kimliği gibidir. Resmi ve özellikleri bulunur. Bir tokenUri oluşturmak için 'Bağış ürünü kimliği: tokenUri' sekmesinden 'oluştur'a tıklayarak adımları takip edin. ", true],
                        ]}
                        resEx={[
                          ["seller", "string"],
                          ["nftAddress", "string"],
                          ["tokenId", "number"],
                          ["charityAddress", "string"],
                          ["tokenUri", "string"],
                          ["price", "string"],
                          ["availableEditions", "string"],
                          ["subcollectionId", "string"],
                          ["history", "Array", [
                            ["event", "string"],
                            ["date", "string"],
                            ["price", "string"],
                            ["buyer", "string"],
                            ["openseaTokenId", "number"],
                            ["transactionHash", "string"],
                          ]],
                          ["route", "Array", [
                            ["stampLocation", "location"],
                            ["shippedLocation", "location"]
                            ["deliveryLocation", "location"]
                          ]],
                          ["listTransactionHash", "string"]
                        ]}
                      />
                        : focusedApiEndpoint == 7
                          ? <ApiSlot
                          title={"Kampanyanın bağış ürünlerini sorgula"}
                          method={"GET"}
                          url={"https://api-ledgerise.onrender.com/subcollection/get-collection?nftAddress=${nftAddress}&subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}"}
                          description={"Bu metod kapsamında bir bağış kampanyasının altındaki bağış ürünlerine filtreler uygulayarak bu ürünleri sorgulayabilirsiniz."}
                          importantNote={"Otorizasyona gerek yoktur."}
                          parameters={[
                            ["nftAddress", "string", "Bağış kampanyasının nftAddress değeri.", true],
                            ["subcollectionId", "string", "Bağış kampanyasının itemId'si değeri.", true],
                            ["priceFilter", "string", "Bir bağış fiyatı filtresi uygulayabilirsiniz. Örneğin 0 ile 100 TRY arası için '0-100'", true],
                            ["availableEditionsFilter", "string", "Bir stok filtresi uygulayabilirsiniz. Örneğin 0 ile 100 adet arası için '0-100'", true],
                          ]}
                          resEx={[["activeItems", "Array", [
                            ["seller", "string"],
                            ["nftAddress", "string"],
                            ["tokenId", "number"],
                            ["charityAddress", "string"],
                            ["tokenUri", "string"],
                            ["price", "string"],
                            ["availableEditions", "string"],
                            ["subcollectionId", "string"],
                            ["history", "Array", [
                              ["event", "string"],
                              ["date", "string"],
                              ["price", "string"],
                              ["buyer", "string"],
                              ["openseaTokenId", "number"],
                              ["transactionHash", "string"],
                            ]],
                            ["attributes", "Array", [
                              ["trait_type", "string"],
                              ["value", "number"]
                            ]],
                            ["real_item_history", "Array", [
                              ["key", "string"],
                              ["buyer", "string"],
                              ["openseaTokenId", "number"],
                              ["date", "string"],
                              ["location", "object"],
                              ["transactionHash", "string"],
                              ["visualVerificationTokenId", "number"]
                            ]],
                            ["route", "Array", [
                              ["stampLocation", "location"],
                              ["shippedLocation", "location"]
                              ["deliveryLocation", "location"]
                            ]],
                            ["listTransactionHash", "string"],
                          ]]]}
                        />
                          : focusedApiEndpoint == 8
                            ? <ApiSlot
                            title={"Bağış kampanyalarını filtrele"}
                            method={"POST"}
                            url={"https://api-ledgerise.onrender.com/active-item/get-all-collections"}
                            description={"Bu metod yardım kampanyaları hakkında detayları sorgulamaya yarar. Bunu yaparken çeşitli filtreler uygulayabilirsiniz."}
                            importantNote={"Otorizasyona gerek yoktur."}
                            parameters={[
                              ["companyCode", "string", "Bu kampanyanın sahibi olan şirketin companyCode değeri.", false],
                              ["_id", "ObjectId", "Bu kampanyanın veritabanı id'si", false],
                              ["nftAdress", "string", "Bu kampanyanın NFT adresi (nftAddress değeri).", false],
                              ["itemId", "string", "Bu kampanyanın itemId'si (subcollectionId).", false],
                            ]}
                            resEx={[["subcollections", "Array", [
                              ["itemIe", "string"],
                              ["name", "number"],
                              ["companyCode", "string"],
                              ["nftAddress", "string"],
                              ["properties", "Array"],
                              ["collectionName", "string"],
                              ["image", "base64"],
                              ["totalRaised", "string"],
                              ["marketplaceAddress", "string"],
                              ["providerUrl", "string"],
                              ["ledgeriseLensAddress", "string"],
                              ["transactionHash", "string"]
                            ]]]}
                          />
                          : focusedApiEndpoint == 9
                            ? <ApiSlot
                            title={"Kampanya detayları"}
                            method={"GET"}
                            url={"https://api-ledgerise.onrender.com/subcollection/get-single-collection?id=${itemId}&nftAddress=${nftAddress}"}
                            description={"Bu metod tek bir yardım kampanyası hakkındaki detaylara ulaşmaya yarar."}
                            importantNote={"Otorizasyona gerek yoktur."}
                            parameters={[
                              ["nftAdress", "string", "Bu kampanyanın NFT adresi (nftAddress değeri).", true],
                              ["itemId", "string", "Bu kampanyanın itemId'si (subcollectionId).", true],
                            ]}
                            resEx={[
                              ["itemId", "string"],
                              ["name", "number"],
                              ["companyCode", "string"],
                              ["nftAddress", "string"],
                              ["properties", "array"],
                              ["collectionName", "string"],
                              ["image", "base64"],
                              ["totalRaised", "string"],
                              ["marketplaceAddress", "string"],
                              ["providerUrl", "string"],
                              ["ledgeriseLensAddress", "string"],
                              ["transactionHash", "string"]
                            ]}
                          />
                            : focusedApiEndpoint == 10
                              ? <ApiSlot
                              title={"Sırala & filtrele (fiyat artan)"}
                              method={"GET"}
                              url={"https://api-ledgerise.onrender.com/subcollection/sort/price-ascending?nftAddress=${nftAddress}&subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}"}
                              description={"Bu metod kapsamında bir bağış kampanyasının altındaki bağış ürünlerine filtreler uygulayarak bu ürünleri sorgulayabilirsiniz."}
                              importantNote={"Otorizasyona gerek yoktur."}
                              parameters={[
                                ["nftAddress", "string", "Bağış kampanyasının nftAddress değeri.", true],
                                ["subcollectionId", "string", "Bağış kampanyasının itemId'si değeri.", true],
                                ["priceFilter", "string", "Bir bağış fiyatı filtresi uygulayabilirsiniz. Örneğin 0 ile 100 TRY arası için '0-100'", true],
                                ["availableEditionsFilter", "string", "Bir stok filtresi uygulayabilirsiniz. Örneğin 0 ile 100 adet arası için '0-100'", true],
                              ]}
                              resEx={[["activeItems", "Array", [
                                ["seller", "string"],
                                ["nftAddress", "string"],
                                ["tokenId", "number"],
                                ["charityAddress", "string"],
                                ["tokenUri", "string"],
                                ["price", "string"],
                                ["availableEditions", "string"],
                                ["subcollectionId", "string"],
                                ["history", "Array", [
                                  ["event", "string"],
                                  ["date", "string"],
                                  ["price", "string"],
                                  ["buyer", "string"],
                                  ["openseaTokenId", "number"],
                                  ["transactionHash", "string"],
                                ]],
                                ["attributes", "Array", [
                                  ["trait_type", "string"],
                                  ["value", "number"]
                                ]],
                                ["real_item_history", "Array", [
                                  ["key", "string"],
                                  ["buyer", "string"],
                                  ["openseaTokenId", "number"],
                                  ["date", "string"],
                                  ["location", "object"],
                                  ["transactionHash", "string"],
                                  ["visualVerificationTokenId", "number"]
                                ]],
                                ["route", "Array", [
                                  ["stampLocation", "location"],
                                  ["shippedLocation", "location"]
                                  ["deliveryLocation", "location"]
                                ]],
                                ["listTransactionHash", "string"],
                              ]]]}
                            />
                              : focusedApiEndpoint == 11
                              ? <ApiSlot
                              title={"Sırala & filtrele (fiyat azalan)"}
                              method={"GET"}
                              url={"https://api-ledgerise.onrender.com/subcollection/sort/price-descending?nftAddress=${nftAddress}&subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}"}
                              description={"Bu metod kapsamında bir bağış kampanyasının altındaki bağış ürünlerine filtreler uygulayarak bu ürünleri sorgulayabilirsiniz."}
                              importantNote={"Otorizasyona gerek yoktur."}
                              parameters={[
                                ["nftAddress", "string", "Bağış kampanyasının nftAddress değeri.", true],
                                ["subcollectionId", "string", "Bağış kampanyasının itemId'si değeri.", true],
                                ["priceFilter", "string", "Bir bağış fiyatı filtresi uygulayabilirsiniz. Örneğin 0 ile 100 TRY arası için '0-100'", true],
                                ["availableEditionsFilter", "string", "Bir stok filtresi uygulayabilirsiniz. Örneğin 0 ile 100 adet arası için '0-100'", true],
                              ]}
                              resEx={[["activeItems", "Array", [
                                ["seller", "string"],
                                ["nftAddress", "string"],
                                ["tokenId", "number"],
                                ["charityAddress", "string"],
                                ["tokenUri", "string"],
                                ["price", "string"],
                                ["availableEditions", "string"],
                                ["subcollectionId", "string"],
                                ["history", "Array", [
                                  ["event", "string"],
                                  ["date", "string"],
                                  ["price", "string"],
                                  ["buyer", "string"],
                                  ["openseaTokenId", "number"],
                                  ["transactionHash", "string"],
                                ]],
                                ["attributes", "Array", [
                                  ["trait_type", "string"],
                                  ["value", "number"]
                                ]],
                                ["real_item_history", "Array", [
                                  ["key", "string"],
                                  ["buyer", "string"],
                                  ["openseaTokenId", "number"],
                                  ["date", "string"],
                                  ["location", "object"],
                                  ["transactionHash", "string"],
                                  ["visualVerificationTokenId", "number"]
                                ]],
                                ["route", "Array", [
                                  ["stampLocation", "location"],
                                  ["shippedLocation", "location"]
                                  ["deliveryLocation", "location"]
                                ]],
                                ["listTransactionHash", "string"],
                              ]]]}
                            />
                              : focusedApiEndpoint == 12
                              ? <ApiSlot
                              title={"Sırala & filtrele (eski-yeni)"}
                              method={"GET"}
                              url={"https://api-ledgerise.onrender.com/subcollection/sort/oldest?nftAddress=${nftAddress}&subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}"}
                              description={"Bu metod kapsamında bir bağış kampanyasının altındaki bağış ürünlerine filtreler uygulayarak bu ürünleri sorgulayabilirsiniz."}
                              importantNote={"Otorizasyona gerek yoktur."}
                              parameters={[
                                ["nftAddress", "string", "Bağış kampanyasının nftAddress değeri.", true],
                                ["subcollectionId", "string", "Bağış kampanyasının itemId'si değeri.", true],
                                ["priceFilter", "string", "Bir bağış fiyatı filtresi uygulayabilirsiniz. Örneğin 0 ile 100 TRY arası için '0-100'", true],
                                ["availableEditionsFilter", "string", "Bir stok filtresi uygulayabilirsiniz. Örneğin 0 ile 100 adet arası için '0-100'", true],
                              ]}
                              resEx={[["activeItems", "Array", [
                                ["seller", "string"],
                                ["nftAddress", "string"],
                                ["tokenId", "number"],
                                ["charityAddress", "string"],
                                ["tokenUri", "string"],
                                ["price", "string"],
                                ["availableEditions", "string"],
                                ["subcollectionId", "string"],
                                ["history", "Array", [
                                  ["event", "string"],
                                  ["date", "string"],
                                  ["price", "string"],
                                  ["buyer", "string"],
                                  ["openseaTokenId", "number"],
                                  ["transactionHash", "string"],
                                ]],
                                ["attributes", "Array", [
                                  ["trait_type", "string"],
                                  ["value", "number"]
                                ]],
                                ["real_item_history", "Array", [
                                  ["key", "string"],
                                  ["buyer", "string"],
                                  ["openseaTokenId", "number"],
                                  ["date", "string"],
                                  ["location", "object"],
                                  ["transactionHash", "string"],
                                  ["visualVerificationTokenId", "number"]
                                ]],
                                ["route", "Array", [
                                  ["stampLocation", "location"],
                                  ["shippedLocation", "location"]
                                  ["deliveryLocation", "location"]
                                ]],
                                ["listTransactionHash", "string"],
                              ]]]}
                            />
                              : focusedApiEndpoint == 13
                              ? <ApiSlot
                              title={"Sırala & filtrele (yeni-eski)"}
                              method={"GET"}
                              url={"https://api-ledgerise.onrender.com/subcollection/sort/newest?nftAddress=${nftAddress}&subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}"}
                              description={"Bu metod kapsamında bir bağış kampanyasının altındaki bağış ürünlerine filtreler uygulayarak bu ürünleri sorgulayabilirsiniz."}
                              importantNote={"Otorizasyona gerek yoktur."}
                              parameters={[
                                ["nftAddress", "string", "Bağış kampanyasının nftAddress değeri.", true],
                                ["subcollectionId", "string", "Bağış kampanyasının itemId'si değeri.", true],
                                ["priceFilter", "string", "Bir bağış fiyatı filtresi uygulayabilirsiniz. Örneğin 0 ile 100 TRY arası için '0-100'", true],
                                ["availableEditionsFilter", "string", "Bir stok filtresi uygulayabilirsiniz. Örneğin 0 ile 100 adet arası için '0-100'", true],
                              ]}
                              resEx={[["activeItems", "Array", [
                                ["seller", "string"],
                                ["nftAddress", "string"],
                                ["tokenId", "number"],
                                ["charityAddress", "string"],
                                ["tokenUri", "string"],
                                ["price", "string"],
                                ["availableEditions", "string"],
                                ["subcollectionId", "string"],
                                ["history", "Array", [
                                  ["event", "string"],
                                  ["date", "string"],
                                  ["price", "string"],
                                  ["buyer", "string"],
                                  ["openseaTokenId", "number"],
                                  ["transactionHash", "string"],
                                ]],
                                ["attributes", "Array", [
                                  ["trait_type", "string"],
                                  ["value", "number"]
                                ]],
                                ["real_item_history", "Array", [
                                  ["key", "string"],
                                  ["buyer", "string"],
                                  ["openseaTokenId", "number"],
                                  ["date", "string"],
                                  ["location", "object"],
                                  ["transactionHash", "string"],
                                  ["visualVerificationTokenId", "number"]
                                ]],
                                ["route", "Array", [
                                  ["stampLocation", "location"],
                                  ["shippedLocation", "location"]
                                  ["deliveryLocation", "location"]
                                ]],
                                ["listTransactionHash", "string"],
                              ]]]}
                            />
                              : focusedApiEndpoint == 14
                                ? <ApiSlot
                                title={"Kampanyanın bağış ürünlerini (filtresiz)"}
                                method={"POST"}
                                url={"https://api-ledgerise.onrender.com/subcollection/get-all-items-collection?nftAddress=${nftAddress}&subcollectionId=${itemId}&priceFilter=${priceFilter}&availableEditionsFilter=${availableEditionsFilter}"}
                                description={"Bu metod kapsamında bir bağış kampanyasının altındaki bağış ürünlerini sorgulayabilirsiniz."}
                                importantNote={"Otorizasyona gerek yoktur."}
                                parameters={[
                                  ["nftAddress", "string", "Bağış kampanyasının nftAddress değeri.", true],
                                  ["subcollectionId", "string", "Bağış kampanyasının itemId'si değeri.", true],
                                ]}
                                resEx={[["activeItems", "Array", [
                                  ["seller", "string"],
                                  ["nftAddress", "string"],
                                  ["tokenId", "number"],
                                  ["charityAddress", "string"],
                                  ["tokenUri", "string"],
                                  ["price", "string"],
                                  ["availableEditions", "string"],
                                  ["subcollectionId", "string"],
                                  ["history", "Array", [
                                    ["event", "string"],
                                    ["date", "string"],
                                    ["price", "string"],
                                    ["buyer", "string"],
                                    ["openseaTokenId", "number"],
                                    ["transactionHash", "string"],
                                  ]],
                                  ["attributes", "Array", [
                                    ["trait_type", "string"],
                                    ["value", "number"]
                                  ]],
                                  ["real_item_history", "Array", [
                                    ["key", "string"],
                                    ["buyer", "string"],
                                    ["openseaTokenId", "number"],
                                    ["date", "string"],
                                    ["location", "object"],
                                    ["transactionHash", "string"],
                                    ["visualVerificationTokenId", "number"]
                                  ]],
                                  ["route", "Array", [
                                    ["stampLocation", "location"],
                                    ["shippedLocation", "location"]
                                    ["deliveryLocation", "location"]
                                  ]],
                                  ["listTransactionHash", "string"],
                                ]]]}
                              />
                              : focusedApiEndpoint == 15
                                ? <ApiSlot
                                title={"Kampanya yarat"}
                                method={"POST"}
                                url={"https://api-ledgerise.onrender.com/subcollection/create-subcollection"}
                                description={"Bu metod şirketiniz bünyesinde bir yardım kampanyası başlatabilirsiniz. Otorizasyon gerekiyor. Şirket (login) sekmesine tıklayın. Login olduktan sonra bu api üzerinden kampanya başlatabilirsiniz."}
                                importantNote={"*Önemli body'de formData formatını kullanmalısınız."}
                                parameters={[
                                  ["name", "string", "Bağış kampanyasının ismi.", true],
                                  ["image", "string", "Bağış kampanyasının base64 string formatındaki görseli", true],
                                  ["companyCode", "string", "Şirket kodunuz. Şirketinizin companyCode değeri.", true],
                                ]}
                                resEx={[
                                  ["itemId", "string"],
                                  ["name", "number"],
                                  ["companyCode", "string"],
                                  ["nftAddress", "string"],
                                  ["properties", "array"],
                                  ["image", "base64"],
                                  ["totalRaised", "string"],
                                  ["marketplaceAddress", "string"],
                                  ["providerUrl", "string"],
                                  ["ledgeriseLensAddress", "string"],
                                  ["transactionHash", "string"
                                ]]}
                                header={"formdata"}
                              />
                                : focusedApiEndpoint == 16
                                  ? <ApiSlot
                                  title={"Kampanya görselini güncelle"}
                                  method={"POST"}
                                  url={"https://api-ledgerise.onrender.com/subcollection/update-subcollection-image"}
                                  description={"Daha önceden başlattığınız bir kampanyanın görselini güncelleyebilirsiniz. Otorizasyon gerekiyor. Şirket (login) sekmesine tıklayın. Login olduktan sonra bu api üzerinden kampanya başlatabilirsiniz."}
                                  importantNote={"*Önemli body'de formData formatını kullanmalısınız."}
                                  header={"formdata"}
                                  parameters={[
                                    ["nftAddress", "string", "Kampanyanın NFT adresi (nftAdress değeri).", true],
                                    ["image", "string", "Bağış kampanyasının base64 string formatındaki görseli", true],
                                    ["subcollectionId", "string", "Kampanyanın itemId'si.", true],
                                  ]}
                                  resEx={[
                                    ["itemId", "string"],
                                    ["name", "number"],
                                    ["companyCode", "string"],
                                    ["nftAddress", "string"],
                                    ["properties", "array"],
                                    ["image", "base64"],
                                    ["totalRaised", "string"],
                                    ["marketplaceAddress", "string"],
                                    ["providerUrl", "string"],
                                    ["ledgeriseLensAddress", "string"],
                                    ["transactionHash", "string"
                                  ]]}
                                />
                                  : focusedApiEndpoint == 17
                                    ? <ApiSlot 
                                      title={"Bağışçı (register)"}
                                      url={"https://api-ledgerise.onrender.com/auth/register"}
                                      method={"POST"}
                                      description={"Ledgerise'da bir bağışçı oluşturmaya yarar. Mevcut sisteminizdekşi register fonksiyonundan sonra çağırabilirsiniz."}
                                      importantNote={"Otorizasyona gerek yok"}
                                      parameters={[
                                        ["email", "string", "Bağışçının eposta adresi.", true],
                                        ["phone_number", "string", "Bağışçının telefon numarası.", true],
                                        ["password", "string", "Bağışçının şifresi.", true]
                                      ]}
                                      resEx={[
                                        ["email", "string"],
                                        ["phone_number", "string"],
                                      ]}
                                    />
                                    : focusedApiEndpoint == 18
                                    ? <ApiSlot 
                                    title={"Bağışçı (login)"}
                                    url={"https://api-ledgerise.onrender.com/auth/login"}
                                    method={"POST"}
                                    description={"Bağışçıları ilgilendiren çeşitli operasyonları gerçekleştirmeden önce login işlemi gerçekleşmeli. Hali hazırda kendi sisteminiz için bulunan login komutundan sonra çağırabilirsiniz."}
                                    importantNote={"Otorizasyona gerek yok"}
                                    parameters={[
                                      ["email", "string", "Bağışçının eposta adresi.", true],
                                      ["password", "string", "Bağışçının şifresi.", true]
                                    ]}
                                    resEx={[
                                      ["email", "string"],
                                      ["phone_number", "string"],
                                    ]}
                                  />
                                    : focusedApiEndpoint == 19
                                    ? <ApiSlot 
                                    title={"İhtiyaç sahibi (register)"}
                                    url={"https://api-ledgerise.onrender.com/auth/register-beneficiary"}
                                    method={"POST"}
                                    description={"Ledgerise sisteminde bir ihtiyaç sahibi yaratmaya yarar. Hali hazırda kendi sisteminiz için bulunan register komutundan sonra çağırabilirsiniz."}
                                    importantNote={"Otorizasyona gerek yok"}
                                    parameters={[
                                      ["name", "string", "İhtiyaç sahibinin adı ve soyadı", true],
                                      ["national_id_number", "string", "İhtiyaç sahibinin T.C. kimlik numarası.", true],
                                      ["password", "string", "İhtiyaç sahibinin şifresi.", true],
                                      ["email", "string", "İhtiyaç sahibinin eposta adresi.", true],
                                      ["phone_number", "string", "İhtiyaç sahibinin telefon numarası.", true],
                                      ["nftAddress", "string", "İhtiyaç sahibinin dahil olduğu bağış kampanyasının nft adresi (nftAddress).", true],
                                      ["subcollectionId", "number", "İhtiyaç sahibinin dahil olduğu bağış kampanyasının itemId'si.", true],
                                    ]}
                                    resEx={[
                                      ["name", "string"],
                                      ["national_id_number", "string"],
                                      ["email", "string"],
                                      ["phone_number", "string"],
                                      ["nftAddress", "string"],
                                      ["subcollectionId", "number"]
                                    ]}
                                  />
                                    : focusedApiEndpoint == 20
                                    ? <ApiSlot 
                                    title={"İhtiyaç sahibi (login)"}
                                    url={"https://api-ledgerise.onrender.com/auth/login-beneficiary"}
                                    method={"POST"}
                                    description={"İhtiyaç sahiplerini ilgilendiren çeşitli operasyonları gerçekleştirmeden önce login işlemi gerçekleşmeli. Hali hazırda kendi sisteminiz için bulunan login komutundan sonra çağırabilirsiniz."}
                                    importantNote={"Otorizasyona gerek yok"}
                                    parameters={[
                                      ["national_id_number", "number", "İhtiyaç sahibinin T.C. kimlik numarası.", true],
                                      ["password", "string", "İhtiyaç sahibinin şifresi.", true]
                                    ]}
                                    resEx={[
                                      ["name", "string"],
                                      ["national_id_number", "string"],
                                      ["email", "string"],
                                      ["phone_number", "string"],
                                      ["nftAddress", "string"],
                                      ["subcollectionId", "number"],
                                      ["needs", "Array", 
                                        [["needId", "ObjectId"]]
                                      ]
                                    ]}
                                  />
                                    : focusedApiEndpoint == 21
                                    ? <ApiSlot 
                                    title={"Şirket (login)"}
                                    url={"https://api-ledgerise.onrender.com/auth/login-company"}
                                    method={"POST"}
                                    description={"Şirket hesabınız üzerinden gerçekleştirmek istediğiniz işlemler öncesinde login olmanız gerek."}
                                    importantNote={"*Ledgerise'a entegrasyon başvurusunda bulunduğunuzda tarafınıza temin edilen şirket kodu (companyCode) ve şifre (password) ile login olabilirsiniz."}
                                    parameters={[
                                      ["code", "string", "Şirketinizin şirket kodu.", true],
                                      ["password", "string", "Şirketinizin şifresi.", true]
                                    ]}
                                    resEx={[
                                      ["name", "string"],
                                      ["code", "string"],
                                      ["image", "base64"],
                                      ["charityAddress", "string"],
                                      ["IBAN", "string"],
                                      ["receipientName", "string"],
                                      ["receipientDescription", "string"],
                                      ["bankName", "string"]
                                    ]}
                                  />
                                    : focusedApiEndpoint == 22
                                      ? <ApiSlot
                                        title={"Kampanyalarınızı sorgulayın"}
                                        url={"https://api-ledgerise.onrender.com/company/get-all-collections"}
                                        description={"Şirketinizin yürütmekte olduğu bütün bağış kampanyalarına ulaşabilirsiniz."}
                                        method={"POST"}
                                        importantNote={"*Şirket olarak login olduktan sonra bu detaylara ulaşabilirsiniz. Otorizasyon gerekiyor."}
                                        parameters={[]}
                                        resEx={[["subcollections", "Array", [
                                          ["itemId", "string"],
                                          ["name", "number"],
                                          ["companyCode", "string"],
                                          ["nftAddress", "string"],
                                          ["properties", "Array"],
                                          ["collectionName", "string"],
                                          ["image", "base64"],
                                          ["totalRaised", "string"],
                                          ["marketplaceAddress", "string"],
                                          ["providerUrl", "string"],
                                          ["ledgeriseLensAddress", "string"],
                                          ["transactionHash", "string"]
                                        ]]]}
                                      />
                                      : focusedApiEndpoint == 23
                                      ? <ApiSlot
                                      title={"Şirket detayları"}
                                      method={"POST"}
                                      url={"https://api-ledgerise.onrender.com/company/get-company-from-code"}
                                      description={"Şirketinizin detaylarına ulaşabilirsiniz."}
                                      importantNote={"Otorizasyona gerek yok."}
                                      parameters={[
                                        ["code", "string", "Şirketinizin kurum kodu", true]
                                      ]}
                                      resEx={[
                                        ["name", "string"],
                                        ["code", "string"],
                                        ["image", "base64"],
                                        ["charityAddress", "string"],
                                        ["IBAN", "string"],
                                        ["receipientName", "string"],
                                        ["receipientDescription", "string"],
                                        ["bankName", "string"]
                                      ]}
                                    />
                                      : focusedApiEndpoint == 24
                                      ? <ApiSlot
                                      title={"Şirket ismi sorgula"}
                                      method={"POST"}
                                      url={"https://api-ledgerise.onrender.com/company/get-name-from-code"}
                                      description={"Şirketinizin kurum kodundan ismine ulaşabilirsiniz."}
                                      importantNote={"Otorizasyona gerek yok."}
                                      parameters={[
                                        ["code", "string", "Şirketinizin kurum kodu", true]
                                      ]}
                                      resEx={[
                                        ["name", "string"]
                                      ]}
                                    />
                                      : focusedApiEndpoint == 25
                                      ? <ApiSlot
                                      title={"Bağış ürünlerinizi sorgulayın"}
                                      method={"POST"}
                                      url={"https://api-ledgerise.onrender.com/company/get-all-items"}
                                      description={"Şirketiniz bütün bağış kampanyaları kapsamındaki bütün bağış ürünlerini sorgulayabilirsiniz."}
                                      importantNote={"Otorizasyona gerek yok."}
                                      parameters={[
                                        ["code", "string", "Şirketinizin kurum kodu", true]
                                      ]}
                                      resEx={[["activeItems", "Array", [
                                        ["seller", "string"],
                                        ["nftAddress", "string"],
                                        ["tokenId", "number"],
                                        ["charityAddress", "string"],
                                        ["tokenUri", "string"],
                                        ["price", "string"],
                                        ["availableEditions", "string"],
                                        ["subcollectionId", "string"],
                                        ["history", "Array", [
                                          ["event", "string"],
                                          ["date", "string"],
                                          ["price", "string"],
                                          ["buyer", "string"],
                                          ["openseaTokenId", "number"],
                                          ["transactionHash", "string"],
                                        ]],
                                        ["attributes", "Array", [
                                          ["trait_type", "string"],
                                          ["value", "number"]
                                        ]],
                                        ["real_item_history", "Array", [
                                          ["key", "string"],
                                          ["buyer", "string"],
                                          ["openseaTokenId", "number"],
                                          ["date", "string"],
                                          ["location", "object"],
                                          ["transactionHash", "string"],
                                          ["visualVerificationTokenId", "number"]
                                        ]],
                                        ["route", "Array", [
                                          ["stampLocation", "location"],
                                          ["shippedLocation", "location"]
                                          ["deliveryLocation", "location"]
                                        ]],
                                        ["listTransactionHash", "string"],
                                      ]]]}
                                    />
                                      : focusedApiEndpoint == 26
                                      ? <ApiSlot
                                      title={"Depo lokasyonu sorgula"}
                                      method={"POST"}
                                      url={"https://api-ledgerise.onrender.com/depot/get-depot-location"}
                                      description={"Herhangi bir deponun isminden koordinat formatındaki lokasyonuna ulaşabilirsiniz."}
                                      importantNote={"Otorizasyona gerek yok."}
                                      parameters={[
                                        ["depotName", "string", "Deponun tarafınızda kayıtlı bulunduğu ismi", true]
                                      ]}
                                      resEx={[
                                        ["location", "Array", [
                                          ["latitude", "number"],
                                          ["longitude", "number"],
                                        ]]
                                      ]}
                                    />
                                      : focusedApiEndpoint == 27
                                      ? <ApiSlot
                                      title={"Fatura bilgisi sorgula"}
                                      method={"POST"}
                                      url={"https://api-ledgerise.onrender.com/donor/get-receipt-data"}
                                      description={"Herhangi bir fatura veya sanal makbuz oluşturmak istiyorsanız bu metod ile bir fatura için gerekli bilgileri sorgulayabilirsiniz."}
                                      importantNote={"Otorizasyon gerekiyor. Bağışçının daha önceden ledgerise'a login olması gerekli. Daha fazlası için bağışçı (login) sekmesine tıklayın."}
                                      parameters={[
                                        ["nftAddress", "string", "Bağış ürününün kayıtlı olduğu nft adresi (nftAddress değeri)", true],
                                        ["buyer", "string", "Bağış ürününü bağışlayan kişinin telefon numarası", true],
                                        ["tokenId", "string", "Bağış ürününün blockchain id'si (tokenId değeri)", true],
                                        ["openseaTokenId", "string", "Satın alma numarası yerine geçer.", true]
                                      ]}
                                      resEx={[
                                        ["key", "string"],
                                        ["date", "string"],
                                        ["price", "number"],
                                        ["openseaTokenId", "number"],
                                        ["subcollectionId", "number"]
                                      ]}
                                    />
                                    : focusedApiEndpoint == 28
                                    ? <ApiSlot
                                    title={"Raporları sorgula"}
                                    method={"GET"}
                                    url={"https://api-ledgerise.onrender.com/reports/get-past?reporter=${reporter}"}
                                    description={"Bir aksaklık olduğunda bağışçılar doğrudan blockchain üzerinden bir sorun bildirebilirler. Bu şekilde şikayetleri manipüle edilemez. Belli bir bağışçının oluşturduğu raporları sorgulayabilirsiniz."}
                                    importantNote={"Otorizasyon gerekmiyor."}
                                    parameters={[
                                      ["reporter", "string", "Raporu oluşturan bağışçının telefon numarası", true]
                                    ]}
                                    resEx={[
                                      ["reports", "Array", [
                                        ["reporter", "string"],
                                        ["message", "string"],
                                        ["reportCodes", "Array"],
                                        ["timestamp", "string"],
                                        ["transaction_hash", "string"],
                                      ]]
                                    ]}
                                  />
                                  : focusedApiEndpoint == 29
                                  ? <ApiSlot
                                  title={"Rapor & sorun bildir"}
                                  method={"POST"}
                                  url={"https://api-ledgerise.onrender.com/reports/report-issue"}
                                  description={"Bir aksaklık olduğunda bağışçılar doğrudan blockchain üzerinden bir sorun bildirebilirler. Bu şekilde şikayetleri manipüle edilemez. Belli bir bağışçının oluşturduğu raporları sorgulayabilirsiniz."}
                                  importantNote={"Otorizasyon gerekmiyor."}
                                  parameters={[
                                    ["reporter", "string", "Raporu oluşturan bağışçının telefon numarası", true],
                                    ["message", "string", "Karşılaşılan sorunu detaylı anlatan mesaj.", true],
                                    ["reportCodes", "array", "0: uzun süredir verifikasyon gelmemesi, 1: alakasız görsel, 2: kutunun boyutları yanlış, 3: diğer", true],
                                    ["timestamp", "string", "Raporun bildirildiği zaman", true],
                                  ]}
                                  resEx={[
                                    ["reporter", "string"],
                                    ["message", "string"],
                                    ["reportCodes", "Array", [
                                      ["reportCode", "number"]
                                    ]],
                                    ["timestamp", "string"],
                                    ["transaction_hash", "string"]
                                  ]}
                                />
                                : focusedApiEndpoint == 30
                                ? <ApiSlot
                                title={"İhtiyaçları filtrele"}
                                method={"POST"}
                                url={"https://api-ledgerise.onrender.com/need/get-all-needs"}
                                description={"Başvuruda bulunulan ihtiyaçları filtreleyebilir ve detayları sorgulayabilirsiniz"}
                                importantNote={"Otorizasyon gerekmiyor."}
                                parameters={[
                                  ["needTokenId", "string", "İhtiyaçların blockchain id'si", false],
                                  ["beneficiaryPhoneNumber", "string", "İhtiyaç sahibinin telefon numarası", false],
                                  ["beneficiary_id", "ObjectId", "İhtiyaç sahibinin veritabanı id'si", false],
                                  ["nftAddress", "ObjectId", "İhtiyaç başvurusunun gerçekleştiği nft adresi. İhtiyaç başvurusunun gerçekleştiği bağış kampanyasının nft adresi.", false],
                                  ["subcollectionId", "ObjectId", "İhtiyaç başvurusunun gerçekleştiği bağış kampanyasının itemId'si.", false],
                                ]}
                                resEx={[["needs", "Array", [
                                  ["needTokenId", "number"],
                                  ["name", "string"],
                                  ["description", "string"],
                                  ["quantity", "number"],
                                  ["beneficiaryPhoneNumber", "string"],
                                  ["timestamp", "string"],
                                  ["currentSatisfiedNeedQuantity", "number"],
                                  ["beneficiary_id", "string"],
                                  ["transactionHash", "string"],
                                  ["timestamp", "string"],
                                  ["location", "object"],
                                  ["marketplaceAddress", "String"],
                                  ["ledgeriseLensAddress", "string"],
                                  ["providerUrl", "string"],
                                  ["nftAddress", "string"],
                                  ["subcollectionId", "number"]  
                                ]]]}
                              />
                              : focusedApiEndpoint == 31
                              ? <ApiSlot
                              title={"İhtiyaç başvurusu"}
                              method={"POST"}
                              url={"https://api-ledgerise.onrender.com/need/create"}
                              description={"İhtiyaç başvurusunu ledgerise sistemine işlemek için bu metodu çağırmalısınız. Mevcut sisteminizdeki ihtiyaç başvurusu metodundan sonra kullanınız."}
                              importantNote={"Otorizasyon gerekiyor. İhtiyaç sahibinin bu metodu çağırmadan önce login olması gerekmektedir. Detaylar için ihtiyaç sahibi (login) sekmesine göz atın."}
                              parameters={[
                                ["beneficiaryPhoneNumber", "string", "İhtiyaç sahibinin telefon numarası", true],
                                ["beneficiary_id", "ObjectId", "İhtiyaç sahibinin veritabanı id'si", true],
                                ["name", "string", "İhtiyacın ismi. Bilgisayar, telefon gibi...", true],
                                ["description", "string", "İhtiyaç başvurusunun detaylı açıklaması.", true],
                                ["quantity", "number", "Söz konusu ihtiyacın miktarı.", true],
                                ["latitude", "number", "Enlem değerinin 1000 ile çarpılmış hali. 40.123: 40123 olarak girilmeli.", true],
                                ["longitude", "number", "Boylam değerinin 1000 ile çarpılmış hali. 40.123: 40123 olarak girilmeli.", true],
                              ]}
                              resEx={[
                                ["needTokenId", "number"],
                                ["name", "string"],
                                ["description", "string"],
                                ["quantity", "number"],
                                ["beneficiaryPhoneNumber", "string"],
                                ["timestamp", "string"],
                                ["currentSatisfiedNeedQuantity", "number"],
                                ["beneficiary_id", "string"],
                                ["transactionHash", "string"],
                                ["timestamp", "string"],
                                ["location", "object"],
                                ["marketplaceAddress", "String"],
                                ["ledgeriseLensAddress", "string"],
                                ["providerUrl", "string"],
                                ["nftAddress", "string"],
                                ["subcollectionId", "number"]  
                              ]}
                            />
                            : focusedApiEndpoint == 32
                            ? <ApiSlot
                            title={"İhtiyacı karşıla"}
                            method={"POST"}
                            url={"https://api-ledgerise.onrender.com/need/list-need-item"}
                            description={"Bir ihtiyaç bir online market üzerinden karşılandığında (Hepsiburada, Trendyol gibi) ihtiyacın karşılandığı ürünün bilgileri ledgerise'a kaydedilir ve bağışçıya izlenilebilirlik sağlanır."}
                            importantNote={"Otorizasyon gerekiyor. Bağışçının bu metodu çağırmadan önce login olması gerekmektedir. Detaylar için bağışçı (login) sekmesine göz atın."}
                            parameters={[
                              ["needId", "ObjectId", "Karşılanan ihtiyacın ledgerise veritabanındaki ObjectId'si (_id)", true],
                              ["beneficiaryAddress", "string", "İhtiyaç sahibinin ev adresi", true],
                              ["depotAddress", "string", "Ürünün yola çıktığı deponun adresi. Kargo şirketi tarafından temin edilecek.", true],
                              ["donorPhoneNumber", "string", "Bağışçının telefon numarası", true],
                              ["description", "string", "İhtiyaç başvurusunun detaylı açıklaması.", true],
                              ["quantitySatisfied", "number", "İhtiyacın ne kadarının karşılandığını belirten sayı.", true],
                              ["orderNumber", "string", "İhtiyaç online market üzerinden gönderildiğinde online market tarafından oluşturulan sipariş numarası", true],
                              ["price", "number", "İhtiyaç sahibine gönderilen ürünün fiyatı.", true],
                              ["tokenUri", "string", "İhtiyaç sahibine gönderilen ürünün tokenUri'si. Ürünün kimliğini temsil eder. *Önemli: Bu metodu çağırmadan önce tokenUri oluşturmalısınız. tokenUri oluştur sekmesinden detaylara ulaşabilirsiniz.", true]
                            ]}
                            resEx={[
                              ["seller", "string"],
                              ["nftAddress", "string"],
                              ["tokenId", "number"],
                              ["charityAddress", "string"],
                              ["tokenUri", "string"],
                              ["price", "string"],
                              ["availableEditions", "string"],
                              ["subcollectionId", "string"],
                              ["history", "Array", [
                                ["event", "string"],
                                ["date", "string"],
                                ["price", "string"],
                                ["buyer", "string"],
                                ["openseaTokenId", "number"],
                                ["transactionHash", "string"],
                              ]],
                              ["listTransactionHash", "string"],
                              ["needDetails", "ObjectId"]
                            ]}
                          />
                          : focusedApiEndpoint == 33
                            ? <ApiSlot 
                              title={"İhtiyacın karşılandığı ürünün detaylarını sorgula"}
                              url={"https://api-ledgerise.onrender.com/need/get-need-item-need-details?needDetailsId=${needDetailsId}"}
                              method={"GET"}
                              description={"Online pazaryeri üzerinden gönderilen ihtiyaç ürünlerinin gönderim hakkındaki detaylarına ulaşabilirsiniz."}
                              importantNote={"Otorizasyon gerekiyor. Bağışçı bu metodu çağırmadan önce login olmalı. Detaylar için bağışçı (login) sekmesine tıklayın."}
                              parameters={[
                                ["needDetailsId", "ObjectId", "Ledgerise veritabanında NeedDetail modeline ait objenin veritabanı id'si", true]
                              ]}
                              resEx={[
                                ["beneficiaryPhoneNumber", "string"],
                                ["depotAddress", "string"],
                                ["beneficiaryAddress", "string"],
                                ["orderNumber", "string"],
                                ["donorPhoneNumber", "string"],
                                ["donateTimestamp", "number"],
                                ["needTokenId", "number"],
                                ["quantitySatisfied", "number"]
                              ]}
                            />
                            : focusedApiEndpoint == 34
                              ? <ApiSlot 
                                  title={"Bağışçının karşıladığı ihtiyaçları sorgula"}
                                  method={"GET"}
                                  url={"https://api-ledgerise.onrender.com/need/get-satisfied-donations-of-donor?buyer=${buyer}"}
                                  description={"Bir bağışçının karşıladığı ihtiyaçların detaylarını listele."}
                                  importantNote={"Otorizasyona gerek yok"}
                                  parameters={[
                                    ["buyer", "string", "Bağışçının telefon numarası.", true]
                                  ]}
                                  resEx={[["needs", "Array", [
                                    ["needTokenId", "number"],
                                    ["name", "string"],
                                    ["description", "string"],
                                    ["quantity", "number"],
                                    ["beneficiaryPhoneNumber", "string"],
                                    ["timestamp", "string"],
                                    ["currentSatisfiedNeedQuantity", "number"],
                                    ["beneficiary_id", "string"],
                                    ["transactionHash", "string"],
                                    ["timestamp", "string"],
                                    ["location", "object"],
                                    ["marketplaceAddress", "String"],
                                    ["ledgeriseLensAddress", "string"],
                                    ["providerUrl", "string"],
                                    ["nftAddress", "string"],
                                    ["subcollectionId", "number"]  
                                  ]]]}
                               />
                              : focusedApiEndpoint == 35
                                ? <ApiSlot 
                                title={"Bağışçının karşıladığı ihtiyaçları sorgula"}
                                method={"GET"}
                                url={"https://api-ledgerise.onrender.com/need/get-needs-of-beneficiary?beneficiary_id=${beneficiary_id}"}
                                description={"Bir ihtiyaç sahibinin başvuruda bulunduğu bütün ihtiyaçları sorgulayın."}
                                importantNote={"Otorizasyon gerekli. İhtiyaç sahibi bu metodu çağırmadan önce login olmalı. Detaylar için İhtiyaç sahibi (login) sekmesine tıklayın."}
                                parameters={[
                                  ["beneficiary_id", "string", "İhtiyaç sahibinin Ledgerise veritabanındaki ObjectId'si (_id).", true]
                                ]}
                                resEx={[["needs", "Array", [
                                  ["needTokenId", "number"],
                                  ["name", "string"],
                                  ["description", "string"],
                                  ["quantity", "number"],
                                  ["beneficiaryPhoneNumber", "string"],
                                  ["timestamp", "string"],
                                  ["currentSatisfiedNeedQuantity", "number"],
                                  ["beneficiary_id", "string"],
                                  ["transactionHash", "string"],
                                  ["timestamp", "string"],
                                  ["location", "object"],
                                  ["marketplaceAddress", "String"],
                                  ["ledgeriseLensAddress", "string"],
                                  ["providerUrl", "string"],
                                  ["nftAddress", "string"],
                                  ["subcollectionId", "number"]  
                                ]]]}
                              />
                                : focusedApiEndpoint == 36
                                  ? <ApiSlot
                                    title={"Bağışla (ödeme gerçekleşmiş)"}
                                    url={"https://api-ledgerise.onrender.com/donate/payment/already_bought"}
                                    method={"POST"}
                                    description={"Bağış toplamak için daha önceden kurulu bir ödeme sisteminiz varsa ödeme başarıyla gerçekleştikten sonra bu metodu çağırmanız gerekiyor."}
                                    importantNote={"Otorizasyon gerekiyor. Bağışçı bu metodu çağırmadan önce login olmalı. Detaylar için Bağışçı (login) sekmesine tıklayın"}
                                    parameters={[
                                      ["nftAddress", "string", "Bağış ürününün nftAdress değeri. Bağlı olduğu kampanyanın ve kendisinin nft adresi.", true],
                                      ["tokenId", "string", "Bağış ürününün tokenId'si.", true],
                                      ["phone_number", "string", "Bağışçının telefon numarası.", true]
                                    ]}
                                    resEx={[
                                      ["seller", "string"],
                                      ["nftAddress", "string"],
                                      ["tokenId", "number"],
                                      ["charityAddress", "string"],
                                      ["tokenUri", "string"],
                                      ["price", "string"],
                                      ["availableEditions", "string"],
                                      ["subcollectionId", "string"],
                                      ["history", "Array", [
                                        ["event", "string"],
                                        ["date", "string"],
                                        ["price", "string"],
                                        ["buyer", "string"],
                                        ["openseaTokenId", "number"],
                                        ["transactionHash", "string"],
                                      ]],
                                      ["attributes", "Array", [
                                        ["trait_type", "string"],
                                        ["value", "number"]
                                      ]],
                                      ["real_item_history", "Array", [
                                        ["key", "string"],
                                        ["buyer", "string"],
                                        ["openseaTokenId", "number"],
                                        ["date", "string"],
                                        ["location", "object"],
                                        ["transactionHash", "string"],
                                        ["visualVerificationTokenId", "number"]
                                      ]],
                                      ["route", "Array", [
                                        ["stampLocation", "location"],
                                        ["shippedLocation", "location"]
                                        ["deliveryLocation", "location"]
                                      ]],
                                      ["listTransactionHash", "string"]
                                    ]}
                                  />
                                    : focusedApiEndpoint == 37
                                    ? <ApiSlot
                                    title={"Bağışla (kredi kartı)"}
                                    url={"https://api-ledgerise.onrender.com/donate/payment/TRY"}
                                    method={"POST"}
                                    description={"Kredi kartı ile bağış ürününü almak için bu metodu kullanabilirsiniz."}
                                    importantNote={"Otorizasyon gerekiyor. Bağışçı bu metodu çağırmadan önce login olmalı. Detaylar için Bağışçı (login) sekmesine tıklayın"}
                                    parameters={[
                                      ["nftAddress", "string", "Bağış ürününün nftAdress değeri. Bağlı olduğu kampanyanın ve kendisinin nft adresi.", true],
                                      ["tokenId", "string", "Bağış ürününün tokenId'si.", true],
                                      ["donorId", "ObjectId", "Bağışçının ledgerise veritabanındaki ObjectId'si (_id).", true],
                                      ["cardHolderName", "string", "Kredi kartı sahibinin ismi", true], 
                                      ["cardNumber", "string", "Kredi kartı numarası", true], 
                                      ["expiryMonth", "string", "Kartın son geçerlilik ayı", true], 
                                      ["expiryYear", "string", "Kartın son geçerlilik yılı", true], 
                                      ["CVV", "string", "Kartın CVV numarası", true], 
                                      ["tokenName", "string", "Ürünün ismi", true]
                                    ]}
                                    resEx={[
                                      ["seller", "string"],
                                      ["nftAddress", "string"],
                                      ["tokenId", "number"],
                                      ["charityAddress", "string"],
                                      ["tokenUri", "string"],
                                      ["price", "string"],
                                      ["availableEditions", "string"],
                                      ["subcollectionId", "string"],
                                      ["history", "Array", [
                                        ["event", "string"],
                                        ["date", "string"],
                                        ["price", "string"],
                                        ["buyer", "string"],
                                        ["openseaTokenId", "number"],
                                        ["transactionHash", "string"],
                                      ]],
                                      ["attributes", "Array", [
                                        ["trait_type", "string"],
                                        ["value", "number"]
                                      ]],
                                      ["real_item_history", "Array", [
                                        ["key", "string"],
                                        ["buyer", "string"],
                                        ["openseaTokenId", "number"],
                                        ["date", "string"],
                                        ["location", "object"],
                                        ["transactionHash", "string"],
                                        ["visualVerificationTokenId", "number"]
                                      ]],
                                      ["route", "Array", [
                                        ["stampLocation", "location"],
                                        ["shippedLocation", "location"]
                                        ["deliveryLocation", "location"]
                                      ]],
                                      ["listTransactionHash", "string"]
                                    ]}
                                  />
                                    : focusedApiEndpoint == 38
                                      ? <ApiSlot
                                      title={"Bağışla (kripto)"}
                                      url={"https://api-ledgerise.onrender.com/donate/payment/crypto/eth"}
                                      method={"POST"}
                                      description={"Kripto ile bağış almak için bu metodu kullanabilirsiniz."}
                                      importantNote={"Otorizasyon gerekiyor. Bağışçı bu metodu çağırmadan önce login olmalı. Detaylar için Bağışçı (login) sekmesine tıklayın"}
                                      parameters={[
                                        ["nftAddress", "string", "Bağış ürününün nftAdress değeri. Bağlı olduğu kampanyanın ve kendisinin nft adresi.", true],
                                        ["tokenId", "string", "Bağış ürününün tokenId'si.", true],
                                        ["ownerAddressString", "ObjectId", "Bağışçının telefon numarası.", true]
                                      ]}
                                      resEx={[
                                        ["seller", "string"],
                                        ["nftAddress", "string"],
                                        ["tokenId", "number"],
                                        ["charityAddress", "string"],
                                        ["tokenUri", "string"],
                                        ["price", "string"],
                                        ["availableEditions", "string"],
                                        ["subcollectionId", "string"],
                                        ["history", "Array", [
                                          ["event", "string"],
                                          ["date", "string"],
                                          ["price", "string"],
                                          ["buyer", "string"],
                                          ["openseaTokenId", "number"],
                                          ["transactionHash", "string"],
                                        ]],
                                        ["attributes", "Array", [
                                          ["trait_type", "string"],
                                          ["value", "number"]
                                        ]],
                                        ["real_item_history", "Array", [
                                          ["key", "string"],
                                          ["buyer", "string"],
                                          ["openseaTokenId", "number"],
                                          ["date", "string"],
                                          ["location", "object"],
                                          ["transactionHash", "string"],
                                          ["visualVerificationTokenId", "number"]
                                        ]],
                                        ["route", "Array", [
                                          ["stampLocation", "location"],
                                          ["shippedLocation", "location"]
                                          ["deliveryLocation", "location"]
                                        ]],
                                        ["listTransactionHash", "string"]
                                      ]}
                                    />
                                      : focusedApiEndpoint == 39
                                        ? <ApiSlot
                                          title={"tokenUri filtrele"}
                                          method={"GET"}
                                          url={"https://api-ledgerise.onrender.com/tokenuri/get-all?companyCode=${companyCode}"}
                                          description={"Önceden yarattığınız tokenUri'leri filtreleyip bağış ürünü listelemelerinde kullanabilirsiniz."}
                                          importantNote={"Otorizasyona gerek yok."}
                                          parameters={[
                                            ["companyCode", "string", "Şirketinizin kurum kodu. Önceden oluşturduğunuz tokenUri'leri filtreleyin.", true]
                                          ]}
                                          resEx={[
                                            ["_id", "ObjectId"],
                                            ["name", "string"],
                                            ["tokenUri", "string"],
                                            ["companyCode", "string"]
                                          ]}
                                        />
                                        : focusedApiEndpoint == 40
                                          ? <ApiSlot
                                            title={"tokenUri oluştur"}
                                            method={"POST"}
                                            url={"https://api-ledgerise.onrender.com/tokenuri/create"}
                                            description={"TokenUri'ler bir ürünün kimliğini temsil eder. Resim ve özellikler gibi veriler içerir. TokenUri gereken işlemlerden önce bu metod ile tokenUri oluşturmanız gerekir."}
                                            importantNote={"Otorizasyon gerekiyor. Bu metodu çağırmadan önce şirket olarak login olmalısınız. Detaylar için Şirket (login) sekmesine tıklayın. *Önemli: Body formData formatında olmalı."}
                                            parameters={[
                                              ["image", "base64_string", "Ürünü temsil eden görsel.", true],
                                              ["name", "string", "Ürünün ismi.", true],
                                              ["description", "string", "Ürünün detaylı açıklaması.", true],
                                              ["attributes", "string", "Ürünün özellikleri. Bu formatta yazmanız gerekiyor: 'özellik_ismi:10,ozellik_ismi:15,özellik_ismi:20'", true]
                                            ]}
                                            resEx={[
                                              ["_id", "ObjectId"],
                                              ["name", "string"],
                                              ["tokenUri", "string"],
                                              ["companyCode", "string"]
                                            ]}
                                          />
                                          : ("")
          }
      </div>
    </div>
  )
}
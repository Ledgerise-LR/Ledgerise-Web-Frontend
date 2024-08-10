
import { } from "web3uikit";

export default function Home() {

  const questionNumberClassName = "p-4 flex justify-center items-center shadow-md text-gray-600 rounded mr-4 w-12 h-12";
  const questionTextClassName = "text-gray-600 tracking-wide"
  const inputClassName = "p-4 flex justify-center items-center bg-gray-50 w-108 shadow-md mb-2 rounded"
  const selectClassName = "transition-all cursor-pointer hover:bg-gray-100 p-4 w-64 mb-4 flex justify-center items-center shadow-lg text-gray-500 font-medium mx-4 rounded"

  return (
    <div className="w-full h-screen overflow-x-hidden flex p-20 relative overflow-y-scroll">
      <div className="flex flex-col">
        <div className="mb-8">
          <div className="text-gray-600 font-bold text-xl mb-2">İHTİYAÇ BAŞVURUSUNDA BULUNUN</div>
          <div className="text-gray-500 font-light w-72">Aşağıdaki sorulara yanıt vererek ihtiyaç başvurunuzu tamamlayın</div>
        </div>
        <div className="questions">
          <div className="question1 mb-12">
            <div className="flex items-center mb-4">
              <div className={questionNumberClassName}>1</div>
              <div className={questionTextClassName}>Başvuruda gerekli kişisel bilgileriniz.</div>
            </div>
            <div className="inputs">
              <input className={inputClassName} placeholder="Adınız ve soyadınız" type="text" />
              <input className={inputClassName} placeholder="İrtibat numaranız (5XXXXXXXXX)" type="text" />
              <input className={inputClassName} placeholder="Açık ikamet adresiniz" type="text" />
            </div>
          </div>
          <div className="question2 mb-12">
            <div className="flex items-center mb-4">
              <div className={questionNumberClassName}>2</div>
              <div className={questionTextClassName}>Hangi kategoride ihtiyaç başvurusunda bulunmak istiyorsunuz?</div>
            </div>
            <div className="inputs w-108 flex">
              <div className={selectClassName}>Gıda / yiyecek</div>
              <div className={selectClassName}>Tekstil / giyecek</div>
            </div>
          </div>
          <div className="question3 mb-24">
            <div className="flex items-center mb-4">
              <div className={questionNumberClassName}>3</div>
              <div className={questionTextClassName}>İhtiyaç başvurunuzun içeriğini detaylandırabilir misiniz?</div>
            </div>
            <div className="inputs w-108 flex flex-wrap">
              <div className={selectClassName}>Et / et ürünleri</div>
              <div className={selectClassName}>Süt / süt ürünleri</div>
              <div className={selectClassName}>Unlu mamüller</div>
              <div className={selectClassName}>Baklagiller</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-100 h-100 shadow-md ml-auto fixed right-24 rounded-lg p-8">
        <div className="flex w-full justify-end text-sm font-bold text-gray-600">BAŞVURU ÖZETİNİZ</div>
      </div>
    </div>
  )
}

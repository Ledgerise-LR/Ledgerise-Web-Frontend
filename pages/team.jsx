
import Persona from "@/components/persona";

export default function Home() {

  const team = [
    {
      name: "Doğu Boran Şentürk",
      role: "Kurucu Ortak CEO",
      image: "/dogu.png",
      bio: "CEO, ürün yönetiminden sorumludur. Öncesinde, Usersmagic şirketinde yazılım geliştiricisi ve Gonullubul.org'da kurucu olarak çalışmıştır."
    },
    {
      name: "Dolunay Kaya",
      role: "Kurucu Ortak CIO",
      image: "/dolunay.png",
      bio: "CIO, marka yönetiminden sorumludur. Öncesinde Roar TV'de medya editörlüğü ve freelance içerik üreciliği yapmıştır."
    },
    {
      name: "İlayda Özer",
      role: "Kurucu Ortak CMO",
      image: "/ilayda.png",
      bio: "CMO, pazarlama yönetiminden sorumludur. Öncesinde Tiryaki Holding'de finans departmanında çalışmıştır."
    },
    {
      name: "Harun Yahya Demirpençe",
      role: "Kurucu Ortak CTO",
      image: "/harun.png",
      bio: "CTO, teknolojiden sorumludur. Öncesinde KuveytTürk ve ARI24 firmalarında yazılım geliştiricisi olarak çalışmıştır."
    },
  ]

  return (
    <div className='w-full relative flex flex-col overflow-x-visible'>
      <div className='lg:w-full h-full bg-gray-50 max-sm:flex flex-col items-center px-4 xs:px-6 sm:p-6 mb-20'>
        <div className='text-2xl w-8/12 xs:text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-4 mt-24 text-black font-light'>Stok fazlalarının değere dönüştüren ihtiyaç pazaryeri.</div>
        <div className='w-8/12 text-gray-500 text-sm xs:text-base sm:text-lg'>Firmalar stoklarının bir kısmını sene başında indirimli fiyatından listeler. İhtiyaç sahipleri başvurdukları STK'nın onlar için tanımladığı krediler ile ihtiyaç alışverişi yapabilir.</div>
        <div className="mb-20 mt-8">
          <div className="flex gap-4">
            <div className="px-4 py-2 border justify-center items-center rounded flex bg-[#ffa851]">
              <a href="/company">Firma Paneli</a>
            </div>
            <div className="px-4 py-2 justify-center items-center border rounded flex text-[#ffa851]">
              <a href="/api-documentation">API Entegrasyonu</a>
            </div>
          </div>
        </div>
      </div>
      <div className="m-8 text-3xl">Yönetim Kurulu</div>
      <div className='w-full flex justify-center items-center h-fit px-12 relative flex-wrap'>
        {
          team
            ? team.map((member, i) => {
              return(
                <div className={`mb-24 md:mb-36`}>
                  <Persona 
                    name={member.name}
                    image={member.image}
                    role={member.role}
                    bio={member.bio}
                  />
                </div>
              )
            })
            : ("")
        }
      </div>
    </div>
  )
}

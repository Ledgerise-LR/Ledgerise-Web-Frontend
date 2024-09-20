
import Persona from "@/components/persona";

export default function Home() {

  const team = [
    {
      name: "Doğu Boran Şentürk",
      role: "Kurucu Ortak",
      image: "/dogu.jpeg",
      bio: "Ledgerise'ın yazılımı üzerine çalışır. Boş zamanlarında fitness ve latin dans yapmanın yanı sıra baristalık ile uğraşır."
    },
    {
      name: "Dolunay Kaya",
      role: "Pazarlama Asistanı",
      image: "/dolunay.png",
      bio: "Ledgerise'ın müşteri ilişkilerini geliştirir. Gerektiğinde bir yaratıcı, gerektiğinde bir gözlemci olarak ürün geliştirilme sürecini yönetir."
    },
    {
      name: "Nehir Öztürk",
      role: "Medya Asistanı",
      image: "/nehir.png",
      bio: "Boş zamanlarında film izlemeyi, kitap okumayı, müzik dinlemeyi ve sanat üzerine aktiviteler yapan; sosyal bir insan olan Nehir, Ledgerise’ın marka imajını tasarlar."
    },
    {
      name: "İlayda Özer",
      role: "Pazarlama Uzmanı",
      image: "/ilayda.png",
      bio: "Satış sürecini yönetir. Kurumsal dünyanın disiplinini ve genç girişim ruhunu eşzamanlı taşıyarak ürünü, pazara en uygun hale getirir."
    },
    {
      name: "Harun Yahya Demirpençe",
      role: "Yazılım Geliştirici",
      image: "/harun.jpg",
      bio: "Ledgerise'da yazılım geliştirici olarak görev yapar. Ürünümüzün sorunsuz bir şekilde yönetilmesi için çalışır."
    },
  ]

  return (
    <div className='w-full relative flex flex-col overflow-x-visible'>
      <div style={{background: "-webkit-linear-gradient(#FF9900, #B881FF)",}} className='absolute w-60 h-32 top-32 blur-3xl left-0 z-0'></div>
      <div className='lg:w-9/12 max-sm:flex flex-col items-center py-6 px-4 xs:px-6 sm:p-12 z-10'>
        <div className='text-2xl xs:text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-12 text-black font-bold'>STOK FAZLALARININ <div className="shadow-xl bg-yellow-50 my-4 p-2 w-fit text-yellow-600">{"\n"}DEĞERE DÖNÜŞMESİ {"\n"}</div> İÇİN EMİN ADIMLARLA...</div>
        <div className='text-gray-900 text-sm xs:text-base sm:text-lg'>Firmaların stoklarının, kalite ve değer kaybetmeden STK'ların bağışçı kitleleri ile buluşturuyoruz. Bu şekilde firmalar, STK'lar ve bağışçılar için Kazan-Kazan durumu yaratıyoruz. Ledgerise ile STK'ların hali hazırdaki bağışçıları yaptıkları bağışların gerçekten doğru ihtiyaç sahibine ulaştığınından kesinlikle oluyor. Bu sayede ihtiyaç sahiplerine kaliteli ürünler ulaşırken, stok fazlası ürünler firmalarda kayıplara yol açmıyor. Ledgerise bu sayede sürdürülebilir firmalar, gönülleri rahat olan bağışçılar ve mutlu STK'lar inşa ediyor.</div>
      </div>
      <div className='w-full flex justify-center items-center h-fit px-12 relative flex-wrap -mb-36'>
        {
          team
            ? team.map((member, i) => {
              return(
                <div style={{transform: `translateY(${40+(-i*40)}px)`}} className={`mb-24 md:mb-36`}>
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

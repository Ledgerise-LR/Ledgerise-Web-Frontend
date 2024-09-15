
import Persona from "@/components/persona";

export default function Home() {

  const team = [
    {
      name: "Doğu Boran Şentürk",
      role: "Yazılım Geliştirme",
      image: "/dogu.jpeg",
      bio: "Ledgerise'ın yazılımı üzerine çalışır. Boş zamanlarında fitness ve latin dans yapmanın yanı sıra baristalık ile uğraşır."
    },
    {
      name: "Dolunay Kaya",
      role: "Pazarlama & İş Geliştirme",
      image: "/dolunay.png",
      bio: "Ledgerise'ın müşteri ilişkilerini geliştirir. Gerektiğinde bir yaratıcı, gerektiğinde bir gözlemci olarak ürün geliştirilme sürecini yönetir."
    },
    {
      name: "Nehir Öztürk",
      role: "Medya & PR",
      image: "/nehir.png",
      bio: "Boş zamanlarında film izlemeyi, kitap okumayı, müzik dinlemeyi ve sanat üzerine aktiviteler yapan; sosyal bir insan olan Nehir, Ledgerise’ın marka imajını tasarlar."
    },
    {
      name: "İlayda Özer",
      role: "Finans & Satış",
      image: "/ilayda.png",
      bio: "Satış sürecini yönetir. Kurumsal dünyanın disiplinini ve genç girişim ruhunu eşzamanlı taşıyarak ürünü, pazara en uygun hale getirir."
    },
    {
      name: "Harun Yahya Demirpençe",
      role: "Yazılım Geliştirme",
      image: "/harun.jpg",
      bio: "Ledgerise'da yazılım geliştirici olarak görev yapar. Ürünümüzün sorunsuz bir şekilde yönetilmesi için çalışır."
    },
  ]

  return (
    <div className='w-full relative flex flex-col overflow-x-visible mb-12'>
      <div style={{background: "-webkit-linear-gradient(#FF9900, #B881FF)",}} className='absolute w-60 h-32 blur-3xl left-12 top-36 z-0'></div>
      <div className='w-128 p-24 z-10'>
        <div className='mb-4 text-gray-600 font-bold'>MERHABA, EKİBİMİZLE TANIŞIN!</div>
        <div className='text-gray-600'>Biz Ledgerise'da birbirimize çok güveniriz. Her zaman toplum yararına çalışır, enerjimizle arkadaşlarımızı motive ederiz.</div>
      </div>
      <div className='w-full flex justify-center items-center z-30 px-12 -mt-24 relative'>
        <div style={{ width: "120%" }} className='bg-[linear-gradient(0deg,rgba(255,153,0,0.5)_0%,rgba(184,129,255,0.5)_100%)] absolute z-10 h-24 mt-12 -rotate-12'></div>
        {
          team
            ? team.map((member, i) => {
              return(
                <div style={{transform: `translateY(${50+(-i*50)}px)`}} className={`z-30`}>
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
        <div className='w-full h-36 bg-yellow-400 bg-opacity-80 absolute -bottom-12 z-0'></div>
      </div>
    </div>
  )
}

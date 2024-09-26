
import { useEffect, useState } from "react";

export default function CargoCar({ index, animationText, previousWidth, nextWidth }) {


  const [progressBarWidth, setProgressBarWidth] = useState("");

  useEffect(() => {
    console.log(previousWidth);
    console.log(nextWidth);
    setProgressBarWidth(previousWidth);
    setTimeout(() => {
      setProgressBarWidth(nextWidth);
    }, 100)
  }, [])


  return (
    <div>
      <div className="relative flex items-end w-full">
        <div className='mb-1 flex-grow'>{animationText}</div>
        <div 
          className='absolute' 
          style={{ width: progressBarWidth, transition: "all 0.5s ease 0s" }} 
        >
          <img src='kargo.svg' alt='kargo arabası'
            className="flex h-12 absolute -bottom-5 right-0 z-10" 
          />
        </div>
      </div>
      <div className='relative w-full h-8 bg-[#838383] rounded-full overflow-hidden'>
        <div className='absolute w-full h-full flex justify-evenly items-center'>
          {Array.from({ length: 10 }).map(() => (
            <div
              key={index}
              className='h-1 w-6 bg-white'
            ></div>
          ))}
        </div>
        <div 
          className='h-8 bg-black rounded-full'
          style={{ width: progressBarWidth, transition: "all 0.5s ease 0s" }} 
        >
        </div>
      </div>
    </div>
  )
}
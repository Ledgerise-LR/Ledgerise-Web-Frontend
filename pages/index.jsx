import Head from 'next/head'
import Image from 'next/image'
import { Button } from 'web3uikit'

export default function Home() {

  return (
    <div className='w-full h-full p-28'>
      <div className='w-full h-full flex justify-center items-center'>
        <div className='flex flex-1 w-3/5 h-4/5 justify-between'>
          <div className='flex-col'>
            <div>
              <div className='text-6xl font-serif w-1/2'>Collect NFTs Saving The World</div>
              <div className='text-2xl text-slate-500 mt-12 font-serif'>Start collecting digital art that raise funds for charities.</div>
            </div>
            <div className='w-1/2 mt-16'>
              <a href="/collections">
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white"
                  }}
                  customize={{
                    onHover: "lighten",
                    color: "white"
                  }}
                  isFullWidth="true"
                  text='Browse Collections'
                  theme='custom'
                  size='xl'
                />
              </a>
            </div>
          </div>
          <div className='w-1/2 border-2'>

          </div>
        </div>
      </div>
    </div>
  )
}

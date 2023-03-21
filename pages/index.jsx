import Head from 'next/head'
import Image from 'next/image'
import { Button } from 'web3uikit'

export default function Home() {
  return (
    <>
      <div className='w-full h-screen p-36'>
        <div className='flex flex-1 w-4/5 h h-4/5'>
          <div className='flex-col'>
            <div>
              <div className='text-6xl font-serif w-1/2'>Collect NFTs Saving The World</div>
              <div className='text-2xl text-slate-500 mt-12 font-serif'>Start collecting digital art that raise funds for charities.</div>
            </div>
            <div className='w-1/2 mt-16'>
              <a href="/collection">
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
          <div></div>
        </div>
      </div>
    </>
  )
}


import '@/styles/globals.css';
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NotificationProvider } from "web3uikit";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GoogleTagManager } from '@next/third-parties/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App({ Component, pageProps }) {

  const router = useRouter();

  return (
    <div className={`${(router.pathname === "/login" || router.pathname === "/register") ? "" : "max-md:pt-20"}`}>
      <Head>
        <title>Ledgerise</title>
        <meta name="description" content="Bağış hiç olmadığı kadar şeffaf" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet"></link>
        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </Head>
      <GoogleOAuthProvider clientId="681279735908-g0er1l3ad3vto9ct23qrjnl46oq0sp10.apps.googleusercontent.com">
        <MoralisProvider initializeOnMount={false}>
          <NotificationProvider>
            {/* {
              router.pathname == "/"
              ? <div className='relative w-full flex items-center justify-center bg-[rgba(120,0,150,1)] m-1 p-1 text-white'>
                  <a href="/collections">Kız Çocukları İçin Eğitim kampanyası devam ediyor. <span className='underline'>Destek olmak için tıklayınız.</span></a>
                  <div 
                    className='absolute right-8 text-white cursor-pointer'
                    onClick={(e) => {
                      e.target.parentNode.remove()
                    }}
                  >
                    ×
                  </div>
                </div>
              : ("")
            } */}
            {
              router.pathname != "/login" && router.pathname != "/register"
                ? <Header />
                : <div></div>
            }
            <Component {...pageProps} />
            <GoogleTagManager gtmId='G-C50VJCBVP8' />
            {
              router.pathname != "/admin" && router.pathname != "/register" && router.pathname != "/login" && router.pathname != "/api-documentation"
                ? <Footer />
                : <div></div>
            }
          </NotificationProvider>
        </MoralisProvider>
      </GoogleOAuthProvider>
    </div>
  )
}

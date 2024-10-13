
import '@/styles/globals.css';
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NotificationProvider } from "web3uikit";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GoogleTagManager } from '@next/third-parties/google';
import { BasketProvider } from 'utils/BasketContext';

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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet"></link>
        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <BasketProvider>
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
          </BasketProvider>
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

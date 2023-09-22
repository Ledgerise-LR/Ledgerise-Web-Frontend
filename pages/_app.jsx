
import '@/styles/globals.css';
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import { NotificationProvider } from "web3uikit";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Ledgerise</title>
        <meta name="description" content="Nft Marketplace " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet"></link>
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  )
}

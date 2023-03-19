
import 'tailwindcss/tailwind.css'
import '@/styles/globals.css';
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import { NotificationProvider } from "web3uikit";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Nft Fundraising</title>
        <meta name="description" content="Nft Marketplace " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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

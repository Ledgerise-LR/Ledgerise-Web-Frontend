
import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 text-3xl font-playfair font-medium">
        <a href="/">THE CHARITABLE</a>
      </h1>
      <div className="flex flex-row justify-between items-center">
        <Link href="/" className="mr-4 p-6">
          Home
        </Link>
        <Link href="/collections" className="mr-4 p-6" >
          Collections
        </Link>
        <Link href="/auctions" className="mr-4 p-6" >
          Auctions
        </Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  )
}

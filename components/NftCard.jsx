
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import { useRouter } from "next/router";

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller, tokenUri }) {

  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const router = useRouter();

  async function updateUI() {
    // get the token Uri
    // using the image tag from tokenURI, get the image;
    if (tokenUri) {
      // IPFS Gateway: return ipfs files from a normal url
      const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenUriResponse = await (await fetch(requestUrl)).json();
      const imageURI = tokenUriResponse.image
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenUriResponse.name);
      setTokenDescription(tokenUriResponse.description)
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled])

  const handleClick = () => {
    console.log("asdasd")
    router.push(`/assets?id=${tokenId}`);
  }

  return (
    <div className="w-full">
      <div>
        {imageURI ? (
          <div>
            <Card className="w-12" title={tokenName} description={tokenDescription}>
              <div className="flex flex-col items-center">
                <div>#{tokenId}</div>
                <div className="italic text-sm">
                  <Image loader={() => imageURI} src={imageURI} width="200" height="200" />
                  <div className="font-bold">{price / 1e18} ETH</div>
                </div>
              </div>
            </Card>
          </div>
        ) : (<div>Loading...</div>)}
      </div>
    </div>
  )
}

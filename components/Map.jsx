// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react";

export default function MyMap({ stampCoordinates, shippedCoordinates, deliveredCoordinates, route, stampVisualTokenId, shipVisualTokenId, deliverVisualTokenId, visualVerifications, zoom }) {

  function prettyDate(timestamp) {

    const date = new Date(timestamp * 1);
    const formattedDate = date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    return formattedDate;
  }

  const { chainId } = useMoralis();

  const chainString = chainId ? parseInt(chainId, 16).toString() : "11155111";

  const ledgeriseLensNftAddress = networkMapping["LedgeriseLens"][chainString];

  const [stampImageSrc, setStampImageSrc] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/privacy/blur-visual?ipfsGatewayTokenUri=https://ipfs.io/ipfs/${visualVerifications[0].tokenUri}`)
      .then(response => response.json())
      .then(data => {
        setStampImageSrc(data.data);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
  }, []);


  var myIcon = L.icon({
    iconUrl: 'pinpoint.png',
    iconSize: [20, 40],
    iconAnchor: [0, 0],
  });

  let center = [41, 29];

  return <MapContainer className="w-full h-full" center={center} zoom={zoom} scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
      stampCoordinates.latitude ? <Marker position={[(stampCoordinates.latitude) / 1000, (stampCoordinates.longitude) / 1000]}>
        <Popup>
          {
            visualVerifications.map(verification => {
              if (verification.visualVerificationTokenId == stampVisualTokenId) {
                return (
                  <div className="flex flex-1 w-72 items-end">
                    <div className="w-1/2 relative">
                      <div className="absolute left-2 top-2 flex items-center">
                        <img className="w-6" src="logocompact.svg" alt="LRLens" />
                        <div className="text-slate-50 ml-1 text-xs">
                          <div>LRLens</div>
                        </div>
                      </div>
                      <img src={`data:image/png;base64,${stampImageSrc}`} alt="" />
                    </div>
                    <div className="ml-4 w-1/2 flex flex-col">
                      <div className="mb-2 mt-1 text-base text-bold text-slate-800">Stamped <span className="text-xs text-slate-500">don_id: #{verification.openseaTokenId}</span></div>
                      <hr />
                      <div>{prettyDate(verification.date)}</div>
                      <hr />
                      <a className="p-2 mt-2 mb-2 bg-green-500 shadow-green-500 shadow rounded" target="_blank" href={`https://sepolia.etherscan.io/tx/${verification.transactionHash}`}><span className="text-slate-50 text-xs">View Verification</span></a>
                      <a className="p-2 bg-blue-500 shadow-blue-500 shadow rounded" target="_blank" href={`https://testnets.opensea.io/assets/sepolia/${ledgeriseLensNftAddress}/${verification.visualVerificationTokenId}`}><span className="text-slate-50 text-xs">View Certificate</span></a>
                    </div>
                  </div>
                )
              }
            })
          }
        </Popup>
      </Marker> : ("")
    }

    {
      shippedCoordinates.latitude ? <Marker position={[(shippedCoordinates.latitude) / 1000, (shippedCoordinates.longitude) / 1000]}>
        <Popup>
          {
            visualVerifications.map(verification => {
              if (verification.visualVerificationTokenId == shipVisualTokenId) {
                return (
                  <div className="flex flex-1 w-72 items-end">
                    <img className="w-1/2" src={`https://ipfs.io/ipfs/${verification.tokenUri}`} alt="" />
                    <div className="ml-4 w-1/2 flex flex-col">
                      <div className="relative mb-16">
                        <div className="absolute w-10 h-10 border border-blue-900 bg-amber-300"></div>
                        <div className="absolute w-6 h-10 -mt-3 ml-10 border border-red-900 -skew-y-[45deg] bg-amber-300"></div>
                        <div className="absolute w-10 h-6 -mt-6 ml-3 border border-green-900 -skew-x-[45deg] bg-amber-300"></div>

                        <span className="text-xs absolute mt-10 px-1 bg-green-400 rounded-full">29.9 cm</span>
                        <span className="text-xs absolute ml-11 mt-2 px-1 bg-green-400 rounded-full">30 cm</span>
                        <span className="text-xs absolute -mt-5 ml-5 px-1 bg-green-400 rounded-full">50.1 cm</span>
                        <span className="absolute right-0 -mt-6 font-bold">Valid ✓</span>
                      </div>
                      <div className="mb-2 mt-1 text-base text-bold text-slate-800">Shipped <span className="text-xs text-slate-500">don_id: #{verification.openseaTokenId}</span></div>
                      <hr />
                      <div>{prettyDate(verification.date)}</div>
                      <hr />
                      <a className="p-2 mt-2 mb-2 bg-green-500 shadow-green-500 shadow rounded" target="_blank" href={`https://sepolia.etherscan.io/tx/${verification.transactionHash}`}><span className="text-slate-50 text-xs">View Verification</span></a>
                      <a className="p-2 bg-blue-500 shadow-blue-500 shadow rounded" target="_blank" href={`https://testnets.opensea.io/assets/sepolia/${ledgeriseLensNftAddress}/${verification.visualVerificationTokenId}`}><span className="text-slate-50 text-xs">View Certificate</span></a>
                    </div>
                  </div>
                )
              }
            })
          }
        </Popup>
      </Marker> : ("")
    }

    {
      deliveredCoordinates.latitude ? <Marker position={[(deliveredCoordinates.latitude + 0.01) / 1000, (deliveredCoordinates.longitude + 0.01) / 1000]}>
        <Popup>
          {
            visualVerifications.map(verification => {
              if (verification.visualVerificationTokenId == deliverVisualTokenId) {
                return (
                  <div className="flex flex-1 w-72 items-end">
                    <img className="w-1/2" src={`https://ipfs.io/ipfs/${verification.tokenUri}`} alt="" />
                    <div className="ml-4 w-1/2 flex flex-col">
                      <div className="mb-2 mt-1 text-base text-bold text-slate-800">Delivered <span className="text-xs text-slate-500">don_id: #{verification.openseaTokenId}</span></div>
                      <hr />
                      <div>{prettyDate(verification.date)}</div>
                      <hr />
                      <a className="p-2 mt-2 mb-2 bg-green-500 shadow-green-500 shadow rounded" target="_blank" href={`https://sepolia.etherscan.io/tx/${verification.transactionHash}`}><span className="text-slate-50 text-xs">View Verification</span></a>
                      <a className="p-2 bg-blue-500 shadow-blue-500 shadow rounded" target="_blank" href={`https://testnets.opensea.io/assets/sepolia/${ledgeriseLensNftAddress}/${verification.visualVerificationTokenId}`}><span className="text-slate-50 text-xs">View Certificate</span></a>
                    </div>
                  </div>
                )
              }
            })
          }
        </Popup>
      </Marker> : ("")
    }
    <Marker position={[parseInt(route[0][0]._hex) / 1000, parseInt(route[0][1]._hex) / 1000]} icon={myIcon}>
      <Popup>
        Item destination 1
      </Popup>
    </Marker>
    <Marker position={[parseInt(route[1][0]._hex) / 1000, parseInt(route[1][1]._hex) / 1000]} icon={myIcon}>
      <Popup>
        Item route destination 2
      </Popup>
    </Marker>
    <Marker position={[parseInt(route[2][0]._hex) / 1000, parseInt(route[2][1]._hex) / 1000]} icon={myIcon}>
      <Popup>
        Item route destination 3
      </Popup>
    </Marker>
  </MapContainer >
}
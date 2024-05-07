// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup, Circle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import networkMapping from "../constants/networkMapping.json";
import { useEffect, useState } from "react";
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import { URL, PORT } from '@/serverConfig';

export default function DisplayMap({ center, visualVerifications, zoom, chainId, ledgeriseLensNftAddress }) {

  const keyToStringMapping = {
    "stamp": "Üretildi",
    "shipped": "Depoya ulaştı",
    "delivered": "Teslim edildi"
  }

  function prettyDate(timestamp) {

    const date = new Date(timestamp * 1);
    const formattedDate = date.toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    return formattedDate;
  }

  const randArr = [0.2, 0.1, 0.5, 0.6, 0.3, 0.4, 0.9, 0.8, 0.7, 1.0, 0.2, 0.4, 0.6]
  
  return <MapContainer className="w-full h-full" center={[center.latitude / 1000, center.longitude / 1000]} zoom={zoom} scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
      visualVerifications
      ? visualVerifications.map((verification, i) => {
        const threshold = (randArr[i % randArr.length] * 0.1)
        const latitude = (verification.location.latitude + (i % 3 == 0 ? threshold : (i % 5 == 0 ? -threshold : -threshold)));
        const longitude = (verification.location.longitude + (i % 2 == 0 ? -threshold : (i % 5 == 0 ? -threshold : +threshold)));

        return (
            <Marker position={[latitude, longitude]}>
              <Popup>
                <div className="w-36 items-end h-50">
                  <img className="w-full blur-sm" src={`https://ipfs.io/ipfs/${verification.tokenUri}`} alt="" />
                  <div className="ml-4 w-full flex flex-col">
                    <div className="mb-2 mt-1 text-base text-bold text-slate-800">{keyToStringMapping[verification.key]} <span className="text-xs text-slate-500"></span></div>
                    <hr />
                    <div>{prettyDate(verification.date)}</div>
                    <hr />
                    {/* <a className="p-2 mt-2 mb-2 bg-green-500 shadow-green-500 shadow rounded" target="_blank" href={`https://${blockExplorerMapping["blockExplorer"][chainId || "80002"]}/tx/${verification.transactionHash}`}><span className="text-slate-50 text-xs">Verifikasyonu gör</span></a>
                    <a className="p-2 bg-blue-500 shadow-blue-500 shadow rounded" target="_blank" href={`https://testnets.opensea.io/assets/${blockExplorerMapping["nftExplorer"][chainId || "80002"]}/${ledgeriseLensNftAddress}/${verification.visualVerificationTokenId}`}><span className="text-slate-50 text-xs">Sertifikayı gör</span></a> */}
                  </div>
                </div>
              </Popup>
            </Marker>
        )
      }) : ("")
    }
  </MapContainer>
}
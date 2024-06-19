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

  const boundsObject = [
    {
      city: "istanbul",
      topLeft: {
        lat: 41.3202,
        lng: 28.5983
      },
      bottomRight: {
        lat: 40.8021,
        lng: 29.4316
      }
    },
    {
      city: "Izmir",
      topLeft: {
        lat: 38.5496,
        lng: 26.9844
      },
      bottomRight: {
        lat: 38.2705,
        lng: 27.2561
      }
    },
    {
      city: "Mersin",
      topLeft: {
        lat: 37.1074,
        lng: 33.8287
      },
      bottomRight: {
        lat: 36.6437,
        lng: 34.6443
      }
    },
    {
      city: "Kars",
      topLeft: {
        lat: 40.6684,
        lng: 42.9676
      },
      bottomRight: {
        lat: 40.5321,
        lng: 43.1666
      }    
    },
    {
      city: "Adana",
      topLeft: {
        lat: 37.0772,
        lng: 35.1654
      },
      bottomRight: {
        lat: 36.8898,
        lng: 35.4285
      }
    }
  
  ];

  let getCity = (latitude, longitude) => {
    for (let i = 0; i < boundsObject.length; i++) {
      const eachCity = boundsObject[i];
      if (eachCity.topLeft.lat > latitude && latitude > eachCity.bottomRight.lat && longitude > eachCity.topLeft.lng && eachCity.bottomRight.lng > longitude) {
        return eachCity;
      }
    }
    return boundsObject[3]
  }

  const randArr = [0.2, 0.1, 0.5, 0.6, 0.3, 0.4, 0.9, 0.8, 0.7, 1.0, 0.2, 0.4, 0.6]
  
  return <MapContainer className="w-full h-full" center={[center.latitude / 1000, center.longitude / 1000]} zoom={zoom} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
      visualVerifications
      ? visualVerifications.map((verification, i) => {
      
        const city = getCity(verification.location.latitude, verification.location.longitude);

        let widthMargin = i * 0.02;
        
        let heightMargin = (parseInt(i.toString()[i.toString().length - 1]) * 0.02);

        const latitude = (city.topLeft.lat - ((city.topLeft.lat - city.bottomRight.lat) / 2)) - heightMargin;
        const longitude = city.topLeft.lng + widthMargin;

        return (
            <Marker position={[latitude, longitude]}>
              <Popup>
                <div className="w-36 items-end h-50 relative">
                  <a href="/login" target="_blank" style={{ transition: "all 0.5s ease-in" }} className="absolute w-full h-full bg-slate-50 z-10 bg-opacity-20 flex justify-center items-center text-center opacity-0 hover:opacity-50 cursor-pointer">Tam raporu görüntülemek için giriş yapınız</a>
                  <img className="w-full blur-md" src={`https://ipfs.io/ipfs/${verification.tokenUri}`} alt="" />
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
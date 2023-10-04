// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from "react";

export default function MyMap({ stampCoordinates, shippedCoordinates, deliveredCoordinates, route, stampVisualTokenId, shipVisualTokenId, deliverVisualTokenId, visualVerifications, zoom }) {

  let center = [41, 29];

  return <MapContainer className="w-full h-full" center={center} zoom={zoom} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
      stampCoordinates.latitude ? <Marker position={[(stampCoordinates.latitude) / 1000, (stampCoordinates.longitude) / 1000]}>
        <Popup>
          Stamp location
          {
            visualVerifications.map(verification => {
              if (verification.visualVerificationTokenId == stampVisualTokenId) {
                return (
                  <img src={`https://ipfs.io/ipfs/${verification.tokenUri}`} alt="" />
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
          Shipped Locaton
          {
            visualVerifications.map(verification => {
              if (verification.visualVerificationTokenId == shipVisualTokenId) {
                return (
                  <img src={`https://ipfs.io/ipfs/${verification.tokenUri}`} alt="" />
                )
              }
            })
          }
        </Popup>
      </Marker> : ("")
    }

    {
      deliveredCoordinates.latitude ? <Marker position={[(deliveredCoordinates.latitude) / 1000, (deliveredCoordinates.longitude) / 1000]}>
        <Popup>
          Delivered Location
          {
            visualVerifications.map(verification => {
              if (verification.visualVerificationTokenId == deliverVisualTokenId) {
                return (
                  <img src={`https://ipfs.io/ipfs/${verification.tokenUri}`} alt="" />
                )
              }
            })
          }
        </Popup>
      </Marker> : ("")
    }
  </MapContainer>
}
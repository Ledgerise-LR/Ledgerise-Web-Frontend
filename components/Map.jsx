// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from "react";

export default function MyMap({ stampCoordinates, shippedCoordinates, deliveredCoordinates, route, stampVisualTokenId, shipVisualTokenId, deliverVisualTokenId, visualVerifications, zoom }) {

  var myIcon = L.icon({
    iconUrl: 'pinpoint.png',
    iconSize: [20, 50],
    iconAnchor: [0, 0],
    popupAnchor: [-3, -76]
  });

  let center = [41, 29];

  console.log(parseInt(route[0][0]._hex))

  return <MapContainer className="w-full h-full" center={center} zoom={zoom} scrollWheelZoom={true}>
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
  </MapContainer>
}
// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export default function MyMap({ stampCoordinates, shippedCoordinates, deliveredCoordinates, zoom }) {

  let center = [];

  if (stampCoordinates.latitude) {
    center = [stampCoordinates.latitude, stampCoordinates.longitude];
  } if (shippedCoordinates.latitude) {
    center = [shippedCoordinates.latitude, shippedCoordinates.longitude];
  } if (deliveredCoordinates.latitude) {
    center = [deliveredCoordinates.latitude, deliveredCoordinates.longitude];
  }

  return <MapContainer className="w-full h-full" center={center} zoom={zoom} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
      stampCoordinates.latitude ? <Marker position={[stampCoordinates.latitude, stampCoordinates.longitude]}>
        <Popup>
          Stamp location
        </Popup>
      </Marker> : ("")
    }

    {
      shippedCoordinates.latitude ? <Marker position={[shippedCoordinates.latitude, shippedCoordinates.longitude]}>
        <Popup>
          Shipped Locaton
        </Popup>
      </Marker> : ("")
    }

    {
      deliveredCoordinates.latitude ? <Marker position={[deliveredCoordinates.latitude, deliveredCoordinates.longitude]}>
        <Popup>
          Delivered Location
        </Popup>
      </Marker> : ("")
    }
  </MapContainer>
}
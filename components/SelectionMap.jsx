// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useState, useEffect, use } from "react";


export default function MyMap({ stampCoordinates, shippedCoordinates, deliveredCoordinates, zoom, currentSelectingEvent, onUpdate }) {

  const [initialPosition, setInitialPosition] = useState([41, 29]);


  const [tempStampLocation, setTempStampLocation] = useState(stampCoordinates);
  const [tempShippedLocation, setTempShippedLocation] = useState(shippedCoordinates);
  const [tempDeliveredLocation, setTempDeliveredLocation] = useState(deliveredCoordinates);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    onUpdate([tempStampLocation, tempShippedLocation, tempDeliveredLocation]);
  }, [tempStampLocation, tempShippedLocation, tempDeliveredLocation])


  const eventLabels = ["The item will be stamped here.", "The item will be shipped here.", "The item will be delivered here."]

  let coordinatesArray = [tempStampLocation, tempShippedLocation, tempDeliveredLocation];

  const Markers = () => {

    const map = useMapEvents({
      click(e) {
        if (currentSelectingEvent == "stamp") {
          const temp = [
            e.latlng.lat,
            e.latlng.lng
          ]
          setTempStampLocation(temp);
        } else if (currentSelectingEvent == "shipped") {
          const temp = [
            e.latlng.lat,
            e.latlng.lng
          ]
          setTempShippedLocation(temp);
        } else if (currentSelectingEvent == "delivered") {
          const temp = [
            e.latlng.lat,
            e.latlng.lng
          ]
          setTempDeliveredLocation(temp);
        }
      },
    })

  }

  return <MapContainer className="w-full h-full" center={initialPosition} zoom={zoom} scrollWheelZoom={true} >
    <Markers />
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
      coordinatesArray.map((coordinate, i) => {
        if (coordinate[0] != null && coordinate[1] != null) {
          return (
            <Marker position={coordinate}>
              <Popup>
                {eventLabels[i]}
              </Popup>
            </Marker>
          )
        }
      })
    }
    {
      tempStampLocation[0] && tempStampLocation[1] && tempShippedLocation[0] && tempShippedLocation[1]
        ? <Polyline key={`${tempStampLocation}${tempShippedLocation}`} positions={[
          tempStampLocation, tempShippedLocation,
        ]} color={'black'} />
        : ("")
    }
    {
      tempShippedLocation[0] && tempShippedLocation[1] && tempDeliveredLocation[0] && tempDeliveredLocation[1]
        ? <Polyline key={`${tempShippedLocation}${tempDeliveredLocation}`} positions={[
          tempShippedLocation, tempDeliveredLocation,
        ]} color={'black'} />
        : ("")
    }

  </MapContainer >
}
// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup, Circle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Loading } from 'web3uikit';
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useMoralis } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
import { useEffect, useState } from "react";
import blockExplorerMapping from "../constants/blockExplorerMapping.json";
import { URL, PORT } from '@/serverConfig';

export default function MyMap({ center, nftAddress, stampCoordinates, shippedCoordinates, deliveredCoordinates, route, stampVisualTokenId, shipVisualTokenId, deliverVisualTokenId, visualVerifications, zoom, isNeedItem, needItemInfo, needTokenUri, need, chainId, ledgeriseLensNftAddress }) {

  const [needImageUri, setNeedImageUri] = useState("");

  async function updateUI() {

    const tokenUri = needTokenUri;
    if (needTokenUri) {
      // IPFS Gateway: return ipfs files from a normal url
      const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenUriResponse = await (await fetch(requestUrl)).json();
      const imageURI = tokenUriResponse.image
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setNeedImageUri(imageURIURL);
    }
  }

  useEffect(() => {
    if (isNeedItem) {
      updateUI()
    }
  }, [])


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

  const [deliverImageSrc, setDeliverImageSrc] = useState(null);

  useEffect(() => {
    if (visualVerifications) {
    
      visualVerifications.map(verification => {
        if (verification.visualVerificationTokenId == deliverVisualTokenId && verification.nftAddress == nftAddress) {
          if (verification.tokenUri) {
          fetch(`${URL}:${PORT}/privacy/blur-visual?ipfsGatewayTokenUri=https://ipfs.io/ipfs/${verification.tokenUri}&x=${verification.bounds.x}&y=${verification.bounds.y}`)
            .then(response => response.json())
            .then(data => {
              setDeliverImageSrc(data.data);
            })
            .catch(error => {
              console.error('Error fetching image:', error);
            });
          }
        }
      })
    }
  }, []);


  var myIcon = L.icon({
    iconUrl: 'pinpoint.png',
    iconSize: [20, 40],
    iconAnchor: [0, 0],
  });

  return <MapContainer className="w-full h-full" center={[center.latitude / 1000, center.longitude / 1000]} zoom={zoom} scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
      deliveredCoordinates
        ? <Circle center={[(deliveredCoordinates.latitude) / 1000, (deliveredCoordinates.longitude) / 1000]} pathOptions={{ fillColor: 'blue' }} radius={300} />
        : ("")
    }
    {
      stampCoordinates.latitude ? <Marker position={[(stampCoordinates.latitude + 0.01) / 1000, (stampCoordinates.longitude + 0.01) / 1000]}>
      <Popup>
          {
            isNeedItem
              ? <div className="flex w-72 items-end h-64">
                <img className="w-1/2" src={needImageUri} alt="" />
                <div className="ml-4 w-1/2 flex flex-col">
                  <div className="mb-4 text-xl font-bold">
                    Yola çıktı
                  </div>
                  <div className="mb-4">
                    <div className="font-bold">Depo adresi</div>
                    <div>{needItemInfo.depotAddress}</div>
                  </div>
                  <div className="mb-4">
                    <div className="font-bold">İhtiyaç sahibi tel.</div>
                    <div>{needItemInfo.beneficiaryPhoneNumber}</div>
                  </div>
                  <div className="mb-4">
                    <div className="font-bold">Hepsiburada sipariş numarası</div>
                    <div>{needItemInfo.orderNumber}</div>
                  </div>
                  <div className="mb-4">
                    <div className="font-bold">Bağış zamanı</div>
                    <div>{prettyDate(needItemInfo.donateTimestamp)}</div>
                  </div>
                </div>
              </div>
              : ("")
          }
          {
            visualVerifications
            ? visualVerifications.map(verification => {
              if (verification.visualVerificationTokenId == stampVisualTokenId && verification.nftAddress == nftAddress) {
                return (
                  <div className="flex w-72 items-end h-64">
                    <img className="w-1/2" src={`https://ipfs.io/ipfs/${verification.tokenUri}`} alt="" />
                    <div className="ml-4 w-1/2 flex flex-col">
                      <div className="mb-2 mt-1 text-base text-bold text-slate-800">Üretildi <span className="text-xs text-slate-500">bagis: #{verification.openseaTokenId}</span></div>
                      <hr />
                      <div>{prettyDate(verification.date)}</div>
                      <hr />
                      <a className="p-2 mt-2 mb-2 bg-green-500 shadow-green-500 shadow rounded" target="_blank" href={`https://${blockExplorerMapping["blockExplorer"][chainId || "80002"]}/tx/${verification.transactionHash}`}><span className="text-slate-50 text-xs">Verifikasyonu gör</span></a>
                      <a className="p-2 bg-blue-500 shadow-blue-500 shadow rounded" target="_blank" href={`https://testnets.opensea.io/assets/${blockExplorerMapping["nftExplorer"][chainId || "80002"]}/${ledgeriseLensNftAddress}/${verification.visualVerificationTokenId}`}><span className="text-slate-50 text-xs">Sertifikayı gör</span></a>
                    </div>
                  </div>
                )
              }
            })
            : ("")
          }
        </Popup>
      </Marker> : ("")
    }

    {
      (shippedCoordinates && shippedCoordinates.latitude) ? <Marker position={[(shippedCoordinates.latitude) / 1000, (shippedCoordinates.longitude) / 1000]}>
        <Popup>
          {
            visualVerifications.map(verification => {
              if (verification.visualVerificationTokenId == shipVisualTokenId && verification.nftAddress == nftAddress) {
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
                      <div className="mb-2 mt-1 text-base text-bold text-slate-800">Depoda <span className="text-xs text-slate-500">bagis: {verification.openseaTokenId}</span></div>
                      <hr />
                      <div>{prettyDate(verification.date)}</div>
                      <hr />
                      <a className="p-2 mt-2 mb-2 bg-green-500 shadow-green-500 shadow rounded" target="_blank" href={`https://${blockExplorerMapping["blockExplorer"][chainId || "80002"]}/tx/${verification.transactionHash}`}><span className="text-slate-50 text-xs">Verifikasyonu gör</span></a>
                      <a className="p-2 bg-blue-500 shadow-blue-500 shadow rounded" target="_blank" href={`https://testnets.opensea.io/assets/${blockExplorerMapping["nftExplorer"][chainId || "80002"]}/${ledgeriseLensNftAddress}/${verification.visualVerificationTokenId}`}><span className="text-slate-50 text-xs">Sertifikayı gör</span></a>
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
      isNeedItem && need
        ? <Marker position={[(need.location.latitude) / 1000, (need.location.longitude) / 1000]}>
          <Popup>
            İhtiyacın buraya ulaşması bekleniyor.
          </Popup>
        </Marker>       
        : ("")
    }

    {
      (deliveredCoordinates && deliveredCoordinates.latitude) ? <Marker position={[((deliveredCoordinates.latitude) / 1000) * ((Math.random() * 0.000035) + (Math.random() > 0.5 ? ((Math.random() * 0.00003) + 1) : (1 - (Math.random() * 0.00003)))), ((deliveredCoordinates.longitude) / 1000) * (Math.random() > 0.5 ? ((Math.random() * 0.00003) + 1) : (1 - (Math.random() * 0.00003)))]}>
        <Popup>
          {
            visualVerifications.map(verification => {
              if (verification.visualVerificationTokenId == deliverVisualTokenId && verification.nftAddress == nftAddress) {
                return (
                  <div className="h-60 flex flex-1 w-72 items-end">
                    <div className="w-1/2 relative h-full flex">
                      <div className="absolute left-2 top-2 flex items-center z-40">
                        <img className="w-5" src="logocompact.svg" alt="LRLens" />
                        <div className="text-slate-50 ml-1 text-xs">
                          <div>Lens</div>
                        </div>
                      </div>
                      {
                        !deliverImageSrc
                          ? (<div className="flex w-full h-full items-center justify-center animate-pulse bg-slate-200 rounded border-dashed border border-slate-700">
                            <div className="mr-2">Loading</div>
                            <Loading spinnerColor='gray' spinnerType='loader' />
                          </div>)
                          : (< img src={`data:image/png;base64,${deliverImageSrc}`} alt="" />)
                          /* < img src={`data:image/png;base64,${deliverImageSrc}`} alt="" /> */
                      }
                    </div>
                    <div className="ml-4 w-1/2 flex flex-col">
                      <div className="mb-2 mt-1 text-xs text-slate-600">KVKK gereğince tam lokasyon belirsiz</div>
                      <div className="mb-2 mt-1 text-base text-bold text-slate-800">Teslim Edildi <span className="text-xs text-slate-500">bagis: #{verification.openseaTokenId}</span></div>
                      <hr />
                      <div>{prettyDate(verification.date)}</div>
                      <hr />
                      <a className="p-2 mt-2 mb-2 bg-green-500 shadow-green-500 shadow rounded" target="_blank" href={`https://${blockExplorerMapping["blockExplorer"][chainId || "80002"]}/tx/${verification.transactionHash}`}><span className="text-slate-50 text-xs">Verifikasyonu gör</span></a>
                      <a className="p-2 bg-blue-500 shadow-blue-500 shadow rounded" target="_blank" href={`https://testnets.opensea.io/assets/${blockExplorerMapping["nftExplorer"][chainId || "80002"]}/${ledgeriseLensNftAddress}/${verification.visualVerificationTokenId}`}><span className="text-slate-50 text-xs">Sertifikayı gör</span></a>
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
      stampCoordinates && shippedCoordinates && stampCoordinates.latitude && stampCoordinates.longitude && shippedCoordinates.latitude && shippedCoordinates.longitude
        ? <Polyline key={`${stampVisualTokenId}${shipVisualTokenId}`} positions={[
          [stampCoordinates.latitude / 1000, stampCoordinates.longitude / 1000], [shippedCoordinates.latitude / 1000, shippedCoordinates.longitude / 1000],
        ]} color={'rgb(88,128,157)'} />
        : ("")
    }
    {
      shippedCoordinates && deliveredCoordinates && shippedCoordinates.latitude && shippedCoordinates.longitude && deliveredCoordinates.latitude && deliveredCoordinates.longitude
        ? <Polyline key={`${shippedCoordinates}${deliveredCoordinates}`} positions={[
          [shippedCoordinates.latitude / 1000, shippedCoordinates.longitude / 1000], [deliveredCoordinates.latitude / 1000, deliveredCoordinates.longitude / 1000],        
        ]} color={'rgb(88,128,157)'} />
        : ("")
    }

    {
      isNeedItem
          ? need.location && stampCoordinates && need.location.latitude && need.location.longitude && stampCoordinates.latitude && stampCoordinates.longitude
            ? <Polyline key={`${need.location}${stampCoordinates}`} positions={[
              [need.location.latitude / 1000, need.location.longitude / 1000], [stampCoordinates.latitude / 1000, stampCoordinates.longitude / 1000],        
            ]} color={'rgb(88,128,157)'} />
            : ("")
        : ("")
    }
  </MapContainer >
}
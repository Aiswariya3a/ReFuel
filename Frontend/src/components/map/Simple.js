// import React, { useEffect, useState } from "react";
// import GoogleMapReact from 'google-map-react';
// import Marker from "./Marker";

// export default function SimpleMap({pointer,setPointer,disable=false}){
//   const getLocation = () =>{
    
//     if (navigator.geolocation && !disable) {
//       navigator.geolocation.watchPosition(function(position) {
//         setPointer({
//           lat : position.coords.latitude,
//           lng : position.coords.longitude
//         })
//       });
//     }
//   }

//   useEffect(()=>{
//       getLocation()
//   },[])

//   return (
//     // Important! Always set the container height explicitly
//     <div style={{ height: '100%', width: '100%' }}>
//       <GoogleMapReact
//         bootstrapURLKeys={{
//           key: process.env.REACT_APP_GOOGLEAPIKEY,
//           language: "en",
//           region: "US"
//         }}
//         center={pointer}
//         zoom={10}
//         onClick={!disable?(e)=>{
//           setPointer({
//             lat : e.lat,
//             lng : e.lng
//           })
//         }:null}
//       >
//         <Marker
//           lat={pointer.lat}
//           lng={pointer.lng}
//         />
//       </GoogleMapReact>
//     </div>
//   );
// }


import React, { useEffect,useState  } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerPin from '../../assets/images/marker-pin.png';

export default function SimpleMap({ pointer, setPointer, disable = false }) {
  const [address, setAddress] = useState("");
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation && !disable) {
        navigator.geolocation.watchPosition(function (position) {
          setPointer({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        });
      }
    }

    getLocation();
  }, [disable, setPointer]);

  useEffect(() => {
    let map;
    let marker;

    if (pointer && pointer.lat !== undefined && pointer.lng !== undefined) {
      map = L.map('map').setView([pointer.lat, pointer.lng], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      if (!disable) {
        map.on('click', function (e) {
          setPointer({
            lat: e.latlng.lat,
            lng: e.latlng.lng
          });
        });
      }

      // Define custom icon for the marker
      const customIcon = L.icon({
        iconUrl: markerPin,
        iconSize: [40, 40], // Size of the icon
        iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
      });

      // Remove previous marker if exists
      if (marker) {
        marker.remove();
      }

      // Add marker to the map using the custom icon
      marker = L.marker([pointer.lat, pointer.lng], { icon: customIcon }).addTo(map);
    }

    async function fetchAddress() {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pointer.lat}&lon=${pointer.lng}`);
        const data = await response.json();
        setAddress(data.display_name);
        
        // Add tooltip to marker with address
        marker.bindTooltip(data.display_name).openTooltip();
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    }

    fetchAddress();

    return () => {
      // Cleanup map and marker instances when component unmounts
      if (map) {
        map.remove();
      }
    };
  }, [pointer, disable, setPointer]);

  return (
    <div id="map" style={{ height: '100%', width: '100%' }} />
  );
}

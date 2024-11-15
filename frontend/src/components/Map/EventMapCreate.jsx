import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarkerImage from './marker.png'; // Убедитесь, что путь к изображению корректен

function LocationMarker({ setCoordinates }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setCoordinates({ latitude: lat, longitude: lng });
    },
  });

  return position === null ? null : (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: customMarkerImage,
        iconSize: [32, 32], // Размер иконки
      })}
    >
      <Popup>
        Coordinates: {position[0]}, {position[1]}
      </Popup>
    </Marker>
  );
}

function EventMapCreate({ setCoordinates }) {
  useEffect(() => {
    // Удаление атрибуции Leaflet после монтирования компонента
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      const attributionControl = mapContainer.querySelector('.leaflet-control-attribution');
      if (attributionControl) {
        attributionControl.remove();
      }
    }
  }, []);
  return (
    <MapContainer center={[55.751244, 37.618423]} zoom={10} style={{ height: '400px', width: '900px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker setCoordinates={setCoordinates} />
    </MapContainer>
  );
}

export default EventMapCreate;

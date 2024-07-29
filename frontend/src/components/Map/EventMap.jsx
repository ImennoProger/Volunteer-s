import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customMarkerImage from './marker.png'; 

// Создание иконки
const customIcon = new L.Icon({
  iconUrl: customMarkerImage,
  iconSize: [32, 32], // [ширина, высота]
  iconAnchor: [16, 32], // Позиция иконки относительно точки на карте
  popupAnchor: [0, -32], // Позиция всплывающего окна относительно иконки
  className: 'custom-marker', // Класс для дополнительных CSS-стилей
});

function EventMap({ events }) {
  return (
    <MapContainer
      center={[55.751244, 37.618423]}
      zoom={10}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {events.map((event, index) => (
        <Marker
          key={index}
          position={[event.latitude, event.longitude]}
          icon={customIcon} // Применяем кастомную иконку
        >
          <Popup>
            <strong>{event.name}</strong>
            <br />
            {event.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default EventMap;

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherMapProps {
  onLocationSelect: (location: { lat: number; lon: number; name?: string }) => void;
  selectedLocation?: { lat: number; lon: number; name?: string };
}

interface MapClickHandlerProps {
  onLocationSelect: (location: { lat: number; lon: number; name?: string }) => void;
}

function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lon: lng });
    },
  });
  return null;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ onLocationSelect, selectedLocation }) => {
  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lon]} />
        )}
      </MapContainer>
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border z-[1000]">
        <p className="text-sm font-medium">Click on the map to select a location</p>
        {selectedLocation && (
          <p className="text-xs text-muted-foreground mt-1">
            {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
            {selectedLocation.name && ` • ${selectedLocation.name}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default WeatherMap;
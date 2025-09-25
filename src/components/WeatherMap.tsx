import React, { useState, useEffect, useRef } from 'react';
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

const WeatherMap: React.FC<WeatherMapProps> = ({ onLocationSelect, selectedLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current);

    // Add click handler
    mapInstanceRef.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lon: lng });
      
      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current!.removeLayer(markerRef.current);
      }
      
      // Add new marker
      markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [onLocationSelect]);

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;

    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    // Add new marker
    markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lon])
      .addTo(mapInstanceRef.current);

    // Center map on location smoothly without resetting
    mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lon], 8, {
      animate: true,
      duration: 1
    });
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
      <div ref={mapRef} className="h-full w-full" />
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
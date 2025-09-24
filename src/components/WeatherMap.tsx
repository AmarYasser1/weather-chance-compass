import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Settings } from 'lucide-react';

interface WeatherMapProps {
  onLocationSelect: (location: { lat: number; lon: number; name?: string }) => void;
  selectedLocation?: { lat: number; lon: number; name?: string };
}

const WeatherMap: React.FC<WeatherMapProps> = ({ onLocationSelect, selectedLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 2,
      center: [0, 20],
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      onLocationSelect({ lat, lon: lng });
      
      if (marker.current) {
        marker.current.remove();
      }
      
      marker.current = new mapboxgl.Marker({ color: '#0ea5e9' })
        .setLngLat([lng, lat])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onLocationSelect]);

  useEffect(() => {
    if (selectedLocation && map.current) {
      if (marker.current) {
        marker.current.remove();
      }
      
      marker.current = new mapboxgl.Marker({ color: '#0ea5e9' })
        .setLngLat([selectedLocation.lon, selectedLocation.lat])
        .addTo(map.current);
      
      map.current.flyTo({
        center: [selectedLocation.lon, selectedLocation.lat],
        zoom: 8,
        duration: 2000
      });
    }
  }, [selectedLocation]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <div className="w-full h-[400px] rounded-lg border bg-card flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <MapPin className="h-12 w-12 mx-auto text-primary" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Configure Mapbox</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Mapbox public token to enable the interactive map.
              Get one at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <Input
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
              />
              <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
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
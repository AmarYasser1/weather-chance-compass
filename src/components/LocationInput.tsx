import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Calendar } from 'lucide-react';

interface LocationInputProps {
  onLocationSubmit: (location: { lat: number; lon: number; name?: string }) => void;
  onDateSubmit: (date: string, timeWindow?: { days_before: number; days_after: number }) => void;
  selectedLocation?: { lat: number; lon: number; name?: string };
  selectedDate?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  onLocationSubmit,
  onDateSubmit,
  selectedLocation,
  selectedDate
}) => {
  const [cityName, setCityName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [date, setDate] = useState(selectedDate || '');
  const [daysBefore, setDaysBefore] = useState('3');
  const [daysAfter, setDaysAfter] = useState('3');

  const handleCitySearch = async () => {
    if (!cityName.trim()) return;
    
    // Enhanced mock geocoding - in real app would use a geocoding service
    const mockLocations: { [key: string]: { lat: number; lon: number } } = {
      'cairo': { lat: 30.0444, lon: 31.2357 },
      'new york': { lat: 40.7128, lon: -74.0060 },
      'london': { lat: 51.5074, lon: -0.1278 },
      'tokyo': { lat: 35.6762, lon: 139.6503 },
      'sydney': { lat: -33.8688, lon: 151.2093 },
      'paris': { lat: 48.8566, lon: 2.3522 },
      'berlin': { lat: 52.5200, lon: 13.4050 },
      'los angeles': { lat: 34.0522, lon: -118.2437 },
      'moscow': { lat: 55.7558, lon: 37.6176 },
      'mumbai': { lat: 19.0760, lon: 72.8777 },
      'beijing': { lat: 39.9042, lon: 116.4074 },
      'rio de janeiro': { lat: -22.9068, lon: -43.1729 },
      'cape town': { lat: -33.9249, lon: 18.4241 },
    };
    
    // Find city by partial match (case insensitive)
    const searchTerm = cityName.toLowerCase().trim();
    const matchedCity = Object.keys(mockLocations).find(city => 
      city.toLowerCase().includes(searchTerm) || searchTerm.includes(city.toLowerCase())
    );
    
    if (matchedCity) {
      const location = mockLocations[matchedCity];
      const properName = matchedCity.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      onLocationSubmit({ ...location, name: properName });
      setCityName('');
    }
  };

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      onLocationSubmit({ lat, lon });
    }
  };

  const handleDateSubmit = () => {
    if (date) {
      const timeWindow = {
        days_before: parseInt(daysBefore) || 0,
        days_after: parseInt(daysAfter) || 0
      };
      onDateSubmit(date, timeWindow);
    }
  };

  return (
    <div className="space-y-4">
      {/* Location Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" />
            Location Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* City Search */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">City Name</Label>
            <div className="flex gap-2">
              <Input
                id="city"
                placeholder="e.g., Cairo, New York, London, Paris..."
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
              />
              <Button onClick={handleCitySearch} disabled={!cityName.trim()}>
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Search integrates with the interactive map • Click map or search by city
            </p>
          </div>
          
          {/* Coordinate Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Or enter coordinates</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                type="number"
                step="any"
                min="-90"
                max="90"
              />
              <Input
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                type="number"
                step="any"
                min="-180"
                max="180"
              />
              <Button onClick={handleCoordinateSubmit} disabled={!latitude || !longitude}>
                Set
              </Button>
            </div>
          </div>
          
          {selectedLocation && (
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm font-medium">Selected Location:</p>
              <p className="text-xs text-muted-foreground">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                {selectedLocation.name && ` • ${selectedLocation.name}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Date & Time Window
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Target Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Analysis Window</Label>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div>
                <Input
                  placeholder="Days before"
                  value={daysBefore}
                  onChange={(e) => setDaysBefore(e.target.value)}
                  type="number"
                  min="0"
                  max="30"
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">±</div>
              <div>
                <Input
                  placeholder="Days after"
                  value={daysAfter}
                  onChange={(e) => setDaysAfter(e.target.value)}
                  type="number"
                  min="0"
                  max="30"
                />
              </div>
            </div>
          </div>
          
          <Button onClick={handleDateSubmit} disabled={!date} className="w-full">
            Analyze Weather Probabilities
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationInput;
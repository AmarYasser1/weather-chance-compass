import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Calendar, Loader2 } from 'lucide-react';

interface LocationInputProps {
  onLocationSubmit: (location: { lat: number; lon: number; name?: string }) => void;
  onDateSubmit: (date: string, timeWindow?: { days_before: number; days_after: number }) => void;
  selectedLocation?: { lat: number; lon: number; name?: string };
  selectedDate?: string;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name: string;
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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  const searchCities = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      // Using Nominatim (OpenStreetMap) geocoding API - free and no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=&featuretype=city`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      const results: SearchResult[] = data.map((item: any) => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        name: item.name || item.display_name.split(',')[0]
      }));
      
      setSearchResults(results);
      setShowSuggestions(results.length > 0);
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchResults([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(debounce(searchCities, 300), []);

  useEffect(() => {
    debouncedSearch(cityName);
  }, [cityName, debouncedSearch]);

  const handleCitySelect = (result: SearchResult) => {
    const location = {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      name: result.name
    };
    onLocationSubmit(location);
    setCityName(result.name);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSuggestions) {
        const target = event.target as Element;
        if (!target.closest('.search-container')) {
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  const handleInputChange = (value: string) => {
    setCityName(value);
    if (!value.trim()) {
      setShowSuggestions(false);
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
          <div className="space-y-2 relative search-container">
            <Label htmlFor="city" className="text-sm font-medium">City Name</Label>
            <div className="relative">
              <Input
                id="city"
                placeholder="Start typing a city name..."
                value={cityName}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(searchResults.length > 0)}
                className="pr-10"
              />
              {isSearching && (
                <Loader2 className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.place_id}
                      className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground border-b border-border last:border-b-0 transition-colors"
                      onClick={() => handleCitySelect(result)}
                    >
                      <div className="font-medium">{result.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {result.display_name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time search integrates with interactive map • Click map or search by city
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
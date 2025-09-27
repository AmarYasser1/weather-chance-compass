import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, CheckCircle } from 'lucide-react';
import WeatherMap from '@/components/WeatherMap';

interface Location {
  lat: number;
  lon: number;
  name?: string;
}

interface LocationStepProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name: string;
}

const LocationStep: React.FC<LocationStepProps> = ({
  onLocationSelect,
  selectedLocation
}) => {
  const [cityName, setCityName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
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
    onLocationSelect(location);
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
      onLocationSelect({ lat, lon });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Location Input Controls */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Choose Your Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* City Search */}
            <div className="space-y-2 relative search-container">
              <Label htmlFor="city" className="text-sm font-medium">Search by City</Label>
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
            </div>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            {/* Coordinate Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Enter Coordinates</Label>
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
          </CardContent>
        </Card>

        {/* Selected Location Display */}
        {selectedLocation && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Location Selected</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                    {selectedLocation.name && (
                      <span className="block">{selectedLocation.name}</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Interactive Map */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <WeatherMap 
              onLocationSelect={onLocationSelect}
              selectedLocation={selectedLocation}
            />
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground text-center">
          Click anywhere on the map to select a location
        </p>
      </div>
    </div>
  );
};

export default LocationStep;
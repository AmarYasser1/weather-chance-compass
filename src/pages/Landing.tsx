import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WeatherMap from '@/components/WeatherMap';
import LocationInput from '@/components/LocationInput';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Satellite, Database, Info, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Location {
  lat: number;
  lon: number;
  name?: string;
}

interface AnalysisConfig {
  date: string;
  timeWindow?: { days_before: number; days_after: number };
  thresholds: {
    very_hot_C: number;
    very_cold_C: number;
    very_wet_mm_per_day: number;
    very_windy_m_s: number;
    uncomfortable_heat_index: number;
  };
}

const Landing = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig | undefined>();
  const { toast } = useToast();

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    toast({
      title: "Location Selected",
      description: `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}${location.name ? ` • ${location.name}` : ''}`,
    });
  };

  const handleDateSubmit = (date: string, timeWindow?: { days_before: number; days_after: number }) => {
    if (!selectedLocation) {
      toast({
        title: "Location Required",
        description: "Please select a location first",
        variant: "destructive",
      });
      return;
    }

    const config: AnalysisConfig = {
      date,
      timeWindow,
      thresholds: {
        very_hot_C: 35,
        very_cold_C: 0,
        very_wet_mm_per_day: 20,
        very_windy_m_s: 10,
        uncomfortable_heat_index: 32,
      }
    };
    
    setAnalysisConfig(config);
  };

  const handleAnalyzeWeather = () => {
    if (!selectedLocation || !analysisConfig) {
      toast({
        title: "Missing Information",
        description: "Please select a location and date first",
        variant: "destructive",
      });
      return;
    }

    // Navigate to dashboard with the analysis data
    navigate('/dashboard', {
      state: {
        selectedLocation,
        analysisConfig
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">NASA MERRA-2 Weather Analysis</h1>
                <p className="text-sm text-muted-foreground">Historical weather probability prediction</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                <Database className="h-3 w-3 mr-1" />
                Historical Data: 1980-2025
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="xl:col-span-1 space-y-6">
            <LocationInput
              onLocationSubmit={handleLocationSelect}
              onDateSubmit={handleDateSubmit}
              selectedLocation={selectedLocation}
              selectedDate={analysisConfig?.date}
            />

            {/* Analyze Button */}
            {selectedLocation && analysisConfig && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4" />
                    Ready for Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Location and date selected. Click to analyze weather probabilities using NASA MERRA-2 data.
                  </p>
                  <Button 
                    onClick={handleAnalyzeWeather}
                    className="w-full"
                    size="lg"
                  >
                    Analyze Weather
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-4 w-4" />
                  About This Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  This tool uses NASA MERRA-2 reanalysis data to compute historical weather probabilities 
                  for your selected location and date.
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Data source: NASA GES DISC MERRA-2</p>
                  <p>• Time range: 1980-present</p>
                  <p>• Spatial resolution: ~50km</p>
                  <p>• Variables: T2M, PRECTOT, U10M, V10M, QV2M</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map */}
          <div className="xl:col-span-2 space-y-6">
            <WeatherMap 
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />

            {/* Instructions */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Get Started</h3>
                  <p className="text-muted-foreground">
                    Click on the map to select a location or search by city name, then choose a date to analyze weather probabilities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
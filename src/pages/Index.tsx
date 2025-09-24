import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import WeatherMap from '@/components/WeatherMap';
import LocationInput from '@/components/LocationInput';
import ProbabilityCard from '@/components/ProbabilityCard';
import WeatherCharts from '@/components/WeatherCharts';
import { Download, Satellite, Database, Info } from 'lucide-react';
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

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig | undefined>();
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Mock probability data - in real app would come from MERRA-2 API
  const mockProbabilities = {
    very_hot: 0.62,
    very_cold: 0.01,
    very_wet: 0.12,
    very_windy: 0.08,
    uncomfortable: 0.45,
  };

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

    setAnalysisConfig({
      date,
      timeWindow,
      thresholds: {
        very_hot_C: 35,
        very_cold_C: 0,
        very_wet_mm_per_day: 20,
        very_windy_m_s: 10,
        uncomfortable_heat_index: 32,
      }
    });
    setShowResults(true);
    toast({
      title: "Analysis Complete",
      description: "Weather probability analysis has been generated using historical MERRA-2 data",
    });
  };

  const handleDownload = (format: 'csv' | 'json') => {
    // Mock download functionality
    toast({
      title: "Download Started",
      description: `Downloading analysis results as ${format.toUpperCase()}`,
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
                <h1 className="text-xl font-bold">NASA MERRA-2 Weather Dashboard</h1>
                <p className="text-sm text-muted-foreground">Probability-based weather condition analysis</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              Historical Data: 1980-2025
            </Badge>
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

            {showResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Download className="h-4 w-4" />
                    Export Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Download the historical data subset and analysis metadata
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload('csv')}
                      className="flex-1"
                    >
                      CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload('json')}
                      className="flex-1"
                    >
                      JSON
                    </Button>
                  </div>
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
                  This dashboard uses NASA MERRA-2 reanalysis data to compute historical weather probabilities 
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

          {/* Right Column - Map and Results */}
          <div className="xl:col-span-2 space-y-6">
            {/* Map */}
            <WeatherMap 
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />

            {showResults && (
              <>
                {/* Analysis Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Location:</strong> {selectedLocation?.name || 'Custom Location'} 
                        ({selectedLocation?.lat.toFixed(4)}, {selectedLocation?.lon.toFixed(4)})
                      </p>
                      <p className="text-sm">
                        <strong>Target Date:</strong> {analysisConfig?.date}
                        {analysisConfig?.timeWindow && (
                          <span> (±{analysisConfig.timeWindow.days_before}-{analysisConfig.timeWindow.days_after} days)</span>
                        )}
                      </p>
                      <p className="text-sm">
                        <strong>Historical Period:</strong> 1980-2025 (45 years of data)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Probability Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ProbabilityCard
                    title="Very Hot"
                    probability={mockProbabilities.very_hot}
                    threshold="≥35°C (95°F)"
                    description="Based on daily maximum temperature"
                    type="hot"
                    trend="increasing"
                  />
                  <ProbabilityCard
                    title="Very Cold"
                    probability={mockProbabilities.very_cold}
                    threshold="≤0°C (32°F)"
                    description="Based on daily minimum temperature"
                    type="cold"
                    trend="stable"
                  />
                  <ProbabilityCard
                    title="Very Wet"
                    probability={mockProbabilities.very_wet}
                    threshold="≥20mm precipitation"
                    description="Daily total precipitation"
                    type="wet"
                    trend="stable"
                  />
                  <ProbabilityCard
                    title="Very Windy"
                    probability={mockProbabilities.very_windy}
                    threshold="≥10 m/s (36 km/h)"
                    description="10-meter wind speed"
                    type="windy"
                    trend="increasing"
                  />
                  <ProbabilityCard
                    title="Uncomfortable"
                    probability={mockProbabilities.uncomfortable}
                    threshold="Heat Index ≥32°C"
                    description="Combined temperature and humidity"
                    type="uncomfortable"
                    trend="increasing"
                  />
                </div>

                <Separator />

                {/* Charts */}
                <WeatherCharts />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

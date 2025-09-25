import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProbabilityCard from '@/components/ProbabilityCard';
import WeatherCharts from '@/components/WeatherCharts';
import { Download, Satellite, Database, ArrowLeft } from 'lucide-react';
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
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get data from navigation state, redirect if no data
  const { selectedLocation, analysisConfig } = location.state || {};
  
  if (!selectedLocation || !analysisConfig) {
    // Redirect to landing if no data
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }

  // Mock probability data - in real app would come from MERRA-2 API
  const mockProbabilities = {
    very_hot: 0.62,
    very_cold: 0.01,
    very_wet: 0.12,
    very_windy: 0.08,
    uncomfortable: 0.45,
  };

  const handleBackToLanding = () => {
    navigate('/');
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToLanding}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Satellite className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Weather Analysis Results</h1>
                <p className="text-sm text-muted-foreground">Historical probability analysis complete</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Export & Analysis Summary */}
          <div className="lg:col-span-1 space-y-6">
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
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-3 space-y-6">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

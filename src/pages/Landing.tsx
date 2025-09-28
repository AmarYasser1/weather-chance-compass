import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Badge } from '@/components/ui/badge';
import MultistepForm from '@/components/MultistepForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Satellite, Database } from 'lucide-react';

interface Location {
  lat: number;
  lon: number;
  name?: string;
}

interface AnalysisConfig {
  date: string;
  timeWindow?: { days_before: number; days_after: number };
}

const Landing = () => {
  const navigate = useNavigate();

  const handleAnalyze = (location: Location, config: AnalysisConfig) => {
    const fullConfig = {
      ...config,
      thresholds: {
        very_hot_C: 35,
        very_cold_C: 0,
        very_wet_mm_per_day: 20,
        very_windy_m_s: 10,
        uncomfortable_heat_index: 32,
      }
    };

    navigate('/dashboard', {
      state: {
        selectedLocation: location,
        analysisConfig: fullConfig
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
                <h1 className="text-xl font-bold">Skyra</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
       
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container  py-6">
        <MultistepForm onAnalyze={handleAnalyze} />
      </main>
    </div>
  );
};

export default Landing;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import MultistepForm from '@/components/MultistepForm';
import Header from '@/components/Header';

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
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MultistepForm onAnalyze={handleAnalyze} />
      </main>
    </div>
  );
};

export default Landing;
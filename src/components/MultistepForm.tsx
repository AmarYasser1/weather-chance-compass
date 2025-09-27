import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LocationStep from './steps/LocationStep';
import DateStep from './steps/DateStep';
import ReviewStep from './steps/ReviewStep';

interface Location {
  lat: number;
  lon: number;
  name?: string;
}

interface AnalysisConfig {
  date: string;
  timeWindow?: { days_before: number; days_after: number };
}

interface MultistepFormProps {
  onAnalyze: (location: Location, config: AnalysisConfig) => void;
}

const MultistepForm: React.FC<MultistepFormProps> = ({ onAnalyze }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig | undefined>();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    'Select Location',
    'Choose Date & Time',
    'Review & Analyze'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleDateSubmit = (config: AnalysisConfig) => {
    setAnalysisConfig(config);
  };

  const handleAnalyze = () => {
    if (selectedLocation && analysisConfig) {
      onAnalyze(selectedLocation, analysisConfig);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return !!selectedLocation;
      case 2:
        return !!analysisConfig;
      case 3:
        return selectedLocation && analysisConfig;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Weather Analysis Setup</h2>
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between text-sm">
                {stepTitles.map((title, index) => (
                  <span
                    key={index}
                    className={`${
                      index + 1 <= currentStep
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <LocationStep
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
        )}
        
        {currentStep === 2 && (
          <DateStep
            onDateSubmit={handleDateSubmit}
            selectedDate={analysisConfig?.date}
            selectedTimeWindow={analysisConfig?.timeWindow}
          />
        )}
        
        {currentStep === 3 && (
          <ReviewStep
            selectedLocation={selectedLocation}
            analysisConfig={analysisConfig}
            onAnalyze={handleAnalyze}
          />
        )}
      </div>

      {/* Navigation */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleAnalyze}
                disabled={!canProceedToNext()}
                size="lg"
                className="px-8"
              >
                Analyze Weather
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultistepForm;
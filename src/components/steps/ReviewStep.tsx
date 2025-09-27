import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Database, TrendingUp, Info } from 'lucide-react';

interface Location {
  lat: number;
  lon: number;
  name?: string;
}

interface AnalysisConfig {
  date: string;
  timeWindow?: { days_before: number; days_after: number };
}

interface ReviewStepProps {
  selectedLocation?: Location;
  analysisConfig?: AnalysisConfig;
  onAnalyze: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  selectedLocation,
  analysisConfig,
  onAnalyze
}) => {
  const getTotalDays = () => {
    if (!analysisConfig?.timeWindow) return 1;
    const before = analysisConfig.timeWindow.days_before || 0;
    const after = analysisConfig.timeWindow.days_after || 0;
    return before + after + 1;
  };

  const isReady = selectedLocation && analysisConfig;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Summary */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Location</p>
              {selectedLocation ? (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                  </p>
                  {selectedLocation.name && (
                    <p className="text-sm">{selectedLocation.name}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-destructive">No location selected</p>
              )}
            </div>
          </div>

          {/* Date Summary */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Analysis Period</p>
              {analysisConfig ? (
                <div>
                  <p className="text-sm">
                    Target Date: {new Date(analysisConfig.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analysisConfig.timeWindow?.days_before || 0} days before, {' '}
                    {analysisConfig.timeWindow?.days_after || 0} days after
                  </p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {getTotalDays()} total days
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-destructive">No date selected</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4" />
            About This Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This analysis uses NASA MERRA-2 reanalysis data to compute historical weather 
            probabilities for your selected location and date.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-medium">Data Source</p>
              <p className="text-muted-foreground">NASA GES DISC MERRA-2</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Time Range</p>
              <p className="text-muted-foreground">1980-present</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Resolution</p>
              <p className="text-muted-foreground">~50km spatial</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Variables</p>
              <p className="text-muted-foreground">T2M, PRECTOT, U10M, V10M, QV2M</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Database className="h-4 w-4 text-primary" />
            <Badge variant="outline" className="text-xs">
              Historical Data: 1980-2025
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Card */}
      <Card className={`${isReady 
        ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent' 
        : 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent'
      }`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {isReady ? (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Ready for Analysis!</h3>
                  <p className="text-sm text-muted-foreground">
                    All information has been provided. Click below to analyze weather probabilities 
                    using NASA MERRA-2 historical data.
                  </p>
                </div>
                <Button 
                  onClick={onAnalyze}
                  size="lg"
                  className="px-8"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analyze Weather Probabilities
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-destructive">Missing Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Please complete all previous steps before proceeding with the analysis.
                  </p>
                </div>
                <Button disabled size="lg" variant="outline">
                  Complete Previous Steps
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
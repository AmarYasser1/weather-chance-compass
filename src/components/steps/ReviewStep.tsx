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
    <div>
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
 

      {/* Action Card */}
     
    </div>
  );
};

export default ReviewStep;
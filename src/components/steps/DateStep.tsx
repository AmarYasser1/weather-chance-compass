import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface AnalysisConfig {
  date: string;
  timeWindow?: { days_before: number; days_after: number };
}

interface DateStepProps {
  onDateSubmit: (config: AnalysisConfig) => void;
  selectedDate?: string;
  selectedTimeWindow?: { days_before: number; days_after: number };
}

const DateStep: React.FC<DateStepProps> = ({
  onDateSubmit,
  selectedDate,
  selectedTimeWindow
}) => {
  const [date, setDate] = useState(selectedDate || '');
  const [daysBefore, setDaysBefore] = useState(selectedTimeWindow?.days_before?.toString() || '3');
  const [daysAfter, setDaysAfter] = useState(selectedTimeWindow?.days_after?.toString() || '3');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsSubmitted(!!selectedDate);
  }, [selectedDate]);

  const handleSubmit = () => {
    if (date) {
      const config: AnalysisConfig = {
        date,
        timeWindow: {
          days_before: parseInt(daysBefore) || 0,
          days_after: parseInt(daysAfter) || 0
        }
      };
      onDateSubmit(config);
      setIsSubmitted(true);
    }
  };

  const getTotalDays = () => {
    const before = parseInt(daysBefore) || 0;
    const after = parseInt(daysAfter) || 0;
    return before + after + 1; // +1 for the target date itself
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Target Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              When do you want to analyze the weather?
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Choose any date to see historical weather probability patterns
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Analysis Time Window
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              How many days around your target date should we analyze?
            </Label>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="daysBefore" className="text-xs text-muted-foreground">
                  Days Before
                </Label>
                <Input
                  id="daysBefore"
                  placeholder="3"
                  value={daysBefore}
                  onChange={(e) => setDaysBefore(e.target.value)}
                  type="number"
                  min="0"
                  max="30"
                  className="text-center"
                />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">±</div>
                <div className="text-xs text-muted-foreground">Target Date</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="daysAfter" className="text-xs text-muted-foreground">
                  Days After
                </Label>
                <Input
                  id="daysAfter"
                  placeholder="3"
                  value={daysAfter}
                  onChange={(e) => setDaysAfter(e.target.value)}
                  type="number"
                  min="0"
                  max="30"
                  className="text-center"
                />
              </div>
            </div>
            
            <div className="p-3 bg-secondary rounded-lg text-center">
              <p className="text-sm font-medium">
                Total Analysis Period: {getTotalDays()} days
              </p>
              <p className="text-xs text-muted-foreground">
                We'll analyze weather patterns across this entire period
              </p>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!date} 
            className="w-full"
            size="lg"
          >
            Set Date & Time Window
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Display */}
      {isSubmitted && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Date & Time Window Set</p>
                <p className="text-sm text-muted-foreground">
                  Target Date: {new Date(date).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Analysis Window: {daysBefore} days before, {daysAfter} days after
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DateStep;
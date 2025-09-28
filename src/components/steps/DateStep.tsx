import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, useToast } from '../ui/use-toast';
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
  const [date, setDate] = useState<Date | undefined>(selectedDate ? new Date(selectedDate) : undefined);
  const [daysBefore, setDaysBefore] = useState(selectedTimeWindow?.days_before?.toString() || '3');
  const [daysAfter, setDaysAfter] = useState(selectedTimeWindow?.days_after?.toString() || '3');

  // When user picks a date we want to mark the step as ready immediately:
  const handleDateChange = (selected?: Date) => {
    setDate(selected);
    if (selected) {
      const config: AnalysisConfig = {
        date: selected.toISOString().split('T')[0],
        timeWindow: {
          days_before: parseInt(daysBefore) || 0,
          days_after: parseInt(daysAfter) || 0,
        },
      };
      // notify parent that date is selected (step ready)
      onDateSubmit(config);
      // show a confirmation toast with the chosen date/window
      submittoast(selected.toISOString(), daysBefore, daysAfter);
    }
  };


  const submittoast = (
    targetDate?: string,
    before?: string,
    after?: string
  ) => {
    const description =   (
      <div className="text-sm">
        <div>Target Date: {new Date(targetDate).toLocaleDateString()}</div>
        <div>Analysis Window: {before || '0'} days before, {after || '0'} days after</div>
      </div>
    );

    toast({
      title: 'Date & Time Window Set',
      description,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  };



  const handleSubmit = () => {
    if (date) {
      const config: AnalysisConfig = {
        date: date.toISOString().split('T')[0],
        timeWindow: {
          days_before: parseInt(daysBefore) || 0,
          days_after: parseInt(daysAfter) || 0
        }
      };
      onDateSubmit(config);
      submittoast( date?.toISOString(), daysBefore, daysAfter);
    }
  };

  const getTotalDays = () => {
    const before = parseInt(daysBefore) || 0;
    const after = parseInt(daysAfter) || 0;
    return before + after + 1; // +1 for the target date itself
  };

  // Compute start/end dates for display
  const computeWindow = (d?: Date) => {
    if (!d) return { start: null as Date | null, end: null as Date | null };
    const before = parseInt(daysBefore) || 0;
    const after = parseInt(daysAfter) || 0;
    const start = new Date(d);
    start.setDate(d.getDate() - before);
    const end = new Date(d);
    end.setDate(d.getDate() + after);
    return { start, end };
  };

  const window = computeWindow(date);

  return (
    <div className=" space-y-6">
      <Card >
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            Select Target Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3">
            <Label htmlFor="date" className="text-sm font-medium text-card-foreground">
              When do you want to analyze the weather?
            </Label>
            <DatePicker
              date={date}
              onDateChange={handleDateChange}
              placeholder="Choose any date to analyze"
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Choose any date to see historical weather probability patterns
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className=" backdrop-blur-sm border-border/50">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Clock className="h-5 w-5 text-primary" />
            Analysis Time Window
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-card-foreground">
              How many days around your target date should we analyze?
            </Label>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="daysBefore" className="text-xs text-muted-foreground">
                  Days Before
                </Label>
                <Input
                  id="daysBefore"
                  value={daysBefore}
                  onChange={(e) => setDaysBefore(e.target.value)}
                  type="number"
                  min="0"
                  max="30"
                  className="text-center   "
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
                  
                  value={daysAfter}
                  onChange={(e) => setDaysAfter(e.target.value)}
                  type="number"
                  min="0"
                  max="30"
                  className="text-center "
                />
              </div>
            </div>
            
            <div className="p-4 bg-secondary/50 rounded-lg text-center border border-border/30">
              <p className="text-sm font-medium text-secondary-foreground">
                Total Analysis Period: {getTotalDays()} days
              </p>
              <p className="text-xs text-muted-foreground">
                We'll analyze weather patterns across this entire period
              </p>
              {window.start && window.end && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <div>From: <span className="font-medium text-card-foreground">{window.start.toLocaleDateString()}</span> (day {window.start.getDate()})</div>
                  <div>To: <span className="font-medium text-card-foreground">{window.end.toLocaleDateString()}</span> (day {window.end.getDate()})</div>
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!date} 
            className="w-full bg-primary text-primary-foreground"
            size="lg"
          >
            Set Date & Time Window
          </Button>
        </CardContent>
      </Card>


    </div>
  );
};

export default DateStep;
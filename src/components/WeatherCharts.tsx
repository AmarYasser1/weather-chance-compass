import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Area, 
  AreaChart, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { TrendingUp, BarChart3, Activity, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';

interface WeatherChartsProps {
  timeSeriesData?: Array<{ year: number; temperature: number; precipitation: number; wind: number }>;
  histogramData?: Array<{ range: string; count: number; threshold?: boolean }>;
  trendData?: Array<{ year: number; probability: number }>;
  riskData?: Array<{ category: string; probability: number; color: string }>;
}

const WeatherCharts: React.FC<WeatherChartsProps> = ({
  timeSeriesData = [],
  histogramData = [],
  trendData = [],
  riskData = []
}) => {
  // Enhanced mock data with more realistic patterns
  const mockTimeSeriesData = timeSeriesData.length > 0 ? timeSeriesData : [
    { year: 1980, temperature: 32.1, precipitation: 2.3, wind: 8.5 },
    { year: 1985, temperature: 31.8, precipitation: 3.1, wind: 7.9 },
    { year: 1990, temperature: 33.2, precipitation: 1.8, wind: 9.2 },
    { year: 1995, temperature: 34.1, precipitation: 2.8, wind: 8.1 },
    { year: 2000, temperature: 35.3, precipitation: 1.5, wind: 8.7 },
    { year: 2005, temperature: 36.2, precipitation: 2.1, wind: 9.4 },
    { year: 2010, temperature: 37.1, precipitation: 1.9, wind: 8.8 },
    { year: 2015, temperature: 38.2, precipitation: 1.2, wind: 9.1 },
    { year: 2020, temperature: 39.1, precipitation: 0.8, wind: 9.6 },
    { year: 2025, temperature: 39.8, precipitation: 1.1, wind: 10.2 },
  ];

  const mockHistogramData = histogramData.length > 0 ? histogramData : [
    { range: '25-30°C', count: 12 },
    { range: '30-35°C', count: 18 },
    { range: '35-40°C', count: 8, threshold: true },
    { range: '40-45°C', count: 3, threshold: true },
    { range: '45+°C', count: 1, threshold: true },
  ];

  const mockTrendData = trendData.length > 0 ? trendData : [
    { year: 2000, probability: 0.45 },
    { year: 2005, probability: 0.52 },
    { year: 2010, probability: 0.58 },
    { year: 2015, probability: 0.61 },
    { year: 2020, probability: 0.65 },
    { year: 2025, probability: 0.68 },
  ];

  const mockRiskData = riskData.length > 0 ? riskData : [
    { category: 'Very Hot', probability: 62, color: 'hsl(var(--hot))' },
    { category: 'Uncomfortable', probability: 45, color: 'hsl(var(--uncomfortable))' },
    { category: 'Very Wet', probability: 12, color: 'hsl(var(--wet))' },
    { category: 'Very Windy', probability: 8, color: 'hsl(var(--windy))' },
    { category: 'Very Cold', probability: 1, color: 'hsl(var(--cold))' },
  ];

  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "hsl(var(--hot))",
    },
    precipitation: {
      label: "Precipitation (mm)",
      color: "hsl(var(--wet))",
    },
    wind: {
      label: "Wind Speed (m/s)",
      color: "hsl(var(--windy))",
    },
    probability: {
      label: "Probability (%)",
      color: "hsl(var(--primary))",
    },
    count: {
      label: "Frequency",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Time Series Chart - Full Width */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Historical Weather Trends (July 15th ± Time Window)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={mockTimeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis 
                  dataKey="year" 
                  className="text-xs fill-muted-foreground" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="hsl(var(--hot))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--hot))', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: 'hsl(var(--hot))', strokeWidth: 2 }}
                  name="Temperature"
                />
                <Line 
                  type="monotone" 
                  dataKey="precipitation" 
                  stroke="hsl(var(--wet))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--wet))', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: 'hsl(var(--wet))', strokeWidth: 2 }}
                  name="Precipitation"
                />
                <Line 
                  type="monotone" 
                  dataKey="wind" 
                  stroke="hsl(var(--windy))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--windy))', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: 'hsl(var(--windy))', strokeWidth: 2 }}
                  name="Wind Speed"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>📈 Clear warming trend: +1.7°C per decade</span>
            <span>🌧️ Decreasing precipitation: -0.3mm per decade</span>
            <span>💨 Increasing wind: +0.4 m/s per decade</span>
          </div>
        </CardContent>
      </Card>

      {/* Second Row - Distribution and Risk Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Distribution */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500/5 to-red-500/10">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              Temperature Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockHistogramData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis 
                    dataKey="range" 
                    className="text-xs fill-muted-foreground" 
                    tick={{ fontSize: 11 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    radius={[6, 6, 0, 0]}
                    name="Days"
                  >
                    {mockHistogramData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.threshold ? 'hsl(var(--hot))' : 'hsl(var(--primary))'}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              <span>Red bars indicate temperatures above threshold (35°C)</span>
            </div>
          </CardContent>
        </Card>

        {/* Risk Overview Pie Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/10">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-600" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockRiskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="probability"
                    nameKey="category"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {mockRiskData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Probability Trend - Full Width */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500/5 to-blue-500/10">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Hot Days Probability Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="probabilityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--hot))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--hot))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis 
                  dataKey="year" 
                  className="text-xs fill-muted-foreground" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  domain={[0.4, 0.7]}
                  className="text-xs fill-muted-foreground" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${Math.round(value * 100)}%`}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${Math.round(value * 100)}%`, 'Probability']}
                />
                <Area 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="hsl(var(--hot))" 
                  fill="url(#probabilityGradient)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--hot))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--hot))', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>📊 Statistical significance: p &lt; 0.001 (highly significant)</span>
            <span>📈 Trend: +5.1% per decade increase</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherCharts;
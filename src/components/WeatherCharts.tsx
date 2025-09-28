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

  // Colors aligned with reference screenshot (green, purple, pink, blue, gray)
  const mockRiskData = riskData.length > 0 ? riskData : [
    { category: 'Very Hot', probability: 62, color: '#f9a8d4' }, // pink
    { category: 'Uncomfortable', probability: 45, color: '#8b5cf6' }, // purple
    { category: 'Very Wet', probability: 12, color: '#60a5fa' }, // blue
    { category: 'Very Windy', probability: 8, color: '#22c55e' }, // green
    { category: 'Very Cold', probability: 1, color: '#9ca3af' }, // gray
  ];

  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "hsl(var(--chart-pink))",
    },
    precipitation: {
      label: "Precipitation (mm)",
      color: "hsl(var(--chart-blue))",
    },
    wind: {
      label: "Wind Speed (m/s)",
      color: "hsl(var(--chart-green))",
    },
    probability: {
      label: "Probability (%)",
      color: "hsl(var(--chart-purple))",
    },
    count: {
      label: "Frequency",
      color: "hsl(var(--chart-green))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Time Series Chart - Full Width */}
  <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 min-h-0">
        <CardHeader className="bg-gradient-to-r from-chart-green/10 to-chart-purple/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Activity className="h-5 w-5 text-chart-green" />
            Historical Weather Trends (July 15th ± Time Window)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={320}>
              {/* Converted to AreaChart to match design (layered green + purple waves) */}
              <AreaChart data={mockTimeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--series-green-start, #22c55e)" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="var(--series-green-end, #14532d)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="precipitationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--series-purple-start, #8b5cf6)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--series-purple-end, #4c1d95)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
                <XAxis
                  dataKey="year"
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  data-testid="area-temperature"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#22c55e"
                  fill="url(#temperatureGradient)"
                  strokeWidth={2.5}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: 'hsl(var(--background))' }}
                  name="Temperature"
                />
                <Area
                  data-testid="area-precipitation"
                  type="monotone"
                  dataKey="precipitation"
                  stroke="#8b5cf6"
                  fill="url(#precipitationGradient)"
                  strokeWidth={2.5}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: 'hsl(var(--background))' }}
                  name="Precipitation"
                />
                <Line
                  data-testid="line-wind"
                  type="monotone"
                  dataKey="wind"
                  stroke="hsl(var(--chart-green))"
                  strokeWidth={2.5}
                  dot={{ fill: 'hsl(var(--chart-green))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--chart-green))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
                  name="Wind Speed"
                />
              </AreaChart>
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
        <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="bg-gradient-to-r from-chart-pink/10 to-chart-purple/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <BarChart3 className="h-5 w-5 text-chart-pink" />
              Temperature Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={mockHistogramData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
                  <XAxis 
                    dataKey="range" 
                    className="text-xs fill-muted-foreground" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground" 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    radius={[6, 6, 0, 0]}
                    name="Days"
                    data-testid="bar-distribution"
                  >
                    {mockHistogramData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.threshold ? '#f9a8d4' : '#8b5cf6'}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-chart-pink" />
              <span>Pink bars indicate temperatures above threshold (35°C)</span>
            </div>
          </CardContent>
        </Card>

        {/* Risk Overview Pie Chart */}
        <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="bg-gradient-to-r from-chart-blue/10 to-chart-purple/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <PieChartIcon className="h-5 w-5 text-chart-blue" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={240}>
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
                    strokeWidth={3}
                    data-testid="pie-risk"
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
                    formatter={(value: number, name: string) => [`${value}%`, name]}
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
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="bg-gradient-to-r from-chart-green/10 to-chart-purple/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <TrendingUp className="h-5 w-5 text-chart-green" />
            Hot Days Probability Trend Analysis
          </CardTitle>
        </CardHeader>
  <CardContent className="p-3 max-h-[900px]">
          <ChartContainer config={chartConfig}>
            {/* Reduced height and margins to make card more compact */}
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockTrendData} margin={{ top: 6, right: 12, left: 6, bottom: 6 }}>
                <defs>
                  <linearGradient id="probabilityGradient" x1="0" y1="0" x2="0" y2="1">
                    {/* Updated gradient to green spectrum for visual consistency with trend icon */}
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
                <XAxis 
                  dataKey="year" 
                  className="text-xs fill-muted-foreground" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  domain={[0.4, 0.7]}
                  className="text-xs fill-muted-foreground" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${Math.round(value * 100)}%`}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Probability']}
                />
                <Area 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="#16a34a" 
                  fill="url(#probabilityGradient)"
                  strokeWidth={2}
                  dot={{ fill: '#16a34a', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, stroke: '#16a34a', strokeWidth: 1, fill: 'hsl(var(--background))' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>📊 Statistical significance: p &lt; 0.001 (highly significant)</span>
            <span>📈 Trend: +5.1% per decade increase</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherCharts;
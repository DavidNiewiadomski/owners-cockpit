
import React from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, Sun, CloudRain } from 'lucide-react';

interface WeatherConditionsProps {
  projectId?: string;
}

const WeatherConditions: React.FC<WeatherConditionsProps> = ({ projectId }) => {
  const weather = {
    current: { temp: 75, condition: 'sunny', humidity: 45 },
    forecast: [
      { day: 'Today', condition: 'sunny', high: 78, low: 65 },
      { day: 'Tomorrow', condition: 'cloudy', high: 72, low: 60 },
      { day: 'Wed', condition: 'rainy', high: 68, low: 58 }
    ]
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-4 h-4 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-4 h-4 text-blue-500" />;
      default: return <Sun className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        {getWeatherIcon(weather.current.condition)}
        <h3 className="text-sm font-medium text-muted-foreground">Weather Conditions</h3>
      </div>
      
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-2xl font-bold">{weather.current.temp}°F</div>
          <div className="text-xs text-muted-foreground capitalize">{weather.current.condition}</div>
        </div>
        
        <div className="space-y-1">
          {weather.forecast.map((day, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <span>{day.day}</span>
              <div className="flex items-center gap-1">
                {getWeatherIcon(day.condition)}
                <span>{day.high}°/{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export { WeatherConditions };

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  Gauge,
  Sunrise,
  Sunset
} from "lucide-react";
import { format } from "date-fns";

// Mock weather data that changes based on time of day
const getWeatherData = (currentTime: Date) => {
  const hour = currentTime.getHours();
  const isDay = hour >= 6 && hour < 18;
  
  // Different weather scenarios based on time
  const weatherScenarios = [
    {
      condition: "Sunny",
      temperature: 72,
      feelsLike: 75,
      humidity: 45,
      windSpeed: 8,
      windDirection: "SW",
      visibility: 10,
      pressure: 30.2,
      uvIndex: isDay ? 6 : 0,
      icon: Sun,
      description: "Perfect barn day",
      backgroundColor: "from-yellow-400/20 to-orange-400/20",
      sunrise: "6:24 AM",
      sunset: "7:45 PM"
    },
    {
      condition: "Partly Cloudy", 
      temperature: 68,
      feelsLike: 70,
      humidity: 55,
      windSpeed: 12,
      windDirection: "W",
      visibility: 8,
      pressure: 29.9,
      uvIndex: isDay ? 4 : 0,
      icon: Cloud,
      description: "Great for outdoor activities",
      backgroundColor: "from-blue-400/20 to-gray-400/20",
      sunrise: "6:25 AM",
      sunset: "7:44 PM"
    },
    {
      condition: "Light Rain",
      temperature: 63,
      feelsLike: 65,
      humidity: 78,
      windSpeed: 15,
      windDirection: "NW", 
      visibility: 6,
      pressure: 29.6,
      uvIndex: isDay ? 2 : 0,
      icon: CloudRain,
      description: "Indoor activities recommended",
      backgroundColor: "from-blue-500/20 to-gray-500/20",
      sunrise: "6:26 AM",
      sunset: "7:43 PM"
    }
  ];

  // Cycle through scenarios based on the minute for demo purposes
  const scenario = weatherScenarios[Math.floor(currentTime.getMinutes() / 20) % weatherScenarios.length];
  return scenario;
};

export function WeatherWidget({ currentTime }: { currentTime: Date }) {
  const [weather, setWeather] = useState(getWeatherData(currentTime));
  
  useEffect(() => {
    setWeather(getWeatherData(currentTime));
  }, [currentTime]);

  const WeatherIcon = weather.icon;

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${weather.backgroundColor} backdrop-blur-sm border-border/50 shadow-barn`}>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Weather Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <WeatherIcon className="w-16 h-16 text-yellow-500 animate-pulse" />
                <div className="absolute -inset-2 bg-yellow-500/20 rounded-full animate-ping" />
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground">
                  {weather.temperature}°F
                </div>
                <div className="text-sm text-muted-foreground">
                  Feels like {weather.feelsLike}°F
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="text-xs">
                {weather.condition}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {weather.description}
              </div>
            </div>
          </div>

          {/* Time Info */}
          <div className="lg:col-span-1 space-y-2">
            <div className="text-2xl lg:text-3xl font-bold text-foreground">
              {format(currentTime, 'h:mm:ss a')}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(currentTime, 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
              <div className="flex items-center gap-1">
                <Sunrise className="w-3 h-3" />
                {weather.sunrise}
              </div>
              <div className="flex items-center gap-1">
                <Sunset className="w-3 h-3" />
                {weather.sunset}
              </div>
            </div>
          </div>

          {/* Detailed Weather Data */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg backdrop-blur-sm">
                <Droplets className="w-3 h-3 text-blue-500" />
                <div>
                  <div className="font-medium">Humidity</div>
                  <div className="text-muted-foreground">{weather.humidity}%</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg backdrop-blur-sm">
                <Wind className="w-3 h-3 text-green-500" />
                <div>
                  <div className="font-medium">Wind</div>
                  <div className="text-muted-foreground">{weather.windSpeed} mph {weather.windDirection}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg backdrop-blur-sm">
                <Eye className="w-3 h-3 text-purple-500" />
                <div>
                  <div className="font-medium">Visibility</div>
                  <div className="text-muted-foreground">{weather.visibility} mi</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg backdrop-blur-sm">
                <Gauge className="w-3 h-3 text-orange-500" />
                <div>
                  <div className="font-medium">Pressure</div>
                  <div className="text-muted-foreground">{weather.pressure} in</div>
                </div>
              </div>
              
              {weather.uvIndex > 0 && (
                <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg backdrop-blur-sm col-span-2">
                  <Sun className="w-3 h-3 text-yellow-500" />
                  <div>
                    <div className="font-medium">UV Index</div>
                    <div className="text-muted-foreground">
                      {weather.uvIndex} - {weather.uvIndex < 3 ? 'Low' : weather.uvIndex < 6 ? 'Moderate' : weather.uvIndex < 8 ? 'High' : 'Very High'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
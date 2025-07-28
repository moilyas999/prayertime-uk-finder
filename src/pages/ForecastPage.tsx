import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Calendar, RefreshCw, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DayPrayerTimes {
  date: string;
  dayName: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export default function ForecastPage() {
  const [searchParams] = useSearchParams();
  const [forecast, setForecast] = useState<DayPrayerTimes[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const postcode = searchParams.get('postcode');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const location = searchParams.get('location'); // 'gps' or null

  useEffect(() => {
    if ((!postcode && !location) || !lat || !lng) {
      navigate('/postcode');
      return;
    }

    generateForecast();
  }, [postcode, lat, lng, location]);

  const generateForecast = async () => {
    if (!lat || !lng) return;

    setLoading(true);
    try {
      const forecastData: DayPrayerTimes[] = [];
      const today = new Date();
      
      // Generate 30 days of forecasts
      for (let i = 0; i < 30; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        try {
          const response = await fetch(
            `https://api.aladhan.com/v1/timings/${Math.floor(currentDate.getTime() / 1000)}?latitude=${lat}&longitude=${lng}&method=2`
          );
          
          if (!response.ok) continue;

          const data = await response.json();
          const timings = data.data.timings;

          forecastData.push({
            date: currentDate.toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short',
              year: 'numeric'
            }),
            dayName: currentDate.toLocaleDateString('en-GB', { weekday: 'short' }),
            fajr: timings.Fajr,
            sunrise: timings.Sunrise,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha
          });

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`Error fetching prayer times for day ${i}:`, error);
        }
      }

      setForecast(forecastData);
    } catch (error: any) {
      console.error('Error generating forecast:', error);
      toast({
        title: "Forecast Error",
        description: "Unable to generate 30-day forecast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          forecast,
          location: location === 'gps' ? 'Current Location' : postcode,
          title: `Prayer Times - ${location === 'gps' ? 'GPS Location' : postcode}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `prayer-times-${location === 'gps' ? 'gps' : postcode}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF Downloaded!",
        description: "Your prayer times calendar has been saved."
      });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      
      // Fallback: Generate simple text format
      const textContent = generateTextForecast();
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prayer-times-${location === 'gps' ? 'gps' : postcode}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Text File Downloaded",
        description: "PDF generation failed, but we've saved a text version for you."
      });
    }
  };

  const generateTextForecast = (): string => {
    const header = `Prayer Times - 30 Day Forecast\n${location === 'gps' ? 'GPS Location' : postcode}\nGenerated: ${new Date().toLocaleDateString('en-GB')}\n\n`;
    
    const content = forecast.map(day => 
      `${day.date} (${day.dayName})\n` +
      `Fajr: ${day.fajr}  Sunrise: ${day.sunrise}  Dhuhr: ${day.dhuhr}\n` +
      `Asr: ${day.asr}  Maghrib: ${day.maghrib}  Isha: ${day.isha}\n\n`
    ).join('');

    return header + content;
  };

  const weeksData = [];
  for (let i = 0; i < forecast.length; i += 7) {
    weeksData.push(forecast.slice(i, i + 7));
  }

  const currentWeekData = weeksData[currentWeek] || [];

  return (
    <div className="min-h-screen bg-gradient-day">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={() => {
            const params = new URLSearchParams();
            if (postcode) params.set('postcode', postcode);
            if (lat) params.set('lat', lat);
            if (lng) params.set('lng', lng);
            if (location) params.set('location', location);
            navigate(`/results?${params.toString()}`);
          }}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Today
        </Button>
      </div>

      <div className="px-4 pb-8 max-w-4xl mx-auto">
        {/* Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                30-Day Forecast
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{location === 'gps' ? 'Current GPS Location' : postcode}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={generateForecast}
                disabled={loading}
                size="sm"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
              <Button 
                onClick={generatePDF}
                disabled={loading || forecast.length === 0}
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Generating 30-day forecast...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
          </div>
        ) : (
          <>
            {/* Week Navigation */}
            {weeksData.length > 1 && (
              <div className="flex justify-center gap-2 mb-6">
                {weeksData.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentWeek === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentWeek(index)}
                  >
                    Week {index + 1}
                  </Button>
                ))}
              </div>
            )}

            {/* Weekly View */}
            <div className="space-y-4">
              {currentWeekData.map((day, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-7 gap-4 items-center">
                    {/* Date */}
                    <div className="col-span-1">
                      <div className="text-sm font-medium">{day.dayName}</div>
                      <div className="text-xs text-muted-foreground">{day.date}</div>
                    </div>
                    
                    {/* Prayer Times */}
                    <div className="col-span-6 grid grid-cols-6 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Fajr</div>
                        <div className="font-mono font-medium">{day.fajr}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Sunrise</div>
                        <div className="font-mono text-amber-600">{day.sunrise}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Dhuhr</div>
                        <div className="font-mono font-medium">{day.dhuhr}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Asr</div>
                        <div className="font-mono font-medium">{day.asr}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Maghrib</div>
                        <div className="font-mono font-medium">{day.maghrib}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Isha</div>
                        <div className="font-mono font-medium">{day.isha}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card className="p-4 mt-6 bg-secondary/10 border-secondary text-center">
              <h3 className="font-semibold mb-2">📅 Planning Made Easy</h3>
              <p className="text-sm text-muted-foreground">
                Download this forecast as PDF to print and share with your mosque or family
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
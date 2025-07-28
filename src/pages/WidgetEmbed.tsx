import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PrayerTimeCard } from "@/components/PrayerTimeCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerTime {
  name: string;
  time: string;
  status: 'past' | 'current' | 'upcoming';
}

interface WidgetConfig {
  postcode: string;
  theme: string;
  size: string;
}

export default function WidgetEmbed() {
  const { widgetId } = useParams();
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (widgetId) {
      loadWidget();
    }
  }, [widgetId]);

  useEffect(() => {
    if (config) {
      fetchPrayerTimes();
    }
  }, [config]);

  const loadWidget = async () => {
    try {
      const { data, error } = await supabase
        .from('widget_instances')
        .select('*')
        .eq('id', widgetId)
        .single();

      if (error) throw error;

      setConfig({
        postcode: data.postcode,
        theme: data.theme,
        size: data.size
      });
    } catch (error: any) {
      console.error('Error loading widget:', error);
      setError('Widget not found');
      setLoading(false);
    }
  };

  const convertPostcodeToCoords = async (postcode: string) => {
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
      const data = await response.json();
      
      if (data.status === 200) {
        return {
          lat: data.result.latitude,
          lng: data.result.longitude
        };
      } else {
        throw new Error('Postcode not found');
      }
    } catch (error) {
      throw new Error('Unable to find location for this postcode');
    }
  };

  const fetchPrayerTimes = async () => {
    if (!config) return;

    try {
      // Convert postcode to coordinates
      const coords = await convertPostcodeToCoords(config.postcode);

      // Fetch prayer times
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${coords.lat}&longitude=${coords.lng}&method=2`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }

      const data = await response.json();
      const timings: PrayerTimes = data.data.timings;

      // Format prayer times and determine status
      const prayers = [
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Sunrise', time: timings.Sunrise },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha }
      ];

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      const prayersWithStatus = prayers.map(prayer => {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTimeInMinutes = hours * 60 + minutes;

        let status: 'past' | 'current' | 'upcoming';
        if (prayerTimeInMinutes < currentTimeInMinutes - 30) {
          status = 'past';
        } else if (prayerTimeInMinutes <= currentTimeInMinutes + 30) {
          status = 'current';
        } else {
          status = 'upcoming';
        }

        return {
          ...prayer,
          status
        };
      });

      // Find next prayer
      const upcomingPrayers = prayersWithStatus.filter(p => p.status === 'upcoming');
      const next = upcomingPrayers[0] || prayersWithStatus[0];

      setPrayerTimes(prayersWithStatus);
      setNextPrayer(next);

    } catch (error: any) {
      console.error('Error fetching prayer times:', error);
      setError('Unable to fetch prayer times');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className={cn(
        "p-4 text-center",
        config?.theme === 'dark' ? 'bg-card text-card-foreground' : 'bg-card text-card-foreground'
      )}>
        <Clock className="h-8 w-8 mx-auto mb-2 text-destructive" />
        <p className="font-semibold">Error</p>
        <p className="text-sm opacity-75">{error}</p>
      </div>
    );
  }

  if (loading || !config) {
    return (
      <div className="p-4 text-center bg-card text-card-foreground">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
        <p className="text-sm text-muted-foreground">Loading prayer times...</p>
      </div>
    );
  }

  const isCompact = config.size === 'mini';
  const isDark = config.theme === 'dark';

  return (
    <div className={cn(
      "p-3 min-h-full",
      isDark ? 'bg-card text-card-foreground' : 'bg-card text-card-foreground',
      "font-sans"
    )}>
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className={cn("h-4 w-4", isDark ? 'text-primary' : 'text-primary')} />
          <h1 className="font-bold text-lg">SalahClock</h1>
        </div>
        <div className="flex items-center justify-center gap-1 text-xs opacity-75">
          <MapPin className="h-3 w-3" />
          <span>{config.postcode}</span>
          <span>• {new Date().toLocaleDateString('en-GB', { 
            month: 'short', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Countdown (only for non-mini widgets) */}
      {!isCompact && nextPrayer && (
        <div className="mb-4">
          <div className={cn(
            "p-3 rounded-lg text-center",
            isDark ? 'bg-primary/20 border border-primary' : 'bg-primary/10 border border-primary/30'
          )}>
            <p className="text-xs opacity-75 mb-1">Time until {nextPrayer.name}</p>
            <div className="font-mono text-sm font-bold">
              <CountdownDisplay targetTime={nextPrayer.time} />
            </div>
          </div>
        </div>
      )}

      {/* Prayer Times */}
      <div className="space-y-2">
        {prayerTimes.map((prayer) => (
          <div 
            key={prayer.name}
            className={cn(
              "flex items-center justify-between p-2 rounded border",
              nextPrayer?.name === prayer.name && (isDark ? 'bg-accent/20 border-accent' : 'bg-accent/10 border-accent/30'),
              prayer.status === 'past' && 'opacity-60',
              isDark ? 'border-border' : 'border-border'
            )}
          >
            <span className={cn(
              "font-medium text-sm",
              nextPrayer?.name === prayer.name && (isDark ? 'text-accent' : 'text-accent')
            )}>
              {prayer.name}
            </span>
            <span className={cn(
              "font-mono text-sm",
              nextPrayer?.name === prayer.name && 'font-bold'
            )}>
              {prayer.time}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-3 pt-2 border-t border-border">
        <a 
          href="https://salahclock.uk" 
          target="_parent"
          className={cn(
            "text-xs opacity-60 hover:opacity-80 transition-opacity",
            isDark ? 'text-primary' : 'text-primary'
          )}
        >
          Powered by SalahClock.uk
        </a>
      </div>
    </div>
  );
}

function CountdownDisplay({ targetTime }: { targetTime: string }) {
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      const [hours, minutes] = targetTime.split(':').map(Number);
      
      target.setHours(hours, minutes, 0, 0);
      
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      
      const difference = target.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('00:00:00');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return <span>{timeLeft}</span>;
}
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PrayerTimeCard } from "@/components/PrayerTimeCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, MapPin, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const postcode = searchParams.get('postcode');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  useEffect(() => {
    if (!postcode || !lat || !lng) {
      navigate('/postcode');
      return;
    }

    fetchPrayerTimes();
  }, [postcode, lat, lng]);

  const fetchPrayerTimes = async () => {
    if (!lat || !lng) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`
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
      const next = upcomingPrayers[0] || prayersWithStatus[0]; // Default to first prayer if none upcoming today

      setPrayerTimes(prayersWithStatus);
      setNextPrayer(next);

    } catch (error: any) {
      console.error('Error fetching prayer times:', error);
      toast({
        title: "Prayer Times Error",
        description: "Unable to fetch prayer times. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!postcode) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-day">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/postcode')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Change Location
        </Button>
        <Button 
          variant="ghost" 
          onClick={fetchPrayerTimes}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="px-4 pb-4">
        {/* Location */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2 text-center justify-center">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-semibold">{postcode}</span>
            <span className="text-muted-foreground">
              • {new Date().toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading prayer times...</p>
          </div>
        ) : (
          <>
            {/* Countdown Timer */}
            {nextPrayer && (
              <div className="mb-6">
                <CountdownTimer 
                  targetTime={nextPrayer.time}
                  prayerName={nextPrayer.name}
                />
              </div>
            )}

            {/* Prayer Times */}
            <div className="space-y-3 mb-6">
              {prayerTimes.map((prayer) => (
                <PrayerTimeCard 
                  key={prayer.name}
                  prayer={prayer}
                  isNext={nextPrayer?.name === prayer.name}
                />
              ))}
            </div>

            {/* Forecast Button */}
            <Card className="p-4 text-center bg-primary/10 border-primary mb-4">
              <h3 className="font-semibold text-lg mb-2">📅 Plan Ahead</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                View 30-day prayer time forecast and download PDF calendar
              </p>
              <Button 
                variant="default" 
                size="lg"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (postcode) params.set('postcode', postcode);
                  if (lat) params.set('lat', lat);
                  if (lng) params.set('lng', lng);
                  const location = new URLSearchParams(window.location.search).get('location');
                  if (location) params.set('location', location);
                  navigate(`/forecast?${params.toString()}`);
                }}
              >
                View 30-Day Forecast
              </Button>
            </Card>

            {/* Reminder CTA */}
            <Card className="p-6 text-center bg-secondary/10 border-secondary">
              <Bell className="h-8 w-8 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Never Miss a Prayer</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Get daily prayer time reminders delivered to your email
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate(`/reminders?postcode=${encodeURIComponent(postcode)}`)}
              >
                Get Daily Reminders
              </Button>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
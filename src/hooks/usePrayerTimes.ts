import { useState, useCallback } from "react";

interface PrayerTime {
  name: string;
  time: string;
  isNext?: boolean;
}

interface PrayerTimesData {
  location: string;
  date: string;
  prayerTimes: PrayerTime[];
  nextPrayer?: {
    name: string;
    timeRemaining: string;
  };
}

export function usePrayerTimes() {
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPrayerTimes = useCallback(async (postcode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock prayer times data
      const mockPrayerTimes: PrayerTime[] = [
        { name: "Fajr", time: "05:45" },
        { name: "Sunrise", time: "07:15" },
        { name: "Dhuhr", time: "12:30", isNext: true },
        { name: "Asr", time: "15:45" },
        { name: "Maghrib", time: "18:20" },
        { name: "Isha", time: "19:50" }
      ];

      const mockData: PrayerTimesData = {
        location: `${postcode}, United Kingdom`,
        date: new Date().toLocaleDateString("en-GB", { 
          weekday: "long", 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        }),
        prayerTimes: mockPrayerTimes,
        nextPrayer: {
          name: "Dhuhr",
          timeRemaining: "2h 15m"
        }
      };

      setData(mockData);
    } catch (err) {
      setError("Failed to fetch prayer times. Please try again.");
      console.error("Error fetching prayer times:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    searchPrayerTimes,
    reset
  };
}
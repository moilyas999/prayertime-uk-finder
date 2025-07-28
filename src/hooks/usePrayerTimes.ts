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
      // Step 1: Get coordinates from postcode
      const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
      const postcodeData = await postcodeResponse.json();
      
      if (postcodeData.status !== 200) {
        throw new Error('Invalid postcode or postcode not found');
      }

      const { latitude, longitude } = postcodeData.result;
      const location = `${postcodeData.result.admin_district}, ${postcodeData.result.country}`;

      // Step 2: Get prayer times using Aladhan API
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const prayerTimesResponse = await fetch(
        `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      
      if (!prayerTimesResponse.ok) {
        throw new Error('Failed to fetch prayer times from server');
      }

      const prayerTimesData = await prayerTimesResponse.json();
      
      if (prayerTimesData.code !== 200 || !prayerTimesData.data) {
        throw new Error('Invalid prayer times data received');
      }

      // Get today's prayer times
      const todayData = prayerTimesData.data.find((dayData: any) => 
        parseInt(dayData.date.gregorian.day) === day
      );

      if (!todayData) {
        throw new Error('Prayer times not available for today');
      }

      const timings = todayData.timings;
      
      // Format prayer times
      const prayerTimes: PrayerTime[] = [
        { name: "Fajr", time: formatTime(timings.Fajr) },
        { name: "Sunrise", time: formatTime(timings.Sunrise) },
        { name: "Dhuhr", time: formatTime(timings.Dhuhr) },
        { name: "Asr", time: formatTime(timings.Asr) },
        { name: "Maghrib", time: formatTime(timings.Maghrib) },
        { name: "Isha", time: formatTime(timings.Isha) }
      ];

      // Calculate next prayer
      const nextPrayerInfo = calculateNextPrayer(prayerTimes);
      
      // Mark next prayer
      if (nextPrayerInfo) {
        const nextPrayerIndex = prayerTimes.findIndex(p => p.name === nextPrayerInfo.name);
        if (nextPrayerIndex !== -1) {
          prayerTimes[nextPrayerIndex].isNext = true;
        }
      }

      const mockData: PrayerTimesData = {
        location: `${postcode}, ${location}`,
        date: new Date().toLocaleDateString("en-GB", { 
          weekday: "long", 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        }),
        prayerTimes,
        nextPrayer: nextPrayerInfo
      };

      setData(mockData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch prayer times. Please try again.");
      console.error("Error fetching prayer times:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper function to format time from API (removes timezone info)
  const formatTime = (timeString: string): string => {
    const time = timeString.split(' ')[0]; // Remove timezone
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  // Helper function to calculate next prayer and time remaining
  const calculateNextPrayer = (prayers: PrayerTime[]): { name: string; timeRemaining: string } | undefined => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayers) {
      if (prayer.name === "Sunrise") continue; // Skip sunrise as it's not a prayer
      
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime) {
        const timeDiff = prayerTime - currentTime;
        const hoursRemaining = Math.floor(timeDiff / 60);
        const minutesRemaining = timeDiff % 60;
        
        let timeRemaining = "";
        if (hoursRemaining > 0) {
          timeRemaining += `${hoursRemaining}h `;
        }
        timeRemaining += `${minutesRemaining}m`;
        
        return {
          name: prayer.name,
          timeRemaining
        };
      }
    }

    // If no prayer found for today, next prayer is Fajr tomorrow
    const fajr = prayers.find(p => p.name === "Fajr");
    if (fajr) {
      const [hours, minutes] = fajr.time.split(':').map(Number);
      const fajrTime = hours * 60 + minutes;
      const minutesUntilMidnight = (24 * 60) - currentTime;
      const minutesFromMidnightToFajr = fajrTime;
      const totalMinutes = minutesUntilMidnight + minutesFromMidnightToFajr;
      
      const hoursRemaining = Math.floor(totalMinutes / 60);
      const minutesRemaining = totalMinutes % 60;
      
      let timeRemaining = "";
      if (hoursRemaining > 0) {
        timeRemaining += `${hoursRemaining}h `;
      }
      timeRemaining += `${minutesRemaining}m`;
      
      return {
        name: "Fajr",
        timeRemaining
      };
    }

    return undefined;
  };

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
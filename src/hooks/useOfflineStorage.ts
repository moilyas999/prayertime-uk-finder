import { useState, useEffect } from 'react';

interface PrayerTime {
  name: string;
  time: string;
  status: 'past' | 'current' | 'upcoming';
}

interface CachedPrayerData {
  date: string;
  postcode: string;
  prayers: PrayerTime[];
  timestamp: number;
}

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cachePrayerData = (postcode: string, prayers: PrayerTime[]) => {
    const cacheData: CachedPrayerData = {
      date: new Date().toDateString(),
      postcode,
      prayers,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(`prayer-cache-${postcode}`, JSON.stringify(cacheData));
      
      // Cache for the next 7 days
      const weekCache = [];
      for (let i = 0; i < 7; i++) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i);
        weekCache.push({
          ...cacheData,
          date: futureDate.toDateString()
        });
      }
      localStorage.setItem(`prayer-week-cache-${postcode}`, JSON.stringify(weekCache));
    } catch (error) {
      console.error('Error caching prayer data:', error);
    }
  };

  const getCachedPrayerData = (postcode: string): CachedPrayerData | null => {
    try {
      const cached = localStorage.getItem(`prayer-cache-${postcode}`);
      if (!cached) return null;

      const data: CachedPrayerData = JSON.parse(cached);
      const today = new Date().toDateString();
      
      // Check if cache is for today and less than 12 hours old
      if (data.date === today && (Date.now() - data.timestamp) < 12 * 60 * 60 * 1000) {
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Error reading cached prayer data:', error);
      return null;
    }
  };

  const getCachedWeekData = (postcode: string): CachedPrayerData[] => {
    try {
      const cached = localStorage.getItem(`prayer-week-cache-${postcode}`);
      if (!cached) return [];

      const data: CachedPrayerData[] = JSON.parse(cached);
      
      // Check if cache is less than 24 hours old
      if (data.length > 0 && (Date.now() - data[0].timestamp) < 24 * 60 * 60 * 1000) {
        return data;
      }
      
      return [];
    } catch (error) {
      console.error('Error reading cached week data:', error);
      return [];
    }
  };

  const clearCache = () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('prayer-cache-') || key.startsWith('prayer-week-cache-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return {
    isOnline,
    cachePrayerData,
    getCachedPrayerData,
    getCachedWeekData,
    clearCache
  };
}
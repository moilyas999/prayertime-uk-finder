import { useState, useEffect } from 'react';

export type AzanVoice = 'makkah' | 'shortened' | 'local';

interface AzanSettings {
  enabled: boolean;
  voice: AzanVoice;
  volume: number;
  alertMinutes: number; // minutes before prayer time
}

export function useAzanSettings() {
  const [settings, setSettings] = useState<AzanSettings>(() => {
    const saved = localStorage.getItem('salahclock-azan-settings');
    return saved ? JSON.parse(saved) : {
      enabled: false,
      voice: 'makkah',
      volume: 0.8,
      alertMinutes: 2
    };
  });

  useEffect(() => {
    localStorage.setItem('salahclock-azan-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AzanSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const playTestAzan = async (voice: AzanVoice) => {
    try {
      const audioPath = `/azan-${voice}.mp3`;
      const audio = new Audio(audioPath);
      audio.volume = settings.volume;
      await audio.play();
    } catch (error) {
      console.error('Error playing test azan:', error);
    }
  };

  return { settings, updateSettings, playTestAzan };
}
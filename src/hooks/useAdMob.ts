import { useState, useEffect } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { supabase } from '@/integrations/supabase/client';

interface AdSettings {
  ad_type: string;
  location: string;
  is_enabled: boolean;
}

export function useAdMob() {
  const [adSettings, setAdSettings] = useState<AdSettings[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAdMob();
    fetchAdSettings();
  }, []);

  const initializeAdMob = async () => {
    try {
      await AdMob.initialize({
        testingDevices: [], // Add device IDs for testing
        initializeForTesting: true, // Remove in production
      });
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  };

  const fetchAdSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_settings')
        .select('*');
      
      if (error) throw error;
      setAdSettings(data || []);
    } catch (error) {
      console.error('Error fetching ad settings:', error);
    }
  };

  const isAdEnabled = (adType: string, location: string) => {
    const setting = adSettings.find(s => s.ad_type === adType && s.location === location);
    return setting?.is_enabled ?? false;
  };

  const showBannerAd = async (location: string) => {
    if (!isInitialized || !isAdEnabled('banner', location)) return;

    try {
      const options: BannerAdOptions = {
        adId: 'ca-app-pub-3940256099942544/6300978111', // Test banner ad unit
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      };

      await AdMob.showBanner(options);
    } catch (error) {
      console.error('Error showing banner ad:', error);
    }
  };

  const hideBannerAd = async () => {
    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error('Error hiding banner ad:', error);
    }
  };

  const showInterstitialAd = async (location: string) => {
    if (!isInitialized || !isAdEnabled('interstitial', location)) return;

    try {
      const options = {
        adId: 'ca-app-pub-3940256099942544/1033173712', // Test interstitial ad unit
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  };

  return {
    isInitialized,
    isAdEnabled,
    showBannerAd,
    hideBannerAd,
    showInterstitialAd,
    refreshAdSettings: fetchAdSettings
  };
}
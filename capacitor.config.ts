import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.salahclock.prayertimes',
  appName: 'prayertime-uk-finder',
  webDir: 'dist',
  server: {
    url: 'https://36e9019d-1f56-4ad5-be2f-43e6ec5e47c4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-3940256099942544~3347511713', // Test App ID
      initializeForTesting: true
    }
  }
};

export default config;
import { useState, useEffect } from 'react';

export type Language = 'en' | 'ar' | 'ur' | 'bn' | 'tr' | 'fr';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  prayer_times: {
    en: 'Prayer Times',
    ar: 'أوقات الصلاة',
    ur: 'نماز کے اوقات',
    bn: 'নামাজের সময়',
    tr: 'Namaz Vakitleri',
    fr: 'Heures de Prière'
  },
  fajr: {
    en: 'Fajr',
    ar: 'الفجر',
    ur: 'فجر',
    bn: 'ফজর',
    tr: 'Sabah',
    fr: 'Fajr'
  },
  dhuhr: {
    en: 'Dhuhr',
    ar: 'الظهر',
    ur: 'ظہر',
    bn: 'জোহর',
    tr: 'Öğle',
    fr: 'Dhuhr'
  },
  asr: {
    en: 'Asr',
    ar: 'العصر',
    ur: 'عصر',
    bn: 'আসর',
    tr: 'İkindi',
    fr: 'Asr'
  },
  maghrib: {
    en: 'Maghrib',
    ar: 'المغرب',
    ur: 'مغرب',
    bn: 'মাগরিব',
    tr: 'Akşam',
    fr: 'Maghrib'
  },
  isha: {
    en: 'Isha',
    ar: 'العشاء',
    ur: 'عشاء',
    bn: 'এশা',
    tr: 'Yatsı',
    fr: 'Isha'
  },
  next_prayer: {
    en: 'Next Prayer',
    ar: 'الصلاة التالية',
    ur: 'اگلی نماز',
    bn: 'পরবর্তী নামাজ',
    tr: 'Sonraki Namaz',
    fr: 'Prochaine Prière'
  },
  location: {
    en: 'Location',
    ar: 'الموقع',
    ur: 'مقام',
    bn: 'অবস্থান',
    tr: 'Konum',
    fr: 'Emplacement'
  },
  mosque_finder: {
    en: 'Find Mosques',
    ar: 'البحث عن المساجد',
    ur: 'مساجد تلاش کریں',
    bn: 'মসজিদ খুঁজুন',
    tr: 'Cami Bul',
    fr: 'Trouver des Mosquées'
  },
  settings: {
    en: 'Settings',
    ar: 'الإعدادات',
    ur: 'ترتیبات',
    bn: 'সেটিংস',
    tr: 'Ayarlar',
    fr: 'Paramètres'
  },
  download_forecast: {
    en: 'Download 30-Day Forecast',
    ar: 'تحميل توقعات 30 يوم',
    ur: '30 دن کی پیشن گوئی ڈاؤن لوڈ کریں',
    bn: '৩০ দিনের পূর্বাভাস ডাউনলোড করুন',
    tr: '30 Günlük Tahmini İndir',
    fr: 'Télécharger les Prévisions 30 Jours'
  }
};

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('salahclock-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('salahclock-language', currentLanguage);
    
    // Set document direction for RTL languages
    document.dir = ['ar', 'ur'].includes(currentLanguage) ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  const t = (key: string): string => {
    return translations[key]?.[currentLanguage] || key;
  };

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const getLanguageOptions = () => [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  return {
    t,
    currentLanguage,
    changeLanguage,
    getLanguageOptions,
    isRTL: ['ar', 'ur'].includes(currentLanguage)
  };
}
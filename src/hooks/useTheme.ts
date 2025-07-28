import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'mosque';

interface ThemeSettings {
  mode: ThemeMode;
  mosqueColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('salahclock-theme');
    return saved ? JSON.parse(saved) : { mode: 'light' };
  });

  useEffect(() => {
    localStorage.setItem('salahclock-theme', JSON.stringify(theme));
    
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply mosque colors if available
    if (theme.mode === 'mosque' && theme.mosqueColors) {
      root.style.setProperty('--primary', theme.mosqueColors.primary);
      root.style.setProperty('--secondary', theme.mosqueColors.secondary);
      root.style.setProperty('--accent', theme.mosqueColors.accent);
    } else {
      // Reset to default colors
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent');
    }
  }, [theme]);

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
  };

  return { theme, updateTheme };
}
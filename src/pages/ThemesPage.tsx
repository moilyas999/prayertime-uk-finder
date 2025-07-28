import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Palette, Sun, Moon, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme, ThemeMode } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export default function ThemesPage() {
  const navigate = useNavigate();
  const { theme, updateTheme } = useTheme();

  const themes = [
    {
      id: 'light' as ThemeMode,
      name: 'Light Mode',
      description: 'Clean and bright interface',
      icon: Sun,
      preview: 'bg-background border-border text-foreground'
    },
    {
      id: 'dark' as ThemeMode,
      name: 'Dark Mode',
      description: 'Easy on the eyes, perfect for night',
      icon: Moon,
      preview: 'bg-background border-border text-foreground'
    },
    {
      id: 'mosque' as ThemeMode,
      name: 'Mosque Branded',
      description: 'Match your local mosque colors',
      icon: Building,
      preview: 'bg-gradient-to-r from-prayer-active to-prayer-upcoming text-primary-foreground'
    }
  ];

  const handleThemeSelect = (mode: ThemeMode) => {
    updateTheme({ mode });
    
    // If mosque theme is selected, set default mosque colors
    if (mode === 'mosque') {
      updateTheme({
        mode,
        mosqueColors: {
          primary: '186 186 100', // Islamic green in HSL
          secondary: '195 195 85',
          accent: '210 210 90'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Themes & Personalization</h1>
            <p className="text-muted-foreground">Customize your app appearance</p>
          </div>
        </div>

        {/* Theme Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme.mode === themeOption.id;
            
            return (
              <Card 
                key={themeOption.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  isSelected && "ring-2 ring-primary shadow-lg"
                )}
                onClick={() => handleThemeSelect(themeOption.id)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2">
                    <Icon className={cn(
                      "h-8 w-8",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {themeOption.name}
                    {isSelected && <Palette className="h-4 w-4 text-primary" />}
                  </CardTitle>
                  <CardDescription>{themeOption.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Theme Preview */}
                  <div className={cn(
                    "h-24 rounded-lg border-2 p-4 transition-all",
                    themeOption.preview
                  )}>
                    <div className="h-full flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <div className="w-12 h-2 bg-current opacity-60 rounded"></div>
                        <div className="w-6 h-6 bg-current opacity-40 rounded-full"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-current opacity-30 rounded"></div>
                        <div className="w-3/4 h-2 bg-current opacity-20 rounded"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Current Theme</CardTitle>
            <CardDescription>
              Your selected theme will be applied app-wide and saved to your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {(() => {
                const selected = themes.find(t => t.id === theme.mode);
                const Icon = selected?.icon || Palette;
                return (
                  <>
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selected?.name || 'Unknown'}</span>
                    <span className="text-muted-foreground">- {selected?.description}</span>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Mosque Theme Info */}
        {theme.mode === 'mosque' && (
          <Card>
            <CardHeader>
              <CardTitle>Mosque Branding</CardTitle>
              <CardDescription>
                Colors will automatically match your local mosque when available
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Colors adapt based on mosque widget themes</p>
              <p>• Visit mosques that use SalahClock widgets for automatic theming</p>
              <p>• Fallback to Islamic green theme when mosque colors unavailable</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
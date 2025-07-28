import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Moon, Bell, Globe, ArrowLeft, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    prayerAlerts: true,
    dailyReminders: false,
    darkMode: false,
    notifications: true
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Settings Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${!settings[key] ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <header className="py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Customize your experience</p>
          </div>
        </header>

        {/* Notification Settings */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="prayer-alerts" className="text-muted-foreground cursor-pointer">
                Prayer Alerts
              </Label>
              <Switch 
                id="prayer-alerts" 
                checked={settings.prayerAlerts}
                onCheckedChange={() => handleSettingChange('prayerAlerts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminders" className="text-muted-foreground cursor-pointer">
                Daily Reminders
              </Label>
              <Switch 
                id="daily-reminders" 
                checked={settings.dailyReminders}
                onCheckedChange={() => handleSettingChange('dailyReminders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-muted-foreground cursor-pointer">
                All Notifications
              </Label>
              <Switch 
                id="notifications" 
                checked={settings.notifications}
                onCheckedChange={() => handleSettingChange('notifications')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              {settings.darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-muted-foreground cursor-pointer">
                Dark Mode
              </Label>
              <Switch 
                id="dark-mode" 
                checked={settings.darkMode}
                onCheckedChange={() => handleSettingChange('darkMode')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Globe className="h-5 w-5 text-primary" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Language</span>
              <span className="text-foreground font-medium">English (UK)</span>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-card/60 backdrop-blur-sm border-border">
          <CardContent className="p-4 text-center space-y-2">
            <h3 className="font-semibold text-foreground">SalahClock</h3>
            <p className="text-muted-foreground text-sm">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground/70">
              Built with ❤️ for the Muslim community
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
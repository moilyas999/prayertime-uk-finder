import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Moon, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <header className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your experience</p>
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
              <Label htmlFor="prayer-alerts" className="text-muted-foreground">Prayer Alerts</Label>
              <Switch id="prayer-alerts" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminders" className="text-muted-foreground">Daily Reminders</Label>
              <Switch id="daily-reminders" />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Moon className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-muted-foreground">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Globe className="h-5 w-5 text-primary" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">English (UK)</p>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-card/60 backdrop-blur-sm border-border">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-sm">
              SalahClock v1.0.0
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Built with ❤️ for the Muslim community
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
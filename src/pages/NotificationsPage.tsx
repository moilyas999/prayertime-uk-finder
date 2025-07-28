import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Mail, Phone, Clock, User, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function NotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [settings, setSettings] = useState({
    enable_email: true,
    enable_sms: false,
    enable_push: false,
    notification_time: '06:00'
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadNotificationSettings();
  }, [user]);

  const loadNotificationSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Create default settings if they don't exist
        if (error.code === 'PGRST116') {
          await supabase
            .from('user_notification_settings')
            .insert({
              user_id: user.id,
              enable_email: true,
              enable_sms: false,
              enable_push: false,
              notification_time: '06:00'
            });
        } else {
          throw error;
        }
      } else {
        setSettings({
          enable_email: data.enable_email,
          enable_sms: data.enable_sms,
          enable_push: data.enable_push,
          notification_time: data.notification_time || '06:00'
        });
      }
    } catch (error: any) {
      console.error('Error loading notification settings:', error);
      toast({
        title: "Error Loading Settings",
        description: "Unable to load your notification preferences",
        variant: "destructive"
      });
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: user.id,
          ...settings
        });

      if (error) throw error;

      toast({
        title: "Settings Saved!",
        description: "Your notification preferences have been updated."
      });

    } catch (error: any) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save your preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!user) {
    return null;
  }

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-day flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-day">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/account')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Account
        </Button>
      </div>

      <div className="px-4 pb-8 max-w-md mx-auto">
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-4">
              <Bell className="h-6 w-6 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Notification Settings</h1>
            <p className="text-muted-foreground text-sm">
              Choose how you'd like to receive your daily prayer time reminders
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Daily prayer times via email
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.enable_email}
                onCheckedChange={(checked) => handleToggle('enable_email', checked)}
              />
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">SMS Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Text message notifications (coming soon)
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.enable_sms}
                onCheckedChange={(checked) => handleToggle('enable_sms', checked)}
                disabled
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Bell className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Browser/mobile app alerts (coming soon)
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.enable_push}
                onCheckedChange={(checked) => handleToggle('enable_push', checked)}
                disabled
              />
            </div>

            {/* Notification Time */}
            <div className="space-y-3">
              <Label htmlFor="notification-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Daily Reminder Time
              </Label>
              <Input
                id="notification-time"
                type="time"
                value={settings.notification_time}
                onChange={(e) => handleToggle('notification_time', e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Receive your daily prayer schedule at this time each morning
              </p>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSave}
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Preferences"}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              <p>
                SMS and Push notifications are coming soon. 
                Email reminders are fully functional.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
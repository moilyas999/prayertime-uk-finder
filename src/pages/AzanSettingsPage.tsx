import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Volume2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAzanSettings } from '@/hooks/useAzanSettings';
import { useToast } from '@/hooks/use-toast';

export default function AzanSettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings, playTestAzan } = useAzanSettings();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTestAzan = async () => {
    setIsPlaying(true);
    try {
      await playTestAzan(settings.voice);
      toast({
        title: "Test Azan Played",
        description: "This is how your prayer alerts will sound."
      });
    } catch (error) {
      toast({
        title: "Audio Error",
        description: "Could not play test audio. Check your device settings.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive Azan alerts before prayer times."
        });
        updateSettings({ enabled: true });
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        });
      }
    }
  };

  const handleToggle = async (enabled: boolean) => {
    if (enabled && Notification.permission !== 'granted') {
      await requestNotificationPermission();
    } else {
      updateSettings({ enabled });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-foreground">Azan Settings</h1>
            <p className="text-muted-foreground">Configure your prayer call alerts</p>
          </div>
        </div>

        {/* Enable/Disable Azan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Prayer Alerts
            </CardTitle>
            <CardDescription>
              Receive beautiful Azan calls before each prayer time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="azan-enabled" className="text-base">
                Enable Azan Alerts
              </Label>
              <Switch
                id="azan-enabled"
                checked={settings.enabled}
                onCheckedChange={handleToggle}
              />
            </div>
            
            {settings.enabled && (
              <div className="space-y-4 pt-4 border-t">
                {/* Voice Selection */}
                <div className="space-y-2">
                  <Label>Azan Voice</Label>
                  <Select
                    value={settings.voice}
                    onValueChange={(value) => updateSettings({ voice: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="makkah">Standard Azan (Makkah)</SelectItem>
                      <SelectItem value="shortened">Shortened Azan</SelectItem>
                      <SelectItem value="local">Local Mosque Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                  <Label>Volume: {Math.round(settings.volume * 100)}%</Label>
                  <Slider
                    value={[settings.volume]}
                    onValueChange={([value]) => updateSettings({ volume: value })}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Alert Timing */}
                <div className="space-y-2">
                  <Label>Alert Timing: {settings.alertMinutes} minutes before prayer</Label>
                  <Slider
                    value={[settings.alertMinutes]}
                    onValueChange={([value]) => updateSettings({ alertMinutes: value })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Test Button */}
                <Button
                  onClick={handleTestAzan}
                  disabled={isPlaying}
                  className="w-full"
                  variant="outline"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isPlaying ? 'Playing Test...' : 'Test Azan Sound'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Browser notifications must be enabled</p>
            <p>• Keep this tab open or add to home screen</p>
            <p>• Audio alerts will play {settings.alertMinutes} minutes before each prayer</p>
            <p>• Works best when device is not in silent mode</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Crosshair, AlertTriangle, CheckCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function LocationAccessPage() {
  const [autoLocationEnabled, setAutoLocationEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    location,
    loading,
    error,
    requestLocation,
    hasPermission
  } = useGeolocation();

  const handleContinue = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enable location access to continue",
        variant: "destructive"
      });
      return;
    }

    // Save preference if user is logged in
    if (user && autoLocationEnabled) {
      setSaving(true);
      try {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            use_current_location: true,
            auto_location_enabled: true
          });
      } catch (error) {
        console.error('Error saving location preference:', error);
      } finally {
        setSaving(false);
      }
    }

    // Navigate to results with GPS coordinates
    navigate(`/results?location=gps&lat=${location.latitude}&lng=${location.longitude}`);
  };

  const handleSkip = () => {
    navigate('/postcode');
  };

  return (
    <div className="min-h-screen bg-gradient-day">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="px-4 pb-8 max-w-md mx-auto space-y-6">
        {/* Main Card */}
        <Card className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Enable Location Access</h1>
          <p className="text-muted-foreground mb-6">
            Get more accurate prayer times based on your exact location
          </p>

          {/* Permission Status */}
          {hasPermission === null && (
            <div className="flex items-center gap-2 justify-center mb-4 text-muted-foreground">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="text-sm">Checking location permissions...</span>
            </div>
          )}

          {hasPermission === false && (
            <div className="flex items-center gap-2 justify-center mb-4 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Location access not granted</span>
            </div>
          )}

          {hasPermission === true && !location && (
            <div className="flex items-center gap-2 justify-center mb-4 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Location access granted</span>
            </div>
          )}

          {location && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 justify-center text-green-700 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Location Found!</span>
              </div>
              <p className="text-xs text-green-600">
                Latitude: {location.latitude.toFixed(6)}<br />
                Longitude: {location.longitude.toFixed(6)}<br />
                Accuracy: ±{Math.round(location.accuracy)}m
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 justify-center text-red-700 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Location Error</span>
              </div>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Location Request Button */}
          {!location && (
            <Button 
              onClick={requestLocation}
              disabled={loading}
              className="w-full mb-4"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Crosshair className="mr-2 h-4 w-4" />
                  Get My Location
                </>
              )}
            </Button>
          )}

          {/* Auto-location Toggle */}
          {user && location && (
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-4">
              <div className="text-left">
                <Label htmlFor="auto-location" className="font-medium">
                  Always use my location
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically detect your location for prayer times
                </p>
              </div>
              <Switch
                id="auto-location"
                checked={autoLocationEnabled}
                onCheckedChange={setAutoLocationEnabled}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {location && (
              <Button 
                onClick={handleContinue}
                className="w-full"
                size="lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Continue with GPS Location"
                )}
              </Button>
            )}

            <Button 
              variant="outline"
              onClick={handleSkip}
              className="w-full"
            >
              Skip - Enter Postcode Instead
            </Button>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="p-4 bg-secondary/10 border-secondary">
          <h3 className="font-semibold mb-3 text-center">Why Enable Location?</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>More accurate prayer times for your exact location</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Automatic updates when you travel</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>No need to remember postcodes</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
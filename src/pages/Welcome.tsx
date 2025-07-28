import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, Bell, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-day flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Logo/Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <Clock className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">SalahClock</h1>
            <p className="text-lg text-muted-foreground">
              Accurate UK Prayer Times
            </p>
          </div>
        </div>

        {/* Features */}
        <Card className="p-6 text-left">
          <h2 className="text-lg font-semibold mb-4 text-center">Features</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">Postcode-based accurate timings</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">Live countdown to next prayer</span>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">Daily email reminders</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">No registration required</span>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="w-full text-lg py-6"
            onClick={() => navigate('/postcode')}
          >
            Get Started
          </Button>
          <p className="text-xs text-muted-foreground">
            Supporting Muslims across the United Kingdom
          </p>
        </div>
      </div>
    </div>
  );
}
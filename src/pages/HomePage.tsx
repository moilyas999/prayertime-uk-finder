import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Bell, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4 flex flex-col">
      {/* Header */}
      <header className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
          <Clock className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">SalahClock</h1>
        <p className="text-lg text-muted-foreground">Accurate UK Prayer Times</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Quick Access */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-6">
            <Button 
              onClick={() => navigate('/prayer-times')}
              className="w-full h-16 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Clock className="mr-3 h-6 w-6" />
              Find Prayer Times
              <ChevronRight className="ml-auto h-6 w-6" />
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-center text-foreground">Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">Postcode-based accurate timings</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">Live countdown to next prayer</span>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">Daily email reminders</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">No registration required</span>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <Card className="bg-card/60 backdrop-blur-sm border-border">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-sm">
              Welcome to SalahClock! Your Islamic prayer times companion for the UK.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              App is running successfully ✅
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
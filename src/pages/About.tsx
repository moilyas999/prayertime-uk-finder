import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, MapPin, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

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

      <div className="px-4 pb-8 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">SalahClock</h1>
          <p className="text-muted-foreground">Accurate Prayer Times for the UK</p>
        </div>

        {/* About Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              SalahClock was created to serve the Muslim community across the United Kingdom 
              by providing accurate, reliable prayer times based on precise geographic locations. 
              We understand the importance of performing prayers at their correct times and aim 
              to make this as convenient as possible for Muslims living in the UK.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              How It Works
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <span>Enter your UK postcode for precise location-based calculations</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>We use the Aladhan API with the Muslim World League calculation method</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>Get accurate prayer times: Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <span>View live countdown to the next prayer and optional daily reminders</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Data
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                We respect your privacy and are committed to protecting your personal information:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• No account registration required for basic prayer times</li>
                <li>• Reminder signups are voluntary and stored securely</li>
                <li>• We only collect essential information needed for the service</li>
                <li>• Your data is never shared with third parties</li>
                <li>• You can unsubscribe from reminders at any time</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Calculation Method</h2>
            <p className="text-muted-foreground">
              SalahClock uses the <strong>Muslim World League</strong> calculation method, 
              which is widely accepted and used by Islamic organizations globally. The prayer 
              times are calculated based on your exact geographic coordinates derived from 
              your UK postcode, ensuring maximum accuracy for your location.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Future Features</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>We're continuously working to improve SalahClock:</p>
              <ul className="space-y-1 ml-4 mt-2">
                <li>• SMS reminder notifications</li>
                <li>• Mobile app versions for iOS and Android</li>
                <li>• Qibla direction compass</li>
                <li>• Islamic calendar integration</li>
                <li>• Customizable prayer time adjustments</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button 
            size="lg" 
            onClick={() => navigate('/postcode')}
          >
            Find Your Prayer Times
          </Button>
        </div>
      </div>
    </div>
  );
}
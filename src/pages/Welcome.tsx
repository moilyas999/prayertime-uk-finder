import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, Bell, Star } from "lucide-react";

export default function Welcome() {
  console.log("Welcome component rendering...");

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Logo/Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <Clock className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">SalahClock</h1>
            <p className="text-lg text-gray-600">
              Accurate UK Prayer Times
            </p>
          </div>
        </header>

        {/* Features */}
        <section>
        <Card className="p-6 text-left bg-white/80 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">Features</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Postcode-based accurate timings</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Live countdown to next prayer</span>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Daily email reminders</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">No registration required</span>
            </div>
          </div>
        </Card>
        </section>

        {/* Simple Message */}
        <section className="space-y-4">
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg">
            <p className="text-gray-700 text-sm">
              Welcome to SalahClock! Your Islamic prayer times companion for the UK.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              App is loading successfully ✅
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
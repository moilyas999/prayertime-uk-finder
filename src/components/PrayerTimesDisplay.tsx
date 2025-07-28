import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar } from "lucide-react";

interface PrayerTime {
  name: string;
  time: string;
  isNext?: boolean;
}

interface PrayerTimesDisplayProps {
  location: string;
  date: string;
  prayerTimes: PrayerTime[];
  nextPrayer?: {
    name: string;
    timeRemaining: string;
  };
}

export function PrayerTimesDisplay({ location, date, prayerTimes, nextPrayer }: PrayerTimesDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Location and Date */}
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{date}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Prayer Countdown */}
      {nextPrayer && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Next Prayer
              </Badge>
              <h3 className="text-xl font-bold text-foreground">{nextPrayer.name}</h3>
              <p className="text-lg font-semibold text-primary">{nextPrayer.timeRemaining}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prayer Times List */}
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Clock className="h-5 w-5 text-primary" />
            Today's Prayer Times
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {prayerTimes.map((prayer, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                prayer.isNext 
                  ? "bg-primary/10 border border-primary/20" 
                  : "bg-muted/50"
              }`}
            >
              <span className={`font-medium ${
                prayer.isNext ? "text-primary" : "text-foreground"
              }`}>
                {prayer.name}
              </span>
              <span className={`text-lg font-semibold ${
                prayer.isNext ? "text-primary" : "text-muted-foreground"
              }`}>
                {prayer.time}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
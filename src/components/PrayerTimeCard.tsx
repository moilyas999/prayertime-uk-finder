import { Card } from "@/components/ui/card";
import { Clock, Sun, Sunrise, Sunset, Moon, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrayerTime {
  name: string;
  time: string;
  status: 'past' | 'current' | 'upcoming';
}

interface PrayerTimeCardProps {
  prayer: PrayerTime;
  isNext?: boolean;
}

const prayerIcons = {
  Fajr: Sunrise,
  Sunrise: Sun,
  Dhuhr: Sun,
  Asr: Sunset,
  Maghrib: Sunset,
  Isha: Moon
};

export function PrayerTimeCard({ prayer, isNext = false }: PrayerTimeCardProps) {
  const Icon = prayerIcons[prayer.name as keyof typeof prayerIcons] || Clock;
  
  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-lg",
      isNext && "border-prayer-active bg-secondary/10 shadow-md animate-pulse-glow",
      prayer.status === 'current' && "border-prayer-active bg-prayer-active/10",
      prayer.status === 'past' && "opacity-70 grayscale",
      prayer.status === 'upcoming' && "border-prayer-upcoming"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full",
            isNext && "bg-prayer-active text-primary-foreground",
            prayer.status === 'current' && "bg-prayer-active text-primary-foreground",
            prayer.status === 'past' && "bg-muted text-muted-foreground",
            prayer.status === 'upcoming' && "bg-prayer-upcoming text-primary-foreground"
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className={cn(
              "font-semibold",
              isNext && "text-prayer-active",
              prayer.status === 'current' && "text-prayer-active"
            )}>
              {prayer.name}
            </h3>
            {isNext && (
              <p className="text-xs text-muted-foreground">Next Prayer</p>
            )}
          </div>
        </div>
        <div className={cn(
          "text-right",
          isNext && "text-prayer-active font-bold text-lg",
          prayer.status === 'current' && "text-prayer-active font-bold"
        )}>
          <span className="font-mono">{prayer.time}</span>
        </div>
      </div>
    </Card>
  );
}
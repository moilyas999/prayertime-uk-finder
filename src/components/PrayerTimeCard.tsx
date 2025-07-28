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
    <div className={cn(
      "bg-card rounded-2xl p-4 shadow-[0_2px_8px_hsl(0_0%_0%_/_0.08)] transition-all duration-300",
      isNext && "ring-2 ring-primary shadow-[0_4px_12px_hsl(158_86%_25%_/_0.2)]",
      prayer.status === 'current' && "ring-2 ring-primary",
      prayer.status === 'past' && "opacity-60",
      prayer.status === 'upcoming' && "border border-accent/20"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl",
            isNext && "bg-primary text-primary-foreground",
            prayer.status === 'current' && "bg-primary text-primary-foreground",
            prayer.status === 'past' && "bg-muted text-muted-foreground",
            prayer.status === 'upcoming' && "bg-accent/10 text-accent-foreground"
          )}>
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className={cn(
              "font-semibold text-base",
              isNext && "text-primary",
              prayer.status === 'current' && "text-primary"
            )}>
              {prayer.name}
            </h3>
            {isNext && (
              <p className="text-xs text-accent font-medium">Next Prayer</p>
            )}
          </div>
        </div>
        <div className={cn(
          "text-right",
          isNext && "text-primary font-bold text-xl",
          prayer.status === 'current' && "text-primary font-bold text-lg"
        )}>
          <span className="font-mono text-lg">{prayer.time}</span>
          {isNext && (
            <p className="text-xs text-muted-foreground mt-1">In 2h 14m</p>
          )}
        </div>
      </div>
    </div>
  );
}
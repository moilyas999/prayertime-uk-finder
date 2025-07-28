import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetTime: string;
  prayerName: string;
}

export function CountdownTimer({ targetTime, prayerName }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      const [hours, minutes] = targetTime.split(':').map(Number);
      
      target.setHours(hours, minutes, 0, 0);
      
      // If target time has passed today, set it for tomorrow
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      
      const difference = target.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <Card className="p-6 bg-gradient-day border-prayer-upcoming/30">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-prayer-upcoming" />
          <h2 className="text-lg font-semibold text-prayer-upcoming">
            Time until {prayerName}
          </h2>
        </div>
        <div className="flex justify-center gap-4 text-2xl font-mono font-bold text-prayer-upcoming">
          <div className="text-center animate-countdown">
            <div>{timeLeft.hours.toString().padStart(2, '0')}</div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
          <div className="text-center animate-countdown">
            <div>{timeLeft.minutes.toString().padStart(2, '0')}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="text-center animate-countdown">
            <div>{timeLeft.seconds.toString().padStart(2, '0')}</div>
            <div className="text-xs text-muted-foreground">Seconds</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
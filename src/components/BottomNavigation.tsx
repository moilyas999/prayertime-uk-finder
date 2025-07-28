import { Clock, Calendar, MapPin, Megaphone, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigationItems = [
  { icon: Clock, label: 'Home', path: '/', activeFor: ['/'] },
  { icon: MapPin, label: 'Prayer Times', path: '/prayer-times' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (item: typeof navigationItems[0]) => {
    if (item.activeFor) {
      return item.activeFor.some(path => location.pathname === path);
    }
    return location.pathname === item.path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-3 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5",
                  active && "text-primary"
                )} 
                strokeWidth={1.5}
              />
              <span className={cn(
                "text-[10px] font-medium",
                active && "text-primary"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Star, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface IslamicDate {
  hijri: string;
  gregorian: string;
  holidays: string[];
}

interface IslamicEvent {
  name: string;
  date: Date;
  type: 'major' | 'minor';
  description: string;
}

export default function IslamicCalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState<string>('');
  const [islamicEvents, setIslamicEvents] = useState<IslamicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Islamic events for 2025 (approximate dates)
  const events2025: IslamicEvent[] = [
    {
      name: 'Ramadan Begins',
      date: new Date(2025, 1, 28), // Feb 28
      type: 'major',
      description: 'The holy month of fasting begins'
    },
    {
      name: 'Laylat al-Qadr',
      date: new Date(2025, 2, 25), // Mar 25 (estimated)
      type: 'major',
      description: 'The Night of Power'
    },
    {
      name: 'Eid al-Fitr',
      date: new Date(2025, 2, 30), // Mar 30
      type: 'major',
      description: 'Festival of Breaking the Fast'
    },
    {
      name: 'Hajj Begins',
      date: new Date(2025, 5, 4), // Jun 4
      type: 'major',
      description: 'Pilgrimage to Mecca begins'
    },
    {
      name: 'Day of Arafah',
      date: new Date(2025, 5, 6), // Jun 6
      type: 'major',
      description: 'The most important day of Hajj'
    },
    {
      name: 'Eid al-Adha',
      date: new Date(2025, 5, 7), // Jun 7
      type: 'major',
      description: 'Festival of Sacrifice'
    },
    {
      name: 'Islamic New Year',
      date: new Date(2025, 5, 26), // Jun 26
      type: 'major',
      description: '1447 AH begins'
    },
    {
      name: 'Day of Ashura',
      date: new Date(2025, 6, 5), // Jul 5
      type: 'major',
      description: '10th day of Muharram'
    },
    {
      name: 'Mawlid an-Nabi',
      date: new Date(2025, 8, 4), // Sep 4
      type: 'minor',
      description: 'Birthday of Prophet Muhammad (PBUH)'
    }
  ];

  useEffect(() => {
    fetchHijriDate();
    setIslamicEvents(events2025);
    setLoading(false);
  }, [currentDate]);

  const fetchHijriDate = async () => {
    try {
      const dateStr = format(currentDate, 'dd-MM-yyyy');
      const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${dateStr}`);
      const data = await response.json();
      
      if (data.code === 200) {
        const hijri = data.data.hijri;
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
      }
    } catch (error) {
      console.error('Error fetching Hijri date:', error);
      setHijriDate('Unable to fetch Hijri date');
    }
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getEventsForDate = (date: Date) => {
    return islamicEvents.filter(event => isSameDay(event.date, date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const upcomingEvents = islamicEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Islamic calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Islamic Calendar</h1>
            <p className="text-muted-foreground">Important Islamic dates and events</p>
          </div>
        </div>

        {/* Current Date */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Date
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-2xl font-bold">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-lg text-muted-foreground">{hijriDate}</p>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Next important Islamic dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant={event.type === 'major' ? 'default' : 'secondary'}>
                    {format(event.date, 'MMM d')}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(event.date, 'yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: monthDays[0].getDay() }).map((_, index) => (
                <div key={index} className="h-12"></div>
              ))}
              {monthDays.map((day, index) => {
                const events = getEventsForDate(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={index}
                    className={`h-12 p-1 rounded border transition-colors ${
                      isToday 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : events.length > 0 
                          ? 'bg-secondary border-secondary' 
                          : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{format(day, 'd')}</div>
                    {events.length > 0 && (
                      <div className="flex">
                        {events.slice(0, 1).map((event, eventIndex) => (
                          <Moon key={eventIndex} className="h-2 w-2 text-primary" />
                        ))}
                        {events.length > 1 && <span className="text-xs">+</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* All Events */}
        <Card>
          <CardHeader>
            <CardTitle>All Islamic Events 2025</CardTitle>
            <CardDescription>Complete list of important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {islamicEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={event.type === 'major' ? 'default' : 'secondary'}>
                      {format(event.date, 'MMM d, yyyy')}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {event.type} event
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
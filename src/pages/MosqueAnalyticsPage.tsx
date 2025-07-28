import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, Eye, TrendingUp, Globe, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay } from 'date-fns';

interface AnalyticsData {
  totalViews: number;
  dailyViews: { date: string; views: number }[];
  regionViews: { region: string; views: number }[];
  widgetViews: { widget_id: string; views: number }[];
}

export default function MosqueAnalyticsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [mosqueInfo, setMosqueInfo] = useState<any>(null);
  const [dateRange, setDateRange] = useState(30); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Get mosque info for current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        navigate('/auth');
        return;
      }

      const { data: mosque, error: mosqueError } = await supabase
        .from('mosques')
        .select('*')
        .eq('admin_email', user.email)
        .single();

      if (mosqueError || !mosque) {
        console.error('Error fetching mosque:', mosqueError);
        return;
      }

      setMosqueInfo(mosque);

      // Get analytics data
      const startDate = format(subDays(startOfDay(new Date()), dateRange), 'yyyy-MM-dd');
      
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('widget_analytics')
        .select('*')
        .eq('mosque_id', mosque.id)
        .gte('date', startDate)
        .order('date', { ascending: true });

      if (analyticsError) {
        console.error('Error fetching analytics:', analyticsError);
        return;
      }

      // Process analytics data
      const totalViews = analyticsData?.reduce((sum, item) => sum + item.views, 0) || 0;
      
      // Group by date
      const dailyViewsMap = new Map();
      analyticsData?.forEach(item => {
        const existing = dailyViewsMap.get(item.date) || 0;
        dailyViewsMap.set(item.date, existing + item.views);
      });
      
      const dailyViews = Array.from(dailyViewsMap.entries())
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Group by region
      const regionViewsMap = new Map();
      analyticsData?.forEach(item => {
        if (item.region) {
          const existing = regionViewsMap.get(item.region) || 0;
          regionViewsMap.set(item.region, existing + item.views);
        }
      });
      
      const regionViews = Array.from(regionViewsMap.entries())
        .map(([region, views]) => ({ region, views }))
        .sort((a, b) => b.views - a.views);

      // Group by widget
      const widgetViewsMap = new Map();
      analyticsData?.forEach(item => {
        if (item.widget_id) {
          const existing = widgetViewsMap.get(item.widget_id) || 0;
          widgetViewsMap.set(item.widget_id, existing + item.views);
        }
      });
      
      const widgetViews = Array.from(widgetViewsMap.entries())
        .map(([widget_id, views]) => ({ widget_id, views }))
        .sort((a, b) => b.views - a.views);

      setAnalytics({
        totalViews,
        dailyViews,
        regionViews,
        widgetViews
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mosqueInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No mosque found for your account.</p>
            <Button onClick={() => navigate('/mosque-admin')} className="mt-4">
              Set Up Mosque Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-foreground">Widget Analytics</h1>
            <p className="text-muted-foreground">{mosqueInfo.name} - Engagement Dashboard</p>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-2">
          {[7, 30, 90].map(days => (
            <Button
              key={days}
              variant={dateRange === days ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(days)}
            >
              {days} days
            </Button>
          ))}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalViews || 0}</div>
              <p className="text-xs text-muted-foreground">
                Last {dateRange} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((analytics?.totalViews || 0) / dateRange)}
              </div>
              <p className="text-xs text-muted-foreground">
                Views per day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Widgets</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.widgetViews.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Embedded widgets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regions</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.regionViews.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Geographic areas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Views Trend
            </CardTitle>
            <CardDescription>Widget view activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.dailyViews.length ? (
              <div className="space-y-4">
                {analytics.dailyViews.slice(-14).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{format(new Date(day.date), 'MMM d')}</span>
                    <div className="flex items-center gap-2 flex-1 mx-4">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ 
                          width: `${Math.max(5, (day.views / Math.max(...analytics.dailyViews.map(d => d.views))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{day.views}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No views recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Region Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Views by region</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.regionViews.length ? (
                <div className="space-y-3">
                  {analytics.regionViews.slice(0, 10).map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{region.region || 'Unknown'}</span>
                      <Badge variant="secondary">{region.views} views</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No regional data available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Widget Performance</CardTitle>
              <CardDescription>Individual widget statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.widgetViews.length ? (
                <div className="space-y-3">
                  {analytics.widgetViews.slice(0, 10).map((widget, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-mono">
                        Widget #{widget.widget_id.slice(-8)}
                      </span>
                      <Badge variant="secondary">{widget.views} views</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No widgets tracked yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How Analytics Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Each time someone views your mosque's prayer time widget, it's counted here</p>
            <p>• Views are tracked by date, region, and individual widget instances</p>
            <p>• Data updates in real-time as people use your widgets</p>
            <p>• Use this data to understand your community's engagement</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
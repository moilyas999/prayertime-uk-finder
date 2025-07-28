import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostcodeInput } from "@/components/PostcodeInput";
import { PrayerTimesDisplay } from "@/components/PrayerTimesDisplay";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrayerTimesPage() {
  const navigate = useNavigate();
  const { data, isLoading, error, searchPrayerTimes, reset } = usePrayerTimes();

  const handleSearch = (postcode: string) => {
    searchPrayerTimes(postcode);
  };

  const handleBack = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <header className="text-center py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
            {data && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground"
              >
                New Search
              </Button>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Prayer Times</h1>
          <p className="text-muted-foreground">
            {data ? "Your prayer times" : "Enter your UK postcode"}
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {!data ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-center text-foreground">Find Your Prayer Times</CardTitle>
            </CardHeader>
            <CardContent>
              <PostcodeInput onSearch={handleSearch} isLoading={isLoading} />
            </CardContent>
          </Card>
        ) : (
          <PrayerTimesDisplay
            location={data.location}
            date={data.date}
            prayerTimes={data.prayerTimes}
            nextPrayer={data.nextPrayer}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="bg-card/60 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <div className="space-y-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground text-sm">Finding prayer times...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
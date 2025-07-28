import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, MapPin } from "lucide-react";

export default function PrayerTimesPage() {
  const [postcode, setPostcode] = useState("");

  const handleSearch = () => {
    if (postcode.trim()) {
      // TODO: Implement prayer times search
      console.log("Searching for postcode:", postcode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <header className="text-center py-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Prayer Times</h1>
          <p className="text-muted-foreground">Enter your UK postcode</p>
        </header>

        {/* Postcode Input */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="postcode" className="text-muted-foreground">UK Postcode</Label>
              <Input
                id="postcode"
                type="text"
                placeholder="e.g. SW1A 1AA"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                className="text-center text-lg font-semibold bg-background border-border"
                maxLength={8}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={!postcode.trim()}
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Search className="mr-2 h-5 w-5" />
              Find Prayer Times
            </Button>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="bg-card/60 backdrop-blur-sm border-border">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-sm">
              Prayer times functionality coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PostcodeInputProps {
  onSubmit: (postcode: string) => void;
  loading?: boolean;
}

export function PostcodeInput({ onSubmit, loading = false }: PostcodeInputProps) {
  const [postcode, setPostcode] = useState("");
  const { toast } = useToast();

  const validatePostcode = (code: string): boolean => {
    // UK postcode regex pattern
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(code.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanPostcode = postcode.trim().toUpperCase();
    
    if (!cleanPostcode) {
      toast({
        title: "Postcode Required",
        description: "Please enter your UK postcode",
        variant: "destructive"
      });
      return;
    }

    if (!validatePostcode(cleanPostcode)) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid UK postcode (e.g., SW1A 1AA)",
        variant: "destructive"
      });
      return;
    }

    onSubmit(cleanPostcode);
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Enter Your Postcode</h2>
        <p className="text-muted-foreground text-sm">
          Get accurate prayer times for your location in the UK
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="e.g., SW1A 1AA"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
            className="text-center text-lg font-mono"
            maxLength={8}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Enter any valid UK postcode
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Search className="mr-2 h-4 w-4 animate-spin" />
              Finding Prayer Times...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Show Prayer Times
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
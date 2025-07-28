import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";

interface PostcodeInputProps {
  onSearch?: (postcode: string) => void;
  onSubmit?: (postcode: string) => Promise<void>;
  isLoading?: boolean;
  loading?: boolean;
}

export function PostcodeInput({ onSearch, onSubmit, isLoading = false, loading = false }: PostcodeInputProps) {
  const [postcode, setPostcode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim()) {
      if (onSubmit) {
        await onSubmit(postcode.trim());
      } else if (onSearch) {
        onSearch(postcode.trim());
      }
    }
  };

  const validatePostcode = (value: string) => {
    // UK postcode validation pattern
    const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
    return ukPostcodeRegex.test(value.replace(/\s/g, ""));
  };

  const formatPostcode = (value: string) => {
    // Format postcode with space
    const cleaned = value.replace(/\s/g, "").toUpperCase();
    if (cleaned.length > 3) {
      return cleaned.slice(0, -3) + " " + cleaned.slice(-3);
    }
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostcode(e.target.value);
    setPostcode(formatted);
  };

  const isValid = postcode.trim() && validatePostcode(postcode);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="postcode" className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          UK Postcode
        </Label>
        <Input
          id="postcode"
          type="text"
          placeholder="e.g. SW1A 1AA"
          value={postcode}
          onChange={handleInputChange}
          className="text-center text-lg font-semibold bg-background border-border"
          maxLength={8}
          disabled={isLoading || loading}
        />
      </div>
      <Button 
        type="submit"
        disabled={!isValid || isLoading || loading}
        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
      >
        <Search className="mr-2 h-5 w-5" />
        {isLoading || loading ? "Searching..." : "Find Prayer Times"}
      </Button>
    </form>
  );
}
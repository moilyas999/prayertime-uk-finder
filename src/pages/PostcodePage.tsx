import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostcodeInput } from "@/components/PostcodeInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function PostcodePage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const convertPostcodeToCoords = async (postcode: string) => {
    // Using postcodes.io - free UK postcode API
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
      const data = await response.json();
      
      if (data.status === 200) {
        return {
          lat: data.result.latitude,
          lng: data.result.longitude
        };
      } else {
        throw new Error('Postcode not found');
      }
    } catch (error) {
      console.error('Error converting postcode:', error);
      throw new Error('Unable to find location for this postcode');
    }
  };

  const handlePostcodeSubmit = async (postcode: string) => {
    setLoading(true);
    
    try {
      // Convert postcode to coordinates
      const coords = await convertPostcodeToCoords(postcode);
      
      // Store analytics
      await supabase
        .from('analytics')
        .insert({
          postcode,
          lat: coords.lat,
          lng: coords.lng
        });

      // Navigate to results with data
      navigate(`/results?postcode=${encodeURIComponent(postcode)}&lat=${coords.lat}&lng=${coords.lng}`);
      
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Location Error",
        description: error.message || "Unable to find prayer times for this postcode. Please check and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-day flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <PostcodeInput 
            onSubmit={handlePostcodeSubmit} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
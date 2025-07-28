import { useSearchParams, useNavigate } from "react-router-dom";
import { ReminderSignup } from "@/components/ReminderSignup";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RemindersPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const postcode = searchParams.get('postcode');

  if (!postcode) {
    navigate('/postcode');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-day flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/results?postcode=${encodeURIComponent(postcode)}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Prayer Times
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ReminderSignup 
            postcode={postcode}
            onSuccess={() => {
              setTimeout(() => {
                navigate(`/results?postcode=${encodeURIComponent(postcode)}`);
              }, 2000);
            }}
          />
        </div>
      </div>
    </div>
  );
}
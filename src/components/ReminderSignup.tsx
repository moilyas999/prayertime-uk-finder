import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bell, Check, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReminderSignupProps {
  postcode: string;
  onSuccess?: () => void;
}

export function ReminderSignup({ postcode, onSuccess }: ReminderSignupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('users_reminder_signups')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || null,
          postcode: postcode
        });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Successfully Signed Up!",
        description: "You'll start receiving daily prayer time reminders soon.",
      });

      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error: any) {
      console.error('Error saving reminder signup:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "There was an error signing you up. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="p-6 max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-green-700">All Set!</h2>
        <p className="text-muted-foreground">
          You'll start receiving daily prayer time reminders for <strong>{postcode}</strong> soon.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-4">
          <Bell className="h-6 w-6 text-secondary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Get Daily Reminders</h2>
        <p className="text-muted-foreground text-sm">
          Receive prayer time notifications via email or SMS
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number (Optional)
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="07XXX XXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            For SMS reminders (coming soon)
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={loading}
        >
          {loading ? (
            "Signing You Up..."
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Start Daily Reminders
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          We respect your privacy. You can unsubscribe at any time.
        </p>
      </form>
    </Card>
  );
}
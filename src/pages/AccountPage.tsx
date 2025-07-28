import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, MapPin, Bell, Settings, LogOut, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function AccountPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [account, setAccount] = useState({
    email: "",
    postcode: ""
  });
  const [formData, setFormData] = useState({
    email: "",
    postcode: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadAccount();
  }, [user]);

  const loadAccount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Create account if it doesn't exist
        if (error.code === 'PGRST116') {
          const newAccount = {
            user_id: user.id,
            email: user.email!,
            postcode: ""
          };
          
          await supabase
            .from('user_accounts')
            .insert(newAccount);
            
          setAccount({ email: user.email!, postcode: "" });
          setFormData({ email: user.email!, postcode: "" });
        } else {
          throw error;
        }
      } else {
        setAccount({
          email: data.email,
          postcode: data.postcode || ""
        });
        setFormData({
          email: data.email,
          postcode: data.postcode || ""
        });
      }
    } catch (error: any) {
      console.error('Error loading account:', error);
      toast({
        title: "Error Loading Account",
        description: "Unable to load your account information",
        variant: "destructive"
      });
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_accounts')
        .update({
          email: formData.email.trim(),
          postcode: formData.postcode.trim() || null
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setAccount(formData);
      setIsEditing(false);

      toast({
        title: "Account Updated!",
        description: "Your account information has been saved."
      });

    } catch (error: any) {
      console.error('Error updating account:', error);
      toast({
        title: "Update Failed",
        description: "Unable to update your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out."
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign Out Error",
        description: "Unable to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUnsubscribe = async () => {
    if (!user) return;

    if (!confirm('Are you sure you want to unsubscribe from all SalahClock reminders? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      // Delete from reminder signups
      await supabase
        .from('users_reminder_signups')
        .delete()
        .eq('email', account.email);

      // Delete notification settings
      await supabase
        .from('user_notification_settings')
        .delete()
        .eq('user_id', user.id);

      toast({
        title: "Unsubscribed",
        description: "You've been unsubscribed from all reminders."
      });

      // Optionally sign out the user
      setTimeout(() => {
        handleSignOut();
      }, 2000);

    } catch (error: any) {
      console.error('Error unsubscribing:', error);
      toast({
        title: "Unsubscribe Failed",
        description: "Unable to unsubscribe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-day flex items-center justify-center">
        <div className="text-center">
          <User className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-day">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="px-4 pb-8 max-w-md mx-auto space-y-6">
        {/* Account Info */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground text-sm">
              Manage your SalahClock preferences
            </p>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="postcode" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Default Postcode (Optional)
                </Label>
                <Input
                  id="postcode"
                  type="text"
                  placeholder="e.g., SW1A 1AA"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setFormData(account);
                    setIsEditing(false);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{account.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Default Postcode</p>
                  <p className="font-medium">{account.postcode || "Not set"}</p>
                </div>
              </div>

              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Account
              </Button>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/notifications')}
            variant="secondary"
            className="w-full justify-start"
            size="lg"
          >
            <Bell className="h-4 w-4 mr-3" />
            Notification Settings
          </Button>

          <Button 
            onClick={() => navigate('/postcode')}
            variant="outline"
            className="w-full justify-start"
            size="lg"
          >
            <MapPin className="h-4 w-4 mr-3" />
            Find Prayer Times
          </Button>
        </div>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive/20">
          <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <Button 
              onClick={handleUnsubscribe}
              variant="destructive"
              className="w-full justify-start"
              disabled={loading}
            >
              <Trash className="h-4 w-4 mr-3" />
              Unsubscribe from All Reminders
            </Button>

            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
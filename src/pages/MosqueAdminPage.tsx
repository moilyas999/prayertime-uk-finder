import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building, DollarSign, Eye, Settings, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Mosque {
  id: string;
  name: string;
  postcode: string;
  address?: string;
  phone?: string;
  website_url?: string;
  donation_goal: number;
  approved: boolean;
}

interface Donation {
  id: string;
  donor_name?: string;
  donor_email?: string;
  amount: number;
  currency: string;
  status: string;
  message?: string;
  is_anonymous: boolean;
  created_at: string;
}

export default function MosqueAdminPage() {
  const [mosque, setMosque] = useState<Mosque | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    postcode: "",
    address: "",
    phone: "",
    website_url: "",
    donation_goal: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadMosqueData();
  }, [user]);

  const loadMosqueData = async () => {
    if (!user?.email) return;

    try {
      // Load mosque data
      const { data: mosqueData, error: mosqueError } = await supabase
        .from('mosques')
        .select('*')
        .eq('admin_email', user.email)
        .single();

      if (mosqueError && mosqueError.code !== 'PGRST116') {
        throw mosqueError;
      }

      if (mosqueData) {
        setMosque(mosqueData);
        setFormData({
          name: mosqueData.name,
          postcode: mosqueData.postcode,
          address: mosqueData.address || "",
          phone: mosqueData.phone || "",
          website_url: mosqueData.website_url || "",
          donation_goal: mosqueData.donation_goal || 0
        });

        // Load donations for this mosque
        const { data: donationData, error: donationError } = await supabase
          .from('donations')
          .select('*')
          .eq('mosque_id', mosqueData.id)
          .order('created_at', { ascending: false });

        if (donationError) {
          console.error('Error loading donations:', donationError);
        } else {
          setDonations(donationData || []);
        }
      }
    } catch (error: any) {
      console.error('Error loading mosque data:', error);
      toast({
        title: "Error Loading Data",
        description: "Unable to load mosque information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.email) return;

    if (!formData.name.trim() || !formData.postcode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in mosque name and postcode",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const mosqueData = {
        name: formData.name.trim(),
        postcode: formData.postcode.trim().toUpperCase(),
        address: formData.address.trim() || null,
        phone: formData.phone.trim() || null,
        website_url: formData.website_url.trim() || null,
        donation_goal: formData.donation_goal,
        admin_email: user.email
      };

      if (mosque) {
        // Update existing mosque
        const { error } = await supabase
          .from('mosques')
          .update(mosqueData)
          .eq('id', mosque.id);

        if (error) throw error;
      } else {
        // Create new mosque
        const { data, error } = await supabase
          .from('mosques')
          .insert(mosqueData)
          .select()
          .single();

        if (error) throw error;
        setMosque(data);
      }

      toast({
        title: "Mosque Updated!",
        description: "Your mosque information has been saved."
      });

      await loadMosqueData();
    } catch (error: any) {
      console.error('Error saving mosque:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save mosque information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const totalDonations = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);

  const monthlyDonations = donations
    .filter(d => {
      const donationDate = new Date(d.created_at);
      const now = new Date();
      return d.status === 'completed' &&
             donationDate.getMonth() === now.getMonth() &&
             donationDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, d) => sum + d.amount, 0);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-day flex items-center justify-center">
        <div className="text-center">
          <Building className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading mosque dashboard...</p>
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

      <div className="px-4 pb-8 max-w-4xl mx-auto">
        {/* Title */}
        <Card className="p-6 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Mosque Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your mosque profile and track donations
          </p>
        </Card>

        {/* Stats Cards */}
        {mosque && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 text-center">
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                £{totalDonations.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Total Donations</p>
            </Card>
            
            <Card className="p-4 text-center">
              <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                £{monthlyDonations.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">This Month</p>
            </Card>
            
            <Card className="p-4 text-center">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {donations.filter(d => d.status === 'completed').length}
              </div>
              <p className="text-sm text-muted-foreground">Donors</p>
            </Card>
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Mosque Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Mosque Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter mosque name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input
                      id="postcode"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
                      placeholder="e.g., E1 1AA"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g., 020 7123 4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="donation-goal">Monthly Donation Goal (£)</Label>
                  <Input
                    id="donation-goal"
                    type="number"
                    value={formData.donation_goal}
                    onChange={(e) => setFormData({ ...formData, donation_goal: Number(e.target.value) })}
                    min="0"
                    step="10"
                  />
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? "Saving..." : "Save Mosque Information"}
                </Button>

                {!mosque?.approved && mosque && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-700">
                      <strong>Pending Approval:</strong> Your mosque profile is under review. 
                      You'll be notified once it's approved and visible to donors.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
              
              {donations.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No donations yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share your mosque profile to start receiving donations
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {donations.slice(0, 10).map((donation) => (
                    <div key={donation.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {donation.is_anonymous ? "Anonymous" : donation.donor_name || "Anonymous"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(donation.created_at).toLocaleDateString('en-GB')}
                        </p>
                        {donation.message && (
                          <p className="text-sm text-muted-foreground italic mt-1">
                            "{donation.message}"
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          £{donation.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {donation.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Widgets Tab */}
          <TabsContent value="widgets">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Prayer Time Widgets</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Create embeddable prayer time widgets for your website with your mosque branding.
                </p>
                
                <Button 
                  onClick={() => navigate('/widget')}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Create Widget
                </Button>

                <div className="p-4 bg-secondary/10 border-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">Widget Features:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Display prayer times for your mosque's postcode</li>
                    <li>• Customize colors and branding</li>
                    <li>• Embed on your website or social media</li>
                    <li>• Automatic daily updates</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
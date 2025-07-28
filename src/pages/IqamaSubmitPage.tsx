import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Clock, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function IqamaSubmitPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mosqueName: '',
    submitterEmail: '',
    fajr: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: '',
    recurring: true,
    notes: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, find the mosque by name
      const { data: mosques, error: mosqueError } = await supabase
        .from('mosques')
        .select('id')
        .ilike('name', `%${formData.mosqueName}%`)
        .limit(1);

      if (mosqueError) throw mosqueError;

      if (!mosques || mosques.length === 0) {
        toast({
          title: "Mosque Not Found",
          description: "Please check the mosque name and try again. The mosque must be registered in our system.",
          variant: "destructive"
        });
        return;
      }

      // Submit Iqama times
      const { error: submitError } = await supabase
        .from('iqama_times')
        .insert({
          mosque_id: mosques[0].id,
          fajr: formData.fajr || null,
          dhuhr: formData.dhuhr || null,
          asr: formData.asr || null,
          maghrib: formData.maghrib || null,
          isha: formData.isha || null,
          recurring: formData.recurring,
          submitted_by_email: formData.submitterEmail,
          notes: formData.notes || null
        });

      if (submitError) throw submitError;

      toast({
        title: "Iqama Times Submitted",
        description: "Thank you! Your submission will be reviewed and approved soon."
      });

      // Reset form
      setFormData({
        mosqueName: '',
        submitterEmail: '',
        fajr: '',
        dhuhr: '',
        asr: '',
        maghrib: '',
        isha: '',
        recurring: true,
        notes: ''
      });

    } catch (error) {
      console.error('Error submitting Iqama times:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your Iqama times. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-foreground">Submit Iqama Times</h1>
            <p className="text-muted-foreground">Add congregation times for your mosque</p>
          </div>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              What are Iqama Times?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Iqama times are when the congregation actually starts at your mosque</p>
            <p>• These are usually 10-30 minutes after the prayer time (Adhan)</p>
            <p>• Your submission will be reviewed before being published</p>
            <p>• Only mosque staff or authorized representatives should submit times</p>
          </CardContent>
        </Card>

        {/* Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Iqama Time Details
            </CardTitle>
            <CardDescription>
              Fill in the congregation times for your mosque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mosque Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mosqueName">Mosque Name *</Label>
                    <Input
                      id="mosqueName"
                      value={formData.mosqueName}
                      onChange={(e) => handleInputChange('mosqueName', e.target.value)}
                      placeholder="Enter exact mosque name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="submitterEmail">Your Email *</Label>
                    <Input
                      id="submitterEmail"
                      type="email"
                      value={formData.submitterEmail}
                      onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                      placeholder="your.email@mosque.org"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Prayer Times */}
              <div className="space-y-4">
                <h3 className="font-semibold">Iqama Times (24-hour format)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'fajr', label: 'Fajr', placeholder: '06:00' },
                    { key: 'dhuhr', label: 'Dhuhr', placeholder: '13:15' },
                    { key: 'asr', label: 'Asr', placeholder: '16:30' },
                    { key: 'maghrib', label: 'Maghrib', placeholder: '18:45' },
                    { key: 'isha', label: 'Isha', placeholder: '20:00' }
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key}>{label}</Label>
                      <Input
                        id={key}
                        type="time"
                        value={formData[key as keyof typeof formData] as string}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="recurring">Recurring Weekly Schedule</Label>
                    <p className="text-sm text-muted-foreground">
                      These times repeat every week
                    </p>
                  </div>
                  <Switch
                    id="recurring"
                    checked={formData.recurring}
                    onCheckedChange={(checked) => handleInputChange('recurring', checked)}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special notes about timing changes, seasonal adjustments, etc."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !formData.mosqueName || !formData.submitterEmail}
              >
                {loading ? 'Submitting...' : 'Submit Iqama Times'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Ensure you are authorized to submit times for this mosque</p>
            <p>• Use 24-hour format (e.g., 13:15 for 1:15 PM)</p>
            <p>• Leave prayer times blank if they are not held at your mosque</p>
            <p>• Times will be reviewed within 24-48 hours</p>
            <p>• Updates can be submitted anytime using this same form</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
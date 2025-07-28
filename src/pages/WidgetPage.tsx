import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Code, Copy, Eye, Palette, Maximize } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function WidgetPage() {
  const [loading, setLoading] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState({
    postcode: "",
    theme: "light",
    size: "full"
  });
  const [embedCode, setEmbedCode] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePostcode = (code: string): boolean => {
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(code.trim());
  };

  const generateWidget = async () => {
    if (!widgetConfig.postcode.trim()) {
      toast({
        title: "Postcode Required",
        description: "Please enter a UK postcode for the widget",
        variant: "destructive"
      });
      return;
    }

    if (!validatePostcode(widgetConfig.postcode)) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid UK postcode",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Save widget instance
      const { data, error } = await supabase
        .from('widget_instances')
        .insert({
          postcode: widgetConfig.postcode.trim().toUpperCase(),
          theme: widgetConfig.theme,
          size: widgetConfig.size,
          created_by: null // Anonymous creation for now
        })
        .select()
        .single();

      if (error) throw error;

      // Generate embed code
      const baseUrl = window.location.origin;
      const widgetUrl = `${baseUrl}/embed/${data.id}`;
      
      let width, height;
      switch (widgetConfig.size) {
        case 'mini':
          width = '300';
          height = '200';
          break;
        case 'sidebar':
          width = '300';
          height = '400';
          break;
        case 'full':
        default:
          width = '100%';
          height = '500';
          break;
      }

      const code = `<iframe src="${widgetUrl}" width="${width}" height="${height}" frameborder="0" style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></iframe>`;
      
      setEmbedCode(code);
      setPreviewUrl(widgetUrl);

      toast({
        title: "Widget Generated!",
        description: "Your prayer times widget is ready to embed."
      });

    } catch (error: any) {
      console.error('Error generating widget:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate widget. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please select and copy manually.",
        variant: "destructive"
      });
    }
  };

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

      <div className="px-4 pb-8 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <Code className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Widget Generator</h1>
          <p className="text-muted-foreground">
            Create embeddable prayer time widgets for your website, mosque, or school
          </p>
        </Card>

        {/* Configuration */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Widget Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="widget-postcode">UK Postcode</Label>
              <Input
                id="widget-postcode"
                type="text"
                placeholder="e.g., E14 7AF"
                value={widgetConfig.postcode}
                onChange={(e) => setWidgetConfig({ ...widgetConfig, postcode: e.target.value.toUpperCase() })}
                maxLength={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Prayer times will be calculated for this location
              </p>
            </div>

            <div>
              <Label htmlFor="widget-theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </Label>
              <Select 
                value={widgetConfig.theme} 
                onValueChange={(value) => setWidgetConfig({ ...widgetConfig, theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Theme</SelectItem>
                  <SelectItem value="dark">Dark Theme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="widget-size" className="flex items-center gap-2">
                <Maximize className="h-4 w-4" />
                Size
              </Label>
              <Select 
                value={widgetConfig.size} 
                onValueChange={(value) => setWidgetConfig({ ...widgetConfig, size: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mini">Mini (300x200)</SelectItem>
                  <SelectItem value="sidebar">Sidebar (300x400)</SelectItem>
                  <SelectItem value="full">Full Width (100%x500)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateWidget}
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Widget"}
            </Button>
          </div>
        </Card>

        {/* Embed Code */}
        {embedCode && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Embed Code</h2>
              <div className="flex gap-2">
                {previewUrl && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                )}
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>

            <Textarea
              value={embedCode}
              readOnly
              rows={4}
              className="font-mono text-sm"
            />

            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">Usage Instructions:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Copy the embed code above</li>
                <li>• Paste it into your website's HTML where you want the widget to appear</li>
                <li>• The widget will automatically display current prayer times for {widgetConfig.postcode}</li>
                <li>• Prayer times update automatically each day</li>
              </ul>
            </div>
          </Card>
        )}

        {/* Benefits */}
        <Card className="p-6 bg-secondary/10 border-secondary">
          <h2 className="text-xl font-semibold mb-4">Perfect For:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">🕌 Mosques</h3>
              <p className="text-sm text-muted-foreground">
                Display accurate prayer times on your mosque website
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">🏫 Islamic Schools</h3>
              <p className="text-sm text-muted-foreground">
                Help students and staff know prayer times
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">🌐 Community Websites</h3>
              <p className="text-sm text-muted-foreground">
                Serve your local Muslim community
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">📱 Apps & Portals</h3>
              <p className="text-sm text-muted-foreground">
                Integrate prayer times into existing platforms
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
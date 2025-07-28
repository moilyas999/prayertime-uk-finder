-- Create ad_settings table for remote ad control
CREATE TABLE public.ad_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_type TEXT NOT NULL, -- 'banner', 'interstitial', 'rewarded'
  location TEXT NOT NULL, -- 'home_screen', 'forecast_pdf', 'islamic_calendar', 'jumuah'
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ad_type, location)
);

-- Insert default ad settings
INSERT INTO public.ad_settings (ad_type, location, is_enabled) VALUES
('banner', 'home_screen', true),
('banner', 'islamic_calendar', true),
('banner', 'jumuah', true),
('interstitial', 'forecast_pdf', true);

-- Enable RLS
ALTER TABLE public.ad_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view ad settings
CREATE POLICY "Anyone can view ad settings" 
ON public.ad_settings 
FOR SELECT 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_ad_settings_updated_at
  BEFORE UPDATE ON public.ad_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
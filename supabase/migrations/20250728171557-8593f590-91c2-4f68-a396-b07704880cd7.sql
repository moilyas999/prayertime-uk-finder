-- Create widget_analytics table for tracking mosque widget usage
CREATE TABLE public.widget_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mosque_id UUID REFERENCES public.mosques(id) ON DELETE CASCADE,
  widget_id UUID REFERENCES public.widget_instances(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  views INTEGER NOT NULL DEFAULT 1,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mosque_id, widget_id, date)
);

-- Create iqama_times table for mosque congregation times
CREATE TABLE public.iqama_times (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
  fajr TIME,
  dhuhr TIME,
  asr TIME,
  maghrib TIME,
  isha TIME,
  recurring BOOLEAN NOT NULL DEFAULT true,
  approved BOOLEAN NOT NULL DEFAULT false,
  submitted_by_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.widget_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iqama_times ENABLE ROW LEVEL SECURITY;

-- RLS policies for widget_analytics
CREATE POLICY "Anyone can insert widget analytics" 
ON public.widget_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Mosque admins can view their analytics" 
ON public.widget_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.mosques 
  WHERE mosques.id = widget_analytics.mosque_id 
  AND mosques.admin_email = auth.email()
));

-- RLS policies for iqama_times
CREATE POLICY "Anyone can view approved iqama times" 
ON public.iqama_times 
FOR SELECT 
USING (approved = true);

CREATE POLICY "Anyone can submit iqama times" 
ON public.iqama_times 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Mosque admins can manage their iqama times" 
ON public.iqama_times 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.mosques 
  WHERE mosques.id = iqama_times.mosque_id 
  AND mosques.admin_email = auth.email()
));

-- Create storage bucket for azan audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('azan-audio', 'azan-audio', true);

-- Storage policies for azan audio files
CREATE POLICY "Anyone can view azan audio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'azan-audio');

CREATE POLICY "Admins can upload azan audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'azan-audio');

-- Add triggers for updated_at columns
CREATE TRIGGER update_widget_analytics_updated_at
  BEFORE UPDATE ON public.widget_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_iqama_times_updated_at
  BEFORE UPDATE ON public.iqama_times
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_widget_analytics_mosque_date ON public.widget_analytics(mosque_id, date);
CREATE INDEX idx_widget_analytics_widget_date ON public.widget_analytics(widget_id, date);
CREATE INDEX idx_iqama_times_mosque_approved ON public.iqama_times(mosque_id, approved);
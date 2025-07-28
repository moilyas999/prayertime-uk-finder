-- Create users_reminder_signups table
CREATE TABLE public.users_reminder_signups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    postcode TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics table for tracking postcode searches
CREATE TABLE public.analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    postcode TEXT NOT NULL,
    search_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    lat FLOAT,
    lng FLOAT
);

-- Enable Row Level Security
ALTER TABLE public.users_reminder_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for Phase 1)
CREATE POLICY "Anyone can insert reminder signups" 
ON public.users_reminder_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert analytics" 
ON public.analytics 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_reminder_signups_email ON public.users_reminder_signups(email);
CREATE INDEX idx_reminder_signups_postcode ON public.users_reminder_signups(postcode);
CREATE INDEX idx_analytics_postcode ON public.analytics(postcode);
CREATE INDEX idx_analytics_search_time ON public.analytics(search_time);
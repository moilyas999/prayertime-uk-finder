-- Create mosques table for admin management
CREATE TABLE public.mosques (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    postcode TEXT NOT NULL,
    address TEXT,
    logo_url TEXT,
    admin_email TEXT NOT NULL,
    phone TEXT,
    website_url TEXT,
    donation_goal NUMERIC DEFAULT 0,
    widget_theme JSONB DEFAULT '{"primary_color": "#186b7a", "background": "light", "show_logo": true}'::jsonb,
    approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table (ready for future Stripe integration)
CREATE TABLE public.donations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    donor_name TEXT,
    donor_email TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GBP',
    payment_method TEXT, -- 'stripe', 'crypto', etc.
    transaction_reference TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    message TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences for location settings
CREATE TABLE public.user_preferences (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    use_current_location BOOLEAN NOT NULL DEFAULT false,
    default_postcode TEXT,
    prayer_method INTEGER NOT NULL DEFAULT 2,
    auto_location_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Mosque policies
CREATE POLICY "Anyone can view approved mosques" 
ON public.mosques 
FOR SELECT 
USING (approved = true);

CREATE POLICY "Mosque admins can manage their mosque" 
ON public.mosques 
FOR ALL 
USING (auth.email() = admin_email);

-- Donation policies
CREATE POLICY "Anyone can insert donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Mosque admins can view their donations" 
ON public.donations 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.mosques 
        WHERE mosques.id = donations.mosque_id 
        AND mosques.admin_email = auth.email()
    )
);

CREATE POLICY "Users can view their own donations" 
ON public.donations 
FOR SELECT 
USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_mosques_updated_at
BEFORE UPDATE ON public.mosques
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_mosques_postcode ON public.mosques(postcode);
CREATE INDEX idx_mosques_admin_email ON public.mosques(admin_email);
CREATE INDEX idx_donations_mosque_id ON public.donations(mosque_id);
CREATE INDEX idx_donations_user_id ON public.donations(user_id);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
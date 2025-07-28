-- Create user accounts system
CREATE TABLE public.user_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    email TEXT NOT NULL,
    postcode TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification settings table
CREATE TABLE public.user_notification_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    enable_email BOOLEAN NOT NULL DEFAULT true,
    enable_sms BOOLEAN NOT NULL DEFAULT false,
    enable_push BOOLEAN NOT NULL DEFAULT false,
    device_token TEXT,
    notification_time TEXT DEFAULT '06:00',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create widget instances table
CREATE TABLE public.widget_instances (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    postcode TEXT NOT NULL,
    theme TEXT NOT NULL DEFAULT 'light',
    size TEXT NOT NULL DEFAULT 'full',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_instances ENABLE ROW LEVEL SECURITY;

-- User accounts policies
CREATE POLICY "Users can view own account" 
ON public.user_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own account" 
ON public.user_accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own account" 
ON public.user_accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Notification settings policies
CREATE POLICY "Users can manage own notification settings" 
ON public.user_notification_settings 
FOR ALL 
USING (auth.uid() = user_id);

-- Widget policies (public read, authenticated create)
CREATE POLICY "Anyone can view widgets" 
ON public.widget_instances 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create widgets" 
ON public.widget_instances 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Create trigger for updated_at
CREATE TRIGGER update_user_accounts_updated_at
BEFORE UPDATE ON public.user_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
BEFORE UPDATE ON public.user_notification_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
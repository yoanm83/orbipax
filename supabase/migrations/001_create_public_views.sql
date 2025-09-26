-- Create views in the public schema that reference orbipax_core tables
-- This allows the Supabase API to access the tables properly

-- Drop existing views if they exist
DROP VIEW IF EXISTS public.organizations;
DROP VIEW IF EXISTS public.user_profiles;

-- Create view for organizations
CREATE OR REPLACE VIEW public.organizations AS
SELECT * FROM orbipax_core.organizations;

-- Create view for user_profiles
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT * FROM orbipax_core.user_profiles;

-- Grant permissions for the views
GRANT SELECT ON public.organizations TO anon, authenticated, service_role;
GRANT SELECT ON public.user_profiles TO anon, authenticated, service_role;

-- Enable RLS on the views (optional, depending on your security requirements)
-- ALTER VIEW public.organizations ENABLE ROW LEVEL SECURITY;
-- ALTER VIEW public.user_profiles ENABLE ROW LEVEL SECURITY;
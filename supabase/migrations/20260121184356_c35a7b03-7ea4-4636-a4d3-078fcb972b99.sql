-- Add new roles to the enum for granular admin permissions
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'superadmin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'consultation_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'visa_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'accommodation_admin';
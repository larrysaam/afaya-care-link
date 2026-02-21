-- ============================================================================
-- AFAYA CARELINK - COMPLETE DATABASE SETUP
-- ============================================================================
-- Run this script in Supabase SQL Editor to create all tables and policies
-- URL: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/sql/new
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE ENUMS
-- ============================================================================

-- Consultation status enum
CREATE TYPE public.consultation_status AS ENUM (
  'pending', 
  'under_review', 
  'approved', 
  'scheduled', 
  'completed', 
  'cancelled'
);

-- User roles enum
CREATE TYPE public.app_role AS ENUM (
  'patient', 
  'admin', 
  'hospital_admin',
  'superadmin',
  'consultation_admin',
  'visa_admin',
  'accommodation_admin'
);

-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  date_of_birth DATE,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Consultations table
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_id TEXT NOT NULL,
  specialist_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  condition_description TEXT NOT NULL,
  medical_history TEXT,
  current_medications TEXT,
  urgency_level TEXT DEFAULT 'normal',
  preferred_date DATE,
  status consultation_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Medical documents table
CREATE TABLE public.medical_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Analytics events table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hospitals table
CREATE TABLE public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  accreditations TEXT[] DEFAULT '{}',
  description TEXT,
  established INTEGER,
  beds INTEGER,
  doctors_count INTEGER DEFAULT 0,
  image_url TEXT,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  features TEXT[] DEFAULT '{}',
  international_patients INTEGER DEFAULT 0,
  success_rate DECIMAL(4,1) DEFAULT 0,
  avg_cost_savings INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Specialists table
CREATE TABLE public.specialists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  qualification TEXT,
  experience_years INTEGER,
  bio TEXT,
  image_url TEXT,
  success_rate DECIMAL(4,1),
  patients_treated INTEGER DEFAULT 0,
  languages TEXT[] DEFAULT '{}',
  available_days TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: CREATE HELPER FUNCTIONS
-- ============================================================================

-- Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if user is any type of admin
CREATE OR REPLACE FUNCTION public.is_admin_or_above(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin'::app_role, 'superadmin'::app_role, 'consultation_admin'::app_role, 'visa_admin'::app_role, 'accommodation_admin'::app_role)
  )
$$;

-- Check if user is superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'superadmin'::app_role
  )
$$;

-- Update timestamps function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================================
-- STEP 5: CREATE ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Superadmins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (is_superadmin(auth.uid()));

CREATE POLICY "Superadmins can delete roles"
ON public.user_roles FOR DELETE
USING (is_superadmin(auth.uid()));

CREATE POLICY "Superadmins can update roles"
ON public.user_roles FOR UPDATE
USING (is_superadmin(auth.uid()));

-- Consultations policies
CREATE POLICY "Patients can view their own consultations"
ON public.consultations FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create consultations"
ON public.consultations FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Admins can view all consultations"
ON public.consultations FOR SELECT
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can update consultations"
ON public.consultations FOR UPDATE
USING (is_admin_or_above(auth.uid()));

-- Medical documents policies
CREATE POLICY "Users can view documents for their consultations"
ON public.medical_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.consultations
    WHERE consultations.id = medical_documents.consultation_id
    AND consultations.patient_id = auth.uid()
  )
);

CREATE POLICY "Users can upload documents for their consultations"
ON public.medical_documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.consultations
    WHERE consultations.id = medical_documents.consultation_id
    AND consultations.patient_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all documents"
ON public.medical_documents FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Analytics policies
CREATE POLICY "Admins can view analytics"
ON public.analytics_events FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'superadmin'::app_role)
);

CREATE POLICY "Users can create analytics events"
ON public.analytics_events FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Hospitals policies
CREATE POLICY "Anyone can view active hospitals"
ON public.hospitals FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all hospitals"
ON public.hospitals FOR SELECT
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can create hospitals"
ON public.hospitals FOR INSERT
WITH CHECK (is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can update hospitals"
ON public.hospitals FOR UPDATE
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can delete hospitals"
ON public.hospitals FOR DELETE
USING (is_admin_or_above(auth.uid()));

-- Specialists policies
CREATE POLICY "Anyone can view active specialists"
ON public.specialists FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all specialists"
ON public.specialists FOR SELECT
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can create specialists"
ON public.specialists FOR INSERT
WITH CHECK (is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can update specialists"
ON public.specialists FOR UPDATE
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can delete specialists"
ON public.specialists FOR DELETE
USING (is_admin_or_above(auth.uid()));

-- ============================================================================
-- STEP 6: CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at
BEFORE UPDATE ON public.hospitals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_specialists_updated_at
BEFORE UPDATE ON public.specialists
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 7: CREATE STORAGE BUCKETS
-- ============================================================================

-- Medical documents bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-documents', 'medical-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Hospital images bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hospital-images', 'hospital-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 8: STORAGE POLICIES
-- ============================================================================

-- Medical documents storage policies
CREATE POLICY "Authenticated users can upload medical documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'medical-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'medical-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can view all medical documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'medical-documents' AND public.has_role(auth.uid(), 'admin'));

-- Hospital images storage policies
CREATE POLICY "Admins can upload hospital images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hospital-images' 
  AND is_admin_or_above(auth.uid())
);

CREATE POLICY "Admins can update hospital images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hospital-images' 
  AND is_admin_or_above(auth.uid())
);

CREATE POLICY "Admins can delete hospital images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hospital-images' 
  AND is_admin_or_above(auth.uid())
);

CREATE POLICY "Anyone can view hospital images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hospital-images');

-- ============================================================================
-- STEP 9: ENABLE REALTIME
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Go to Storage section and verify both buckets exist
-- 2. Make sure hospital-images bucket is PUBLIC
-- 3. Create your first user account through the app
-- 4. Run create-admin.sql to make yourself an admin
-- ============================================================================

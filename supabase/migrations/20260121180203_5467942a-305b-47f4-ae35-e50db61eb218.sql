-- Create enum for consultation status
CREATE TYPE public.consultation_status AS ENUM ('pending', 'under_review', 'approved', 'scheduled', 'completed', 'cancelled');

-- Create profiles table for user data
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

-- Create user roles table (separate from profiles for security)
CREATE TYPE public.app_role AS ENUM ('patient', 'admin', 'hospital_admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create consultations table
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

-- Create medical documents table
CREATE TABLE public.medical_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
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

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Consultations policies
CREATE POLICY "Patients can view their own consultations"
ON public.consultations FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create consultations"
ON public.consultations FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Admins can view all consultations"
ON public.consultations FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update consultations"
ON public.consultations FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

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

-- Create storage bucket for medical documents
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-documents', 'medical-documents', false);

-- Storage policies for medical documents bucket
CREATE POLICY "Authenticated users can upload medical documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'medical-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'medical-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can view all medical documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'medical-documents' AND public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for consultations
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;
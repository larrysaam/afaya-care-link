-- Create hospitals table
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

-- Create specialists/doctors table (no email or phone as per requirement)
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

-- Enable RLS
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hospitals (public read, admin write)
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

-- RLS Policies for specialists (public read, admin write)
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

-- Triggers for updated_at
CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_specialists_updated_at
  BEFORE UPDATE ON public.specialists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
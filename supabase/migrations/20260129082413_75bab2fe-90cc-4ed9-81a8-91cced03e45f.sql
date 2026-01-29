-- Drop existing restrictive policies for consultations
DROP POLICY IF EXISTS "Admins can update consultations" ON public.consultations;
DROP POLICY IF EXISTS "Admins can view all consultations" ON public.consultations;

-- Create new policies using is_admin_or_above which includes superadmin and all admin roles
CREATE POLICY "Admins can update consultations" 
ON public.consultations 
FOR UPDATE 
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can view all consultations" 
ON public.consultations 
FOR SELECT 
USING (is_admin_or_above(auth.uid()));
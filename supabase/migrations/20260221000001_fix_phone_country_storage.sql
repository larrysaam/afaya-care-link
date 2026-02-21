-- UPDATE: Fix phone and country storage
-- Run this to update the trigger function to include phone and country

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;

-- Recreate the function with phone and country support
CREATE OR REPLACE FUNCTION public.handle_new_user_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only proceed if email is being confirmed (was null, now has value)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    
    -- Create profile if it doesn't exist, including phone and country from metadata
    INSERT INTO public.profiles (user_id, full_name, email, phone, country)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.email,
      NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'country'), '')
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Assign patient role if no role exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'patient'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_confirmation();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, service_role;
GRANT ALL ON auth.users TO postgres, service_role;

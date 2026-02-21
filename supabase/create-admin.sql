-- AfayaConekt: Create Admin User
-- Project ID: yfzpcyppnobbqbpsedtm
-- Run this in Supabase SQL Editor AFTER creating a user via Auth

-- ============================================
-- METHOD 1: Promote existing user to admin by email
-- ============================================

-- Replace 'your-email@example.com' with your actual email
UPDATE profiles 
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, full_name, role, created_at
FROM profiles
WHERE role = 'admin';

-- ============================================
-- METHOD 2: Promote user to admin by user ID
-- ============================================

-- Replace 'USER_ID_HERE' with the actual user ID from auth.users
/*
UPDATE profiles 
SET role = 'admin'
WHERE id = 'USER_ID_HERE';
*/

-- ============================================
-- METHOD 3: Check all users and their roles
-- ============================================

SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.country,
  p.created_at,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC;

-- ============================================
-- VERIFICATION
-- ============================================

-- Count admin users
SELECT 
  role, 
  COUNT(*) as count
FROM profiles
GROUP BY role;

-- Success message
DO $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM profiles WHERE role = 'admin';
  
  IF admin_count > 0 THEN
    RAISE NOTICE 'Success! You have % admin user(s)', admin_count;
  ELSE
    RAISE WARNING 'No admin users found. Please update a user to admin role.';
  END IF;
END $$;

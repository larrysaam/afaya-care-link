-- AfayaConekt: Storage Setup for New Supabase Project
-- Project ID: yfzpcyppnobbqbpsedtm
-- Run this in Supabase SQL Editor after creating the storage bucket

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================

-- Note: First create the bucket 'hospital-images' in Storage UI
-- Make it PUBLIC

-- 1. Allow public access to read/view images
CREATE POLICY "Public can view hospital images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hospital-images');

-- 2. Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hospital-images');

-- 3. Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hospital-images');

-- 4. Allow admins to delete images
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'hospital-images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Storage policies created successfully!';
  RAISE NOTICE 'Make sure you have created the "hospital-images" bucket in Storage UI';
  RAISE NOTICE 'And set it to PUBLIC';
END $$;

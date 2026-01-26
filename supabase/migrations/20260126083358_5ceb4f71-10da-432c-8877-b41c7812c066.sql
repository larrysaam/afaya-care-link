-- Create storage bucket for hospital images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hospital-images', 'hospital-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated admins to upload images
CREATE POLICY "Admins can upload hospital images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'hospital-images' 
  AND is_admin_or_above(auth.uid())
);

-- Allow authenticated admins to update images
CREATE POLICY "Admins can update hospital images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'hospital-images' 
  AND is_admin_or_above(auth.uid())
);

-- Allow authenticated admins to delete images
CREATE POLICY "Admins can delete hospital images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'hospital-images' 
  AND is_admin_or_above(auth.uid())
);

-- Allow public read access to hospital images
CREATE POLICY "Anyone can view hospital images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hospital-images');
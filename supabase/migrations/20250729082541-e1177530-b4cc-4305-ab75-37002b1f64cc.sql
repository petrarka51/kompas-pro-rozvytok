-- Create storage bucket for monthly photos
INSERT INTO storage.buckets (id, name, public) VALUES ('monthly_photos', 'monthly_photos', true);

-- Create policies for monthly photos storage
CREATE POLICY "Users can view their own monthly photos"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'monthly_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own monthly photos"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'monthly_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own monthly photos"
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'monthly_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own monthly photos"
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'monthly_photos' AND auth.uid()::text = (storage.foldername(name))[1]);
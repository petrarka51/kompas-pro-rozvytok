
-- Create storage bucket for monthly photos
INSERT INTO storage.buckets (id, name, public) VALUES ('monthly_photos', 'monthly_photos', true);

-- Create RLS policies for monthly photos bucket
CREATE POLICY "Users can view their own photos" ON storage.objects FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload their own photos" ON storage.objects FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own photos" ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own photos" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Create monthly_photos table
CREATE TABLE IF NOT EXISTS public.monthly_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- Enable RLS for monthly_photos
ALTER TABLE public.monthly_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for monthly_photos
CREATE POLICY "Users can view their own monthly photos" ON public.monthly_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own monthly photos" ON public.monthly_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own monthly photos" ON public.monthly_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own monthly photos" ON public.monthly_photos FOR DELETE USING (auth.uid() = user_id);

-- Create first_times table
CREATE TABLE IF NOT EXISTS public.first_times (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  why_recorded TEXT,
  what_changed TEXT,
  how_use_experience TEXT,
  what_proud_improve TEXT,
  emotions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for first_times
ALTER TABLE public.first_times ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for first_times
CREATE POLICY "Users can view their own first times" ON public.first_times FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own first times" ON public.first_times FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own first times" ON public.first_times FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own first times" ON public.first_times FOR DELETE USING (auth.uid() = user_id);

-- Create wishes table
CREATE TABLE IF NOT EXISTS public.wishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_number INTEGER NOT NULL,
  wish TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, order_number)
);

-- Enable RLS for wishes
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wishes
CREATE POLICY "Users can view their own wishes" ON public.wishes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wishes" ON public.wishes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wishes" ON public.wishes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wishes" ON public.wishes FOR DELETE USING (auth.uid() = user_id);

-- Create essays table
CREATE TABLE IF NOT EXISTS public.essays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id UUID NOT NULL,
  content TEXT NOT NULL,
  character_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for essays
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for essays
CREATE POLICY "Users can view their own essays" ON public.essays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own essays" ON public.essays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own essays" ON public.essays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own essays" ON public.essays FOR DELETE USING (auth.uid() = user_id);

-- Create essay_topics table (public topics that everyone can see)
CREATE TABLE IF NOT EXISTS public.essay_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  deadline DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for essay_topics
ALTER TABLE public.essay_topics ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for essay_topics (anyone can view)
CREATE POLICY "Anyone can view essay topics" ON public.essay_topics FOR SELECT USING (true);

-- Insert some sample essay topics
INSERT INTO public.essay_topics (title, deadline) VALUES
  ('Мій ідеальний день', '2024-12-31'),
  ('Що означає для мене успіх', '2024-12-31'),
  ('Моя найбільша мрія', '2024-12-31'),
  ('Урок, який змінив моє життя', '2024-12-31'),
  ('Через 10 років я бачу себе...', '2024-12-31');

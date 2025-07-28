-- Create fitness_tests table
CREATE TABLE public.fitness_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_number INTEGER NOT NULL CHECK (test_number >= 1 AND test_number <= 4),
  date DATE NOT NULL,
  run_2400m_seconds INTEGER NOT NULL,
  pushups INTEGER NOT NULL,
  abs INTEGER NOT NULL,
  long_jump_cm INTEGER NOT NULL,
  run_40m_seconds DECIMAL(4,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, test_number)
);

-- Create english_tests table
CREATE TABLE public.english_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_number INTEGER NOT NULL CHECK (test_number >= 1 AND test_number <= 3),
  date DATE NOT NULL,
  grammar INTEGER NOT NULL,
  vocabulary INTEGER NOT NULL,
  reading INTEGER NOT NULL,
  listening INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, test_number)
);

-- Create essay_topics table  
CREATE TABLE public.essay_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  deadline DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create essays table
CREATE TABLE public.essays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id UUID NOT NULL REFERENCES public.essay_topics(id),
  content TEXT NOT NULL,
  character_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Create first_times table
CREATE TABLE public.first_times (
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

-- Create wishes table
CREATE TABLE public.wishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wish TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monthly_photos table
CREATE TABLE public.monthly_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- Enable RLS on all tables
ALTER TABLE public.fitness_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.english_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essay_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.first_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for fitness_tests
CREATE POLICY "Users can view their own fitness tests" ON public.fitness_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own fitness tests" ON public.fitness_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own fitness tests" ON public.fitness_tests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own fitness tests" ON public.fitness_tests FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for english_tests
CREATE POLICY "Users can view their own english tests" ON public.english_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own english tests" ON public.english_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own english tests" ON public.english_tests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own english tests" ON public.english_tests FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for essay_topics (public read, admin write)
CREATE POLICY "Anyone can view essay topics" ON public.essay_topics FOR SELECT USING (true);

-- Create RLS policies for essays
CREATE POLICY "Users can view their own essays" ON public.essays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own essays" ON public.essays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own essays" ON public.essays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own essays" ON public.essays FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for first_times
CREATE POLICY "Users can view their own first times" ON public.first_times FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own first times" ON public.first_times FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own first times" ON public.first_times FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own first times" ON public.first_times FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for wishes
CREATE POLICY "Users can view their own wishes" ON public.wishes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wishes" ON public.wishes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wishes" ON public.wishes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wishes" ON public.wishes FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for monthly_photos
CREATE POLICY "Users can view their own monthly photos" ON public.monthly_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own monthly photos" ON public.monthly_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own monthly photos" ON public.monthly_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own monthly photos" ON public.monthly_photos FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_fitness_tests_updated_at BEFORE UPDATE ON public.fitness_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_english_tests_updated_at BEFORE UPDATE ON public.english_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_essay_topics_updated_at BEFORE UPDATE ON public.essay_topics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_essays_updated_at BEFORE UPDATE ON public.essays FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_first_times_updated_at BEFORE UPDATE ON public.first_times FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wishes_updated_at BEFORE UPDATE ON public.wishes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_monthly_photos_updated_at BEFORE UPDATE ON public.monthly_photos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample essay topics
INSERT INTO public.essay_topics (title, deadline) VALUES
('Мій досвід у програмі', '2024-03-15'),
('Лідерство та командна робота', '2024-04-20'),
('Майбутні плани та цілі', '2024-05-25');
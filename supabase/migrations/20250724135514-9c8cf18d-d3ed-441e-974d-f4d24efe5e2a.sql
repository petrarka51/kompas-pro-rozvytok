-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create actions table for user activities
CREATE TABLE public.actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('Фізичний розвиток', 'Інтелектуальний розвиток', 'Емоційний розвиток', 'Соціальний розвиток')),
  time_spent INTEGER NOT NULL CHECK (time_spent >= 1),
  work_done TEXT NOT NULL,
  insights TEXT,
  emotions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own actions" 
ON public.actions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own actions" 
ON public.actions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own actions" 
ON public.actions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own actions" 
ON public.actions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_actions_updated_at
BEFORE UPDATE ON public.actions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create tasks table
CREATE TABLE public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  due text NOT NULL,
  due_type text NOT NULL CHECK (due_type IN ('tomorrow', 'friday', 'week', 'semester')),
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  time text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  event_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Users can view own events"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON public.events FOR DELETE
  USING (auth.uid() = user_id);
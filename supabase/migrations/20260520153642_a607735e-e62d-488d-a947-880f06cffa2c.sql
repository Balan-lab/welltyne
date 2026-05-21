
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  dob DATE,
  sex TEXT,
  exercise TEXT,
  smoker TEXT,
  sleep_hours TEXT,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Panels table
CREATE TABLE public.panels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  bio_age_score NUMERIC,
  glucose NUMERIC,
  hba1c NUMERIC,
  total_cholesterol NUMERIC,
  ldl NUMERIC,
  hdl NUMERIC,
  triglycerides NUMERIC,
  hscrp NUMERIC,
  hemoglobin NUMERIC,
  wbc NUMERIC,
  platelets NUMERIC,
  creatinine NUMERIC,
  egfr NUMERIC,
  alt NUMERIC,
  ast NUMERIC,
  tsh NUMERIC,
  vitamin_d NUMERIC,
  vitamin_b12 NUMERIC,
  ferritin NUMERIC,
  uric_acid NUMERIC,
  albumin NUMERIC,
  biomarker_status JSONB
);

ALTER TABLE public.panels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own panels" ON public.panels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own panels" ON public.panels FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Action plans
CREATE TABLE public.action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id UUID NOT NULL REFERENCES public.panels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own plans" ON public.action_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own plans" ON public.action_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

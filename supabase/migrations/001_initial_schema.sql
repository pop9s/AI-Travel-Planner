-- AI Travel Planner 初始数据库架构
-- 在 Supabase SQL Editor 中运行此脚本

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建 users 表（扩展 Supabase Auth 的用户信息）
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  language TEXT NOT NULL DEFAULT 'zh' CHECK (language IN ('zh', 'en', 'ja', 'ko')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建 travel_plans 表
CREATE TABLE IF NOT EXISTS public.travel_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL CHECK (duration > 0),
  travelers INTEGER NOT NULL CHECK (travelers > 0),
  budget NUMERIC NOT NULL CHECK (budget >= 0),
  interests TEXT NOT NULL,
  special_requests TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'completed', 'cancelled')),
  language TEXT NOT NULL DEFAULT 'zh' CHECK (language IN ('zh', 'en', 'ja', 'ko')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建 expenses 表
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  travel_plan_id UUID REFERENCES public.travel_plans(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'transport', 'accommodation', 'activity', 'shopping', 'other')),
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'CNY',
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON public.travel_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_plans_status ON public.travel_plans(status);
CREATE INDEX IF NOT EXISTS idx_travel_plans_created_at ON public.travel_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_travel_plan_id ON public.expenses(travel_plan_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date DESC);

-- 创建触发器：自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travel_plans_updated_at
  BEFORE UPDATE ON public.travel_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全（Row Level Security, RLS）
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：用户只能访问自己的数据

-- Users 表策略
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Travel Plans 表策略
CREATE POLICY "Users can view own travel plans"
  ON public.travel_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own travel plans"
  ON public.travel_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own travel plans"
  ON public.travel_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own travel plans"
  ON public.travel_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Expenses 表策略
CREATE POLICY "Users can view own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);

-- 创建函数：自动创建用户资料
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：当新用户注册时自动创建资料
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 完成提示
DO $$
BEGIN
  RAISE NOTICE '✅ 数据库架构创建成功！';
  RAISE NOTICE '📊 创建了 3 个表：users, travel_plans, expenses';
  RAISE NOTICE '🔒 已启用行级安全（RLS）';
  RAISE NOTICE '⚡ 已创建索引和触发器';
  RAISE NOTICE '🎉 您现在可以开始使用 AI Travel Planner 了！';
END $$;


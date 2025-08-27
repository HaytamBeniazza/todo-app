-- Todo App Database Schema
-- Copy and paste this into your Supabase SQL Editor

-- Create the todos table
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on user_email for better performance
CREATE INDEX idx_todos_user_email ON todos(user_email);

-- IMPORTANT: For this simple app, we'll disable RLS to avoid authentication issues
-- This allows the email-based identification to work properly
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;

-- If you want to enable RLS later with proper authentication, uncomment these lines:
-- ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
-- 
-- -- Create policies for authenticated users (requires Supabase Auth)
-- CREATE POLICY "Users can view own todos" ON todos
--   FOR ALL USING (auth.uid()::text = user_email);
-- 
-- CREATE POLICY "Users can insert own todos" ON todos
--   FOR INSERT WITH CHECK (auth.uid()::text = user_email);
-- 
-- CREATE POLICY "Users can update own todos" ON todos
--   FOR UPDATE USING (auth.uid()::text = user_email);
-- 
-- CREATE POLICY "Users can delete own todos" ON todos
--   FOR DELETE USING (auth.uid()::text = user_email);

-- Insert some sample data for testing (optional)
-- INSERT INTO todos (title, user_email) VALUES 
--   ('Learn Next.js', 'test@example.com'),
--   ('Build a todo app', 'test@example.com'),
--   ('Deploy to Vercel', 'test@example.com'); 
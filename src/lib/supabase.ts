import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface Todo {
  id: number
  title: string
  completed: boolean
  user_email: string
  created_at: string
  updated_at: string
}

export interface CreateTodoData {
  title: string
  user_email: string
}

export interface UpdateTodoData {
  title?: string
  completed?: boolean
} 
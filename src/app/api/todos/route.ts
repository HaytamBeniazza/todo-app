import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CreateTodoRequest, CreateTodoResponse, GetTodosResponse, ApiError } from '@/types/todo'

export async function POST(request: NextRequest): Promise<NextResponse<CreateTodoResponse | ApiError>> {
  try {
    // Parse the request body
    const body: CreateTodoRequest = await request.json()
    const { title, completed, user_email } = body

    // Validate required fields
    if (!title || !user_email) {
      return NextResponse.json(
        { error: 'Title and user_email are required fields' } as ApiError,
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(user_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' } as ApiError,
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not configured' } as ApiError,
        { status: 500 }
      )
    }

    // Insert the todo into the database
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          title: title.trim(),
          completed: completed || false,
          user_email: user_email.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create todo', details: error.message } as ApiError,
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data returned from database' } as ApiError,
        { status: 500 }
      )
    }

    // Return the created record with 201 status
    return NextResponse.json(
      {
        message: 'Todo created successfully',
        todo: data[0]
      } as CreateTodoResponse,
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' } as ApiError,
        { status: 400 }
      )
    }

    // Handle other unexpected errors
    return NextResponse.json(
      { error: 'Internal server error' } as ApiError,
      { status: 500 }
    )
  }
}

// Optional: Add GET method to retrieve todos for a specific user
export async function GET(request: NextRequest): Promise<NextResponse<GetTodosResponse | ApiError>> {
  try {
    const { searchParams } = new URL(request.url)
    const user_email = searchParams.get('user_email')

    if (!user_email) {
      return NextResponse.json(
        { error: 'user_email query parameter is required' } as ApiError,
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(user_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' } as ApiError,
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not configured' } as ApiError,
        { status: 500 }
      )
    }

    // Fetch todos for the user
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_email', user_email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch todos', details: error.message } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Todos retrieved successfully',
      todos: data || [],
      count: data?.length || 0
    } as GetTodosResponse)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' } as ApiError,
      { status: 500 }
    )
  }
} 
'use client'

import { useState, useEffect } from 'react'
import { Edit2, Trash2, Check, X } from 'lucide-react'
import { supabase, Todo, UpdateTodoData } from '@/lib/supabase'
import { useTheme } from '@/lib/theme'

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const fetchTodos = async (email: string) => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError('Failed to fetch todos. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim() || !userEmail || !supabase) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: newTodo.trim(), user_email: userEmail }])
        .select()

      if (error) throw error

      if (data) {
        setTodos([data[0], ...todos])
        setNewTodo('')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
      setError('Failed to add todo. Please try again.')
    }
  }

  const updateTodo = async (id: number, updates: UpdateTodoData) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, ...updates } : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
      setError('Failed to update todo. Please try again.')
    }
  }

  const deleteTodo = async (id: number) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
      setError('Failed to delete todo. Please try again.')
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditTitle(todo.title)
  }

  const saveEdit = async () => {
    if (!editingId || !editTitle.trim()) return

    await updateTodo(editingId, { title: editTitle.trim() })
    setEditingId(null)
    setEditTitle('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const handleUserEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailInput.trim() && emailRegex.test(emailInput.trim())) {
      const email = emailInput.trim()
      setUserEmail(email)
      localStorage.setItem('userEmail', email)
      fetchTodos(email)
    } else {
      setError('Please enter a valid email address')
    }
  }

  useEffect(() => {
    setMounted(true)

    // Check if Supabase is configured
    if (!supabase) {
      setError('Supabase is not configured. Please check your environment variables.')
      setIsLoading(false)
      return
    }

    // Check if user email is stored in localStorage
    const storedEmail = localStorage.getItem('userEmail')
    if (storedEmail) {
      setUserEmail(storedEmail)
      setEmailInput(storedEmail)
      fetchTodos(storedEmail)
    } else {
      setIsLoading(false)
    }
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-700 font-medium">Initializing...</p>
        </div>
      </div>
    )
  }

  // const toggleTheme = () => { // This function is removed as per the edit hint
  //   const newTheme = theme === 'light' ? 'dark' : 'light'
  //   setTheme(newTheme)
  //   localStorage.setItem('theme', newTheme)
    
  //   // Apply theme to document
  //   if (newTheme === 'dark') {
  //     document.documentElement.classList.add('dark')
  //   } else {
  //     document.documentElement.classList.remove('dark')
  //   }
    
  //   // Debug logging
  //   console.log('Theme changed to:', newTheme)
  //   console.log('Document classes:', document.documentElement.classList.toString())
  //   console.log('CSS variables:', {
  //     background: getComputedStyle(document.documentElement).getPropertyValue('--background'),
  //     cardBackground: getComputedStyle(document.documentElement).getPropertyValue('--card-background'),
  //     textPrimary: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
  //     textSecondary: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
  //     border: getComputedStyle(document.documentElement).getPropertyValue('--border'),
  //     hover: getComputedStyle(document.documentElement).getPropertyValue('--hover')
  //   })
  // }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-8">
        <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-[var(--text-primary)] mb-4">Configuration Error</h1>
          <p className="text-[var(--text-primary)] mb-4">{error}</p>
          <p className="text-[var(--text-secondary)]">
            Please check your environment variables and restart the development server.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--border)] rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-[var(--text-primary)] font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-8">
        <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-[var(--text-primary)] mb-2">TaskFlow</h1>
            <p className="text-[var(--text-secondary)]">Your minimalist productivity companion</p>
          </div>
          
          <form onSubmit={handleUserEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[var(--text-primary)] font-medium text-[var(--text-primary)] mb-3">
                Enter your email to get started
              </label>
              <input
                type="email"
                id="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value)
                  setError(null)
                }}
                placeholder="your.email@example.com"
                className="w-full h-[52px] px-4 bg-[var(--card-background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--text-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-all duration-200"
                required
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              />
              {error && <p className="text-small text-red-600 mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full h-[52px] bg-[var(--card-background)] text-[var(--text-primary)] border border-[var(--text-primary)] rounded-lg hover:bg-[var(--text-primary)] hover:text-[var(--card-background)] transition-all duration-200 font-medium text-body"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-8">
      <div className="max-w-[600px] mx-auto px-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 p-4">
          <div>
            <h1 className="text-[var(--text-primary)] mb-2">TaskFlow</h1>
            <p className="text-[var(--text-primary)]">
              Welcome back, <span className="font-medium">{userEmail}</span>
            </p>
            <p className="text-small text-[var(--text-secondary)] mt-1">
              Current theme: {theme} mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)] transition-colors bg-[var(--card-background)] text-[var(--text-primary)]"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v6m0 6v6m11-11h-6m-6 0H1m20.4 7.6l-4.2-4.2m-12.8-4.2l4.2-4.2m0 12.8l-4.2 4.2m12.8 0l-4.2-4.2"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
          </button>
        </div>
        
        {/* Add Todo Form */}
        <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="mb-6 p-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full h-[52px] px-4 bg-[var(--card-background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--text-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-all duration-200"
          />
        </form>

        {/* Todos Section */}
        <div className="space-y-4 p-4">
          {todos.length === 0 ? (
            <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-lg p-12 text-center">
              <p className="text-[var(--text-primary)] mb-2">No tasks yet</p>
              <p className="text-[var(--text-secondary)]">Add your first task above to get started</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="task-card group bg-[var(--card-background)] border border-[var(--border)] rounded-lg min-h-[60px] p-4 transition-all duration-200 hover:bg-[var(--hover)] flex items-center justify-between">
                <div className="flex items-center flex-grow">
                  {/* Checkbox */}
                  <button
                    onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 mr-3 ${
                      todo.completed
                        ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--background)]'
                        : 'border-[var(--border)] hover:border-[var(--text-primary)]'
                    }`}
                  >
                    {todo.completed && <Check size={16} />}
                  </button>

                  {/* Todo Content */}
                  <div className="flex-grow">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-transparent border-b border-[var(--border)] outline-none text-[var(--text-primary)]"
                        autoFocus
                      />
                    ) : (
                      <p className={`text-[var(--text-primary)] ${todo.completed ? 'text-completed' : ''}`}>
                        {todo.title}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {editingId === todo.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="p-1 rounded-full hover:bg-[var(--hover)] text-[var(--text-primary)]"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 rounded-full hover:bg-[var(--hover)] text-[var(--text-primary)]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo)}
                          className="p-1 rounded-full hover:bg-[var(--hover)] text-[var(--text-primary)]"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="delete-btn p-1 rounded-full hover:bg-[var(--hover)] text-[var(--text-primary)]"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

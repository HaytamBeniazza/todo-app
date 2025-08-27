'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react'
import { supabase, Todo, UpdateTodoData } from '@/lib/supabase'

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
    if (emailInput.trim()) {
      const email = emailInput.trim()
      setUserEmail(email)
      localStorage.setItem('userEmail', email)
      fetchTodos(email)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please check your environment variables and restart the development server.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome to Todo App
          </h1>
          <form onSubmit={handleUserEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your email to get started
              </label>
              <input
                type="email"
                id="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-base"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium text-base"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Todo App
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Welcome, {userEmail}
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-base"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 font-medium text-base"
            >
              <Plus size={20} />
              Add
            </button>
          </form>

          <div className="space-y-3">
            {todos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No tasks yet. Add your first task above!
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 border rounded-lg transition-all duration-200 ${
                    todo.completed
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-300 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && <Check size={16} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-700 p-1"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`block truncate ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {todo.title}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEditing(todo)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      disabled={todo.completed}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

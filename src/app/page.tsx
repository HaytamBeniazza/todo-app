'use client'

import { useState, useEffect } from 'react'
import { Edit2, Trash2, Check, X } from 'lucide-react'
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
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-title text-gray-900 mb-4">Configuration Error</h1>
          <p className="text-body text-gray-700 mb-4">{error}</p>
          <p className="text-small text-gray-500">
            Please check your environment variables and restart the development server.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-body text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-title text-gray-900 mb-2">Welcome to TaskFlow</h1>
            <p className="text-body text-gray-600">Your minimalist productivity companion</p>
          </div>
          
          <form onSubmit={handleUserEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-small font-medium text-gray-700 mb-3">
                Enter your email to get started
              </label>
              <input
                type="email"
                id="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 text-body text-gray-900 placeholder-gray-500 transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium text-body"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 px-8">
      <div className="max-w-[600px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-title text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-body text-gray-600">
            Welcome back, <span className="font-medium">{userEmail}</span>
          </p>
        </div>
        
        {/* Add Todo Form */}
        <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full h-[52px] px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 text-body text-gray-900 placeholder-gray-500 transition-all duration-200"
          />
        </form>

        {/* Todos Section */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-body text-gray-600 mb-2">No tasks yet</p>
              <p className="text-small text-gray-500">Add your first task above to get started</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="group bg-white border border-gray-200 rounded-lg min-h-[60px] transition-all duration-200 hover:bg-gray-50"
              >
                <div className="p-4 flex items-center">
                  {/* Checkbox */}
                  <button
                    onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mr-3 ${
                      todo.completed
                        ? 'bg-gray-900 border-transparent text-white'
                        : 'border-gray-200 hover:border-gray-900'
                    }`}
                  >
                    {todo.completed && <Check size={16} />}
                  </button>

                  {/* Todo Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 text-body text-gray-900"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`block text-body transition-all duration-200 ${
                          todo.completed 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-900'
                        }`}
                      >
                        {todo.title}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => startEditing(todo)}
                      className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={todo.completed}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-600 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
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

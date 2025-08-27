export interface CreateTodoRequest {
  title: string
  completed?: boolean
  user_email: string
}

export interface CreateTodoResponse {
  message: string
  todo: Todo
}

export interface GetTodosResponse {
  message: string
  todos: Todo[]
  count: number
}

export interface Todo {
  id: number
  title: string
  completed: boolean
  user_email: string
  created_at: string
  updated_at: string
}

export interface ApiError {
  error: string
  details?: string
} 
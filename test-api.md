# TaskFlow API Testing Guide

## API Endpoint: `/api/todos`

### POST Request - Create Todo

**URL:** `POST /api/todos`

**Headers:**
```
Content-Type: application/json
```

**Request Body (n8n compatible):**
```json
{
  "title": "Enhanced task text",
  "completed": false,
  "user_email": "user@example.com"
}
```

**Expected Response (201 Created):**
```json
{
  "message": "Todo created successfully",
  "todo": {
    "id": 1,
    "title": "Enhanced task text",
    "completed": false,
    "user_email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET Request - Retrieve Todos

**URL:** `GET /api/todos?user_email=user@example.com`

**Expected Response (200 OK):**
```json
{
  "message": "Todos retrieved successfully",
  "todos": [
    {
      "id": 1,
      "title": "Enhanced task text",
      "completed": false,
      "user_email": "user@example.com",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

## Testing with cURL

### Create Todo:
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Enhanced task text",
    "completed": false,
    "user_email": "user@example.com"
  }'
```

### Get Todos:
```bash
curl "http://localhost:3000/api/todos?user_email=user@example.com"
```

## Testing with n8n

1. **HTTP Request Node Configuration:**
   - Method: POST
   - URL: `http://localhost:3000/api/todos`
   - Headers: `Content-Type: application/json`
   - Body: JSON with title, completed, and user_email

2. **Expected n8n Response:**
   - Status: 201
   - Body: JSON with created todo object

## Error Responses

### 400 Bad Request - Missing Fields:
```json
{
  "error": "Title and user_email are required fields"
}
```

### 400 Bad Request - Invalid Email:
```json
{
  "error": "Invalid email format"
}
```

### 500 Internal Server Error:
```json
{
  "error": "Failed to create todo",
  "details": "Database error message"
}
```

## Database Schema Requirements

The API expects a `todos` table with the following structure:
```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
``` 
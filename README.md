# Todo App

A modern, responsive todo list application built with Next.js, Supabase, and Tailwind CSS.

## Features

- ✅ Add new tasks
- ✏️ Edit existing tasks
- ☑️ Mark tasks as complete/incomplete
- 🗑️ Delete tasks
- 👤 User identification via email
- 💾 Persistent data storage with Supabase
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🚀 Ready for Vercel deployment

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd todo-app

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to **Settings** → **API**
3. Copy your **Project URL** and **anon public** key

### 3. Create Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database Schema

In your Supabase dashboard, go to **SQL Editor** and run this SQL:

```sql
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

-- IMPORTANT: For this simple app, RLS is disabled to avoid authentication issues
-- This allows the email-based identification to work properly
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
```

**Note**: This app uses a simple email-based identification system. Row Level Security (RLS) is disabled by default to ensure the app works without complex authentication setup. For production use, consider implementing proper Supabase Auth with RLS policies.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Test the App

1. Enter your email address to get started
2. Add some tasks
3. Mark tasks as complete
4. Edit task titles
5. Delete tasks
6. Refresh the page to verify data persistence

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit: Todo app with Supabase"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **New Project**
3. Import your GitHub repository
4. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### 3. Security Considerations

The current setup disables RLS for simplicity. For production use:

1. **Enable Supabase Auth** for proper user authentication
2. **Enable RLS** with appropriate policies
3. **Implement proper user sessions** instead of email-based identification

## Project Structure

```
todo-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main todo app component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   └── lib/
│       └── supabase.ts       # Supabase client & types
├── public/                    # Static assets
├── .env.local                # Environment variables (create this)
├── package.json              # Dependencies
└── README.md                 # This file
```

## Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind classes in `src/app/page.tsx` for component styling

### Features
- Add due dates to todos
- Implement categories/tags
- Add priority levels
- Include search functionality
- Add sorting options

### Database
- Modify the `todos` table schema in Supabase
- Update the TypeScript interfaces in `src/lib/supabase.ts`

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` is in the root directory
   - Restart the development server after adding environment variables

2. **Supabase Connection Issues**
   - Verify your project URL and anon key
   - Check if your Supabase project is active
   - Ensure the `todos` table exists

3. **Permission Errors (401)**
   - Make sure you've run the updated database schema
   - Verify RLS is disabled: `ALTER TABLE todos DISABLE ROW LEVEL SECURITY;`
   - Check that your Supabase anon key has the correct permissions

4. **Build Errors**
   - Run `npm run build` locally to identify issues
   - Check TypeScript errors with `npm run lint`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Check the Next.js documentation
4. Open an issue in the repository

---

**Happy coding! 🚀**

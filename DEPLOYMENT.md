# Deployment Guide - Vercel

This guide will walk you through deploying your Todo App to Vercel step by step.

## Prerequisites

- ✅ Todo App built and tested locally
- ✅ Supabase project set up and configured
- ✅ GitHub repository created and code pushed
- ✅ Vercel account (free tier available)

## Step 1: Prepare Your Local Project

### 1.1 Test Your App Locally

```bash
# Make sure you're in the todo-app directory
cd todo-app

# Install dependencies
npm install

# Test the build
npm run build

# If build succeeds, start the dev server
npm run dev
```

### 1.2 Verify Environment Variables

Ensure your `.env.local` file contains:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

**Important**: Never commit `.env.local` to Git! It should already be in `.gitignore`.

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Todo app with Supabase integration"
```

### 2.2 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **New repository**
3. Name it `todo-app` (or your preferred name)
4. Make it public or private (your choice)
5. Don't initialize with README (we already have one)
6. Click **Create repository**

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **New Project**
3. Click **Import Git Repository**
4. Select your `todo-app` repository
5. Click **Import**

### 3.2 Configure Project Settings

Vercel will automatically detect it's a Next.js project. Configure:

- **Project Name**: `todo-app` (or your preferred name)
- **Framework Preset**: Next.js (should be auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (should be auto-detected)
- **Output Directory**: `.next` (should be auto-detected)
- **Install Command**: `npm install` (should be auto-detected)

### 3.3 Add Environment Variables

**Critical Step**: Add your Supabase environment variables:

1. In the **Environment Variables** section, add:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `your_supabase_project_url`
   - **Environment**: Production, Preview, Development (check all)

2. Add the second variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `your_supabase_anon_key`
   - **Environment**: Production, Preview, Development (check all)

### 3.4 Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## Step 4: Verify Deployment

### 4.1 Test Your Live App

1. Open your deployed URL
2. Enter your email address
3. Add a test todo
4. Mark it as complete
5. Edit the todo
6. Delete the todo
7. Refresh the page to verify data persistence

### 4.2 Check Supabase

1. Go to your Supabase dashboard
2. Navigate to **Table Editor** → **todos**
3. Verify that your test data was created

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain

1. In your Vercel project dashboard, go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `todos.yourdomain.com`)
4. Follow the DNS configuration instructions

### 5.2 Configure DNS

Add a CNAME record pointing to your Vercel deployment:
```
Type: CNAME
Name: todos (or your preferred subdomain)
Value: your-project-name.vercel.app
```

## Step 6: Continuous Deployment

### 6.1 Automatic Deployments

Vercel automatically deploys when you push to:
- `main` branch → Production
- Any other branch → Preview deployment

### 6.2 Preview Deployments

Every pull request gets a preview URL for testing before merging.

## Troubleshooting

### Build Failures

1. **Environment Variables Missing**
   - Ensure all environment variables are set in Vercel
   - Check that variable names match exactly

2. **TypeScript Errors**
   - Run `npm run build` locally first
   - Fix any TypeScript errors before pushing

3. **Dependency Issues**
   - Check `package.json` for correct dependencies
   - Ensure all imports are correct

### Runtime Errors

1. **Supabase Connection Issues**
   - Verify environment variables in Vercel
   - Check Supabase project status
   - Ensure database schema is correct

2. **CORS Issues**
   - Check Supabase RLS policies
   - Verify API keys are correct

### Performance Issues

1. **Slow Loading**
   - Check Supabase query performance
   - Consider adding database indexes
   - Use Vercel's Edge Functions if needed

## Monitoring & Analytics

### 1. Vercel Analytics

Enable Vercel Analytics in your project settings for:
- Page views
- Performance metrics
- User behavior insights

### 2. Supabase Monitoring

Monitor your database in Supabase dashboard:
- Query performance
- Storage usage
- API usage

## Security Considerations

### 1. Environment Variables
- ✅ Never expose sensitive keys in client-side code
- ✅ Use `NEXT_PUBLIC_` prefix only for public keys
- ✅ Rotate API keys regularly

### 2. Database Security
- ✅ Enable RLS in production
- ✅ Use proper authentication (consider Supabase Auth)
- ✅ Regular security audits

## Cost Optimization

### 1. Vercel
- Free tier: 100GB bandwidth/month
- Pro tier: $20/month for unlimited bandwidth

### 2. Supabase
- Free tier: 500MB database, 2GB bandwidth
- Pro tier: $25/month for 8GB database, 250GB bandwidth

## Next Steps

After successful deployment:

1. **Set up monitoring** and alerts
2. **Implement proper authentication** with Supabase Auth
3. **Add more features** like categories, due dates, etc.
4. **Set up CI/CD** with GitHub Actions
5. **Add testing** with Jest/React Testing Library

---

**🎉 Congratulations! Your Todo App is now live on Vercel!**

For support, check the main README.md or open an issue in your repository. 
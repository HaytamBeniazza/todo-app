# Quick Fix for 401 Authentication Error

## 🚨 **Immediate Fix Required**

If you're getting a **401 Unauthorized** error when trying to add/edit/delete todos, follow these steps:

## Step 1: Update Your Database Schema

Go to your **Supabase Dashboard** → **SQL Editor** and run this command:

```sql
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
```

## Step 2: Verify the Change

Check that RLS is disabled by running:

```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'todos';
```

You should see `rowsecurity = false` for the todos table.

## Step 3: Test Your App

1. Refresh your todo app
2. Try adding a new todo
3. The 401 error should be gone!

## 🔍 **Why This Happens**

The 401 error occurs because:
- **Row Level Security (RLS)** is enabled by default in Supabase
- **RLS policies** require proper authentication (auth.uid())
- **Our simple email-based app** doesn't have auth.uid() available
- **Result**: All database operations are blocked

## 🛡️ **Security Note**

Disabling RLS means:
- ✅ **Your app will work immediately**
- ⚠️ **Anyone with your API key can access all todos**
- 🔒 **For production, implement proper Supabase Auth**

## 🚀 **Production Upgrade Path**

When you're ready for production:

1. **Enable Supabase Auth** in your project
2. **Update your app** to use proper authentication
3. **Re-enable RLS** with proper policies
4. **Remove email-based identification**

## 📞 **Still Having Issues?**

If the problem persists:

1. **Check your environment variables** are correct
2. **Verify your Supabase project** is active
3. **Ensure the todos table** exists and has the right structure
4. **Check the browser console** for additional error details

---

**This fix will resolve your 401 error immediately!** 🎉 
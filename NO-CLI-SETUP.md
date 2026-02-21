# 🚀 Quick Setup Without Supabase CLI

Good news! You don't need the Supabase CLI to get started. Your API key is already configured!

## ✅ Your Configuration is Complete!

Your `.env` file has the correct API key. You can start using your app right now!

---

## 🎯 Start Your App (No CLI Needed!)

```powershell
npm run dev
```

Your app will be live at: http://localhost:5173

---

## 📋 Essential Dashboard Configuration (3 minutes)

Before using authentication and storage, configure these in your Supabase Dashboard:

### 1. Authentication URLs (2 minutes)
🔗 https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/auth/url-configuration

**Settings to add:**
- **Site URL**: `http://localhost:5173`
- **Redirect URLs**: `http://localhost:5173/**`

### 2. Storage Bucket (1 minute)
🔗 https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/storage/buckets

**Create bucket:**
- Name: `hospital-images`
- Make it **Public** ✓

### 3. Storage Policies (30 seconds)
🔗 https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/sql/new

Copy and run the SQL from: `supabase/setup-storage.sql`

---

## 🎊 That's It! You're Ready!

Your database schema is already set up in your Supabase project. Just:
1. Configure Auth URLs (above)
2. Create storage bucket (above)
3. Start your app: `npm run dev`

---

## 📦 Optional: Install Supabase CLI (For Advanced Features)

Only install the CLI if you need to:
- Push schema changes
- Manage migrations
- Use local development

### Installation Options:

**Option 1: Scoop (Recommended for Windows)**
```powershell
# Install Scoop if you don't have it
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Option 2: NPM**
```powershell
npm install -g supabase
```

**Option 3: Direct Download**
Download from: https://github.com/supabase/cli/releases
Add to your PATH

---

## 🔄 After Installing CLI (Optional)

If you install the CLI, you can link your project:

```powershell
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref yfzpcyppnobbqbpsedtm

# Push any schema changes (if needed)
supabase db push
```

But remember: **This is optional!** Your app works without the CLI.

---

## ✨ What Works Right Now

Without CLI installed, you can:
- ✅ Sign up / Sign in
- ✅ Browse hospitals
- ✅ Request consultations
- ✅ Update profile
- ✅ Reset password
- ✅ All frontend features

The CLI is only needed for database schema changes.

---

## 🚀 Your Next Commands

```powershell
# Just start your app!
npm run dev

# Open in browser
# http://localhost:5173
```

Then configure Auth URLs and Storage in the dashboard (links above).

**You're ready to go!** 🎉

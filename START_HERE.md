# 🚀 START HERE - Supabase Migration Quick Start

Your app is **90% configured** for the new Supabase project! Follow these steps to complete the setup.

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Get Your API Key (2 minutes)

1. **Open this link**: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/settings/api
2. **Find the "anon" "public" key** in the Project API keys section
3. **Copy it** (starts with `eyJ...`)

### Step 2: Update Your .env File (1 minute)

1. Open `.env` file in your project root
2. Replace `PASTE_YOUR_ANON_PUBLIC_KEY_HERE` with the key you just copied
3. Save the file

**Your .env should look like this:**
```env
VITE_SUPABASE_PROJECT_ID="yfzpcyppnobbqbpsedtm"
VITE_SUPABASE_URL="https://yfzpcyppnobbqbpsedtm.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 3: Verify Configuration (30 seconds)

Run the verification script:
```powershell
.\verify-setup.ps1
```

All checks should show ✅ green checkmarks.

### Step 4: Link Your Project (1 minute)

```powershell
supabase link --project-ref yfzpcyppnobbqbpsedtm
```

When prompted, enter your database password (from your Supabase project settings).

### Step 5: Push Database Schema (30 seconds)

```powershell
supabase db push
```

This will create all your tables, functions, and policies.

### Step 6: Configure Supabase Dashboard (2 minutes)

#### A. Authentication Settings
1. Go to: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/auth/url-configuration
2. Set **Site URL**: `http://localhost:5173`
3. Add **Redirect URLs**:
   - `http://localhost:5173/**`
   - Add your production URL when ready
4. Save changes

#### B. Email Provider
1. Go to: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/auth/providers
2. Enable **Email** provider if not already enabled
3. Use default settings for development (Supabase SMTP)

#### C. Storage Bucket
1. Go to: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/storage/buckets
2. Create a new bucket:
   - Name: `hospital-images`
   - Make it **Public**
3. Run the storage policies SQL:
   - Go to SQL Editor: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/sql/new
   - Copy content from `supabase/setup-storage.sql`
   - Execute it

### Step 7: Start Your App! 🎉

```powershell
npm run dev
```

Your app should now be running at http://localhost:5173

---

## ✅ Verification Checklist

- [ ] API key copied from Supabase Dashboard
- [ ] .env file updated with real API key
- [ ] `verify-setup.ps1` shows all green checkmarks
- [ ] Project linked with `supabase link`
- [ ] Schema pushed with `supabase db push`
- [ ] Auth URL settings configured in Dashboard
- [ ] Email provider enabled
- [ ] Storage bucket `hospital-images` created and public
- [ ] Storage policies SQL executed
- [ ] Dev server starts without errors
- [ ] Can sign up for a new account
- [ ] Can sign in with created account

---

## 🎯 What's Already Done For You

✅ `.env` file created with project ID and URL  
✅ `supabase/config.toml` updated with new project ID  
✅ All migration scripts created  
✅ Database schema files ready in `supabase/migrations/`  
✅ Storage setup SQL ready in `supabase/setup-storage.sql`  
✅ Password reset functionality implemented  
✅ Logo updated throughout app  

---

## 🆘 Troubleshooting

### "Invalid API key" Error
- Make sure you copied the **anon/public key**, not the service role key
- Check that there are no extra spaces in your .env file
- Restart dev server after updating .env

### "Failed to link project"
- Make sure you're logged into Supabase CLI: `supabase login`
- Check your database password in project settings

### "Migration failed"
- Make sure you're using `supabase db push` not `supabase db migrate`
- Check that you're in the project root directory

### Storage upload fails
- Verify bucket is **public**
- Run `supabase/setup-storage.sql` in SQL Editor
- Check bucket name is exactly `hospital-images`

---

## 📚 Additional Resources

- **QUICK_START.md** - Detailed 5-minute setup guide
- **SUPABASE_MIGRATION_GUIDE.md** - Complete migration documentation
- **SUPABASE_SETUP_CHECKLIST.md** - Printable checklist
- **FORGOT_PASSWORD_SETUP.md** - Password reset configuration

---

## 🎊 You're Almost There!

Just get that API key, update .env, and run the commands above. Your app will be live in 5 minutes!

Need help? Check the troubleshooting section or the detailed guides mentioned above.

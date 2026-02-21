# 🔄 Supabase Project Migration Guide
## Migrating to New Supabase Project: yfzpcyppnobbqbpsedtm

This guide will help you migrate your AfayaConekt application from the old Supabase project to your new one.

---

## 📋 Prerequisites

Before you begin, ensure you have:
- [ ] Access to Supabase Dashboard: https://supabase.com/dashboard
- [ ] Your new project ID: `yfzpcyppnobbqbpsedtm`
- [ ] Supabase CLI installed (we'll install it if needed)
- [ ] Git installed
- [ ] Node.js installed

---

## 🚀 Step-by-Step Migration Process

### STEP 1: Get Your New Supabase Credentials

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm

2. **Get your API Keys:**
   - Click on **Settings** (gear icon) in the sidebar
   - Go to **API** section
   - Copy the following values:
     - **Project URL**: `https://yfzpcyppnobbqbpsedtm.supabase.co`
     - **anon/public key**: (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
     - **service_role key**: (you'll need this for migrations)

3. **Write them down here:**
   ```
   Project URL: https://yfzpcyppnobbqbpsedtm.supabase.co
   Anon Key: _____________________________________________
   Service Role Key: _____________________________________
   ```

---

### STEP 2: Update Environment Variables

1. **Update your `.env` file:**
   
   Open `d:\React Projects\afaya-care-link\.env` and replace with:

   ```env
   VITE_SUPABASE_PROJECT_ID="yfzpcyppnobbqbpsedtm"
   VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_NEW_ANON_KEY_HERE"
   VITE_SUPABASE_URL="https://yfzpcyppnobbqbpsedtm.supabase.co"
   ```

2. **Create `.env.local` for local development (optional but recommended):**
   ```env
   VITE_SUPABASE_PROJECT_ID="yfzpcyppnobbqbpsedtm"
   VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_NEW_ANON_KEY_HERE"
   VITE_SUPABASE_URL="https://yfzpcyppnobbqbpsedtm.supabase.co"
   ```

---

### STEP 3: Install Supabase CLI (if not already installed)

```powershell
# Install Supabase CLI via npm
npm install -g supabase

# Verify installation
supabase --version
```

---

### STEP 4: Link Your Project to Supabase CLI

```powershell
# Navigate to your project directory
cd "d:\React Projects\afaya-care-link"

# Login to Supabase (will open browser)
supabase login

# Link to your new project
supabase link --project-ref yfzpcyppnobbqbpsedtm
```

When prompted:
- Enter your database password (you set this when creating the project)
- If you don't remember it, you can reset it in Supabase Dashboard → Settings → Database

---

### STEP 5: Run Database Migrations

Your project already has migration files in the `supabase/migrations/` folder. Let's apply them to your new project:

```powershell
# Push all migrations to the new Supabase project
supabase db push

# Verify migrations were applied
supabase db reset
```

This will create all the necessary tables and functions:
- ✅ `profiles` table
- ✅ `hospitals` table
- ✅ `specialists` table
- ✅ `consultations` table
- ✅ `analytics_events` table
- ✅ RLS (Row Level Security) policies
- ✅ Database functions and triggers

---

### STEP 6: Configure Authentication Settings

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm

2. **Configure Email Auth:**
   - Navigate to: **Authentication** → **Providers**
   - Enable **Email** provider
   - Enable **Email confirmations** (optional but recommended)

3. **Configure Site URL:**
   - Go to: **Authentication** → **URL Configuration**
   - Set **Site URL**: 
     - Development: `http://localhost:8080`
     - Production: Your deployed URL
   
4. **Add Redirect URLs:**
   - Same location: **Authentication** → **URL Configuration**
   - Add these URLs:
     ```
     http://localhost:8080/**
     http://localhost:8080/reset-password
     https://your-production-domain.com/**
     https://your-production-domain.com/reset-password
     ```

---

### STEP 7: Configure Storage (for hospital images)

1. **Create Storage Buckets:**
   - Go to: **Storage** in Supabase Dashboard
   - Create a bucket named: `hospital-images`
   - Make it **Public** (so images can be accessed)

2. **Set Storage Policies:**
   - Click on the `hospital-images` bucket
   - Go to **Policies**
   - Add policies for:
     - ✅ Public read access
     - ✅ Authenticated users can upload
     - ✅ Admins can delete

   Or run this SQL in SQL Editor:
   ```sql
   -- Allow public access to read files
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'hospital-images');

   -- Allow authenticated users to upload files
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'hospital-images' AND auth.role() = 'authenticated');

   -- Allow authenticated users to update their own files
   CREATE POLICY "Users can update own files"
   ON storage.objects FOR UPDATE
   USING (bucket_id = 'hospital-images' AND auth.role() = 'authenticated');

   -- Allow admins to delete files
   CREATE POLICY "Admins can delete files"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'hospital-images' 
     AND auth.uid() IN (
       SELECT id FROM profiles WHERE role = 'admin'
     )
   );
   ```

---

### STEP 8: Set Up Admin User

After migrations, you'll need to create an admin user:

1. **Method A: Via Supabase Dashboard**
   - Go to: **Authentication** → **Users**
   - Click **Add user** → **Create new user**
   - Enter email and password
   - Click **Create user**
   - Note the User ID

2. **Update user to admin role:**
   - Go to: **SQL Editor**
   - Run this query (replace USER_ID with the actual ID):
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = 'USER_ID_HERE';
   ```

3. **Method B: Sign up via your app and promote**
   ```powershell
   # Start your app
   npm run dev
   ```
   - Go to http://localhost:8080/auth
   - Sign up with your admin email
   - Then in Supabase SQL Editor, run:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```

---

### STEP 9: Seed Initial Data (Optional)

If you want to add sample hospitals and specialists:

1. **Create seed file:** `supabase/seed.sql`

2. **Run seed data:**
   ```powershell
   supabase db reset --seed
   ```

Or manually insert via SQL Editor in Supabase Dashboard.

---

### STEP 10: Test Your Application

```powershell
# Install dependencies (if not already)
npm install

# Start development server
npm run dev
```

**Test these features:**
- [ ] Sign up with a new account
- [ ] Login with the account
- [ ] View hospitals list
- [ ] View hospital details
- [ ] Request a consultation
- [ ] View "My Consultations"
- [ ] Login as admin
- [ ] Access admin dashboard
- [ ] Add a new hospital (admin)
- [ ] Add specialists (admin)
- [ ] Manage consultations (admin)
- [ ] Test forgot password flow
- [ ] Test password reset

---

### STEP 11: Update Lovable Configuration (If using Lovable)

If you're deploying via Lovable:

1. **Update Lovable Environment Variables:**
   - Go to Lovable Dashboard
   - Navigate to: **Settings** → **Environment Variables**
   - Update:
     ```
     VITE_SUPABASE_PROJECT_ID=yfzpcyppnobbqbpsedtm
     VITE_SUPABASE_PUBLISHABLE_KEY=your-new-anon-key
     VITE_SUPABASE_URL=https://yfzpcyppnobbqbpsedtm.supabase.co
     ```

2. **Redeploy:**
   - Commit and push your changes
   - Lovable will auto-deploy with new configuration

---

## 🔐 Security Checklist

After migration, ensure:
- [ ] RLS (Row Level Security) is enabled on all tables
- [ ] Storage policies are configured
- [ ] API keys are not committed to Git
- [ ] `.env` is in `.gitignore`
- [ ] Admin users are properly configured
- [ ] Email templates are customized
- [ ] SMTP is configured for production

---

## 📊 Database Schema Overview

Your new database will have these tables:

### `profiles`
- User profile information
- Columns: id, email, full_name, phone, country, role, created_at, updated_at

### `hospitals`
- Hospital information
- Columns: id, name, location, country, specialties, description, accreditations, image_url, website, contact_email, contact_phone, created_at, updated_at

### `specialists`
- Doctor/specialist information
- Columns: id, hospital_id, name, specialty, qualifications, experience_years, image_url, available_days, created_at, updated_at

### `consultations`
- Patient consultation requests
- Columns: id, patient_id, hospital_id, specialist_id, status, medical_condition, preferred_date, notes, admin_notes, medical_records_urls, created_at, updated_at

### `analytics_events`
- User activity tracking
- Columns: id, user_id, event_type, event_data, created_at

---

## 🐛 Troubleshooting

### Issue: "Failed to push migrations"
**Solution:**
```powershell
# Check connection
supabase status

# Relink project
supabase link --project-ref yfzpcyppnobbqbpsedtm

# Try again
supabase db push
```

### Issue: "Cannot read properties of null"
**Solution:**
- Ensure `.env` is updated with new credentials
- Restart your dev server: `npm run dev`

### Issue: "RLS policy violation"
**Solution:**
- Check that RLS policies were created
- Run migrations again: `supabase db reset`

### Issue: "Storage bucket not found"
**Solution:**
- Create the `hospital-images` bucket in Supabase Dashboard
- Make it public

---

## 📝 Post-Migration Checklist

- [ ] Environment variables updated
- [ ] Database migrations applied
- [ ] Authentication configured
- [ ] Storage buckets created
- [ ] Admin user created
- [ ] Local testing completed
- [ ] Email auth tested
- [ ] Forgot password tested
- [ ] All features working
- [ ] Deployed to production

---

## 🎉 You're Done!

Your AfayaConekt application is now connected to your new Supabase project!

**Next Steps:**
1. Add sample hospitals and specialists
2. Configure custom email SMTP
3. Customize email templates
4. Deploy to production
5. Set up monitoring and analytics

---

## 📞 Need Help?

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project Dashboard: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm

---

**Migration Date:** ${new Date().toLocaleDateString()}
**New Project ID:** yfzpcyppnobbqbpsedtm

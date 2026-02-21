# 🎯 New Supabase Project Setup Checklist
## Project ID: yfzpcyppnobbqbpsedtm

**Start Date:** ________________
**Completion Date:** ________________

---

## Phase 1: Get Credentials ✅

- [ ] Access new Supabase project
      → https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm

- [ ] Get API credentials
      → Settings → API
      → Copy Project URL: `https://yfzpcyppnobbqbpsedtm.supabase.co`
      → Copy anon/public key: ________________________________
      → Copy service_role key (optional): ____________________

- [ ] Save credentials securely
      → Store in password manager
      → Don't commit to Git

---

## Phase 2: Update Local Environment ✅

- [ ] Update `.env` file
      → Open: `d:\React Projects\afaya-care-link\.env`
      → Update VITE_SUPABASE_PROJECT_ID to: `yfzpcyppnobbqbpsedtm`
      → Update VITE_SUPABASE_URL to: `https://yfzpcyppnobbqbpsedtm.supabase.co`
      → Update VITE_SUPABASE_PUBLISHABLE_KEY with your anon key
      → Save file

- [ ] Verify `.env` is in `.gitignore`
      → Check `.gitignore` contains `.env`
      → Never commit API keys!

---

## Phase 3: Install and Configure Supabase CLI ✅

- [ ] Install Supabase CLI
      ```powershell
      npm install -g supabase
      ```

- [ ] Verify installation
      ```powershell
      supabase --version
      ```

- [ ] Login to Supabase
      ```powershell
      supabase login
      ```
      → Browser will open for authentication

- [ ] Link project
      ```powershell
      cd "d:\React Projects\afaya-care-link"
      supabase link --project-ref yfzpcyppnobbqbpsedtm
      ```
      → Enter database password when prompted

---

## Phase 4: Database Migration ✅

- [ ] Push migrations to new project
      ```powershell
      supabase db push
      ```

- [ ] Verify migrations applied
      → Go to Supabase Dashboard → Database → Tables
      → Should see: profiles, hospitals, specialists, consultations, analytics_events

- [ ] Check RLS policies
      → Database → Policies
      → Verify policies exist for each table

- [ ] Run additional setup if needed
      ```powershell
      supabase db reset
      ```

---

## Phase 5: Configure Authentication ✅

- [ ] Enable Email Auth
      → Authentication → Providers
      → Click "Email"
      → Toggle "Enable Email provider" ON
      → Save

- [ ] Configure email confirmations (optional)
      → Same page
      → Toggle "Enable email confirmations" (optional)
      → Save

- [ ] Set Site URL
      → Authentication → URL Configuration
      → Site URL: `http://localhost:8080` (for dev)
      → Add production URL when ready

- [ ] Add Redirect URLs
      → Same page → Redirect URLs
      → Add: `http://localhost:8080/**`
      → Add: `http://localhost:8080/reset-password`
      → Add production URLs when ready
      → Save

- [ ] Review email templates
      → Authentication → Email Templates
      → Customize "Confirm Signup" template (optional)
      → Customize "Reset Password" template (optional)
      → Add logo and branding

---

## Phase 6: Configure Storage ✅

- [ ] Create storage bucket
      → Storage (left sidebar)
      → Click "New bucket"
      → Name: `hospital-images`
      → Toggle "Public bucket" ON
      → Create bucket

- [ ] Set storage policies
      → Click on `hospital-images` bucket
      → Go to "Policies" tab
      → Click "New Policy"
      → Or run: `supabase\setup-storage.sql` in SQL Editor

- [ ] Test storage
      → Try uploading a test image
      → Verify you can access it via public URL

---

## Phase 7: Create Admin User ✅

- [ ] Method A: Create via Dashboard
      → Authentication → Users
      → Click "Add user"
      → Enter email and password
      → Create user
      → Copy User ID: _________________________________

- [ ] Method B: Sign up via app
      ```powershell
      npm run dev
      ```
      → Go to http://localhost:8080/auth
      → Sign up with your email
      → Check email for confirmation (if enabled)

- [ ] Promote user to admin
      → Go to SQL Editor in Supabase
      → Run: `supabase\create-admin.sql`
      → Or run:
      ```sql
      UPDATE profiles 
      SET role = 'admin' 
      WHERE email = 'your-email@example.com';
      ```

- [ ] Verify admin access
      → Login to app
      → Navigate to: http://localhost:8080/admin
      → Should see admin dashboard

---

## Phase 8: Test Application ✅

- [ ] Install dependencies
      ```powershell
      npm install
      ```

- [ ] Start dev server
      ```powershell
      npm run dev
      ```

- [ ] Test authentication
      - [ ] Sign up new user
      - [ ] Login with credentials
      - [ ] Logout
      - [ ] Login again

- [ ] Test forgot password
      - [ ] Click "Forgot password?"
      - [ ] Enter email
      - [ ] Check email inbox
      - [ ] Click reset link
      - [ ] Set new password
      - [ ] Login with new password

- [ ] Test user features
      - [ ] View hospitals list
      - [ ] View hospital details
      - [ ] Request consultation
      - [ ] View "My Consultations"
      - [ ] Upload medical records

- [ ] Test admin features
      - [ ] Login as admin
      - [ ] Access admin dashboard
      - [ ] View all consultations
      - [ ] Add new hospital
      - [ ] Add specialist to hospital
      - [ ] Update consultation status
      - [ ] View analytics

---

## Phase 9: Configure Email Service (Production) ✅

- [ ] Choose email provider
      → SendGrid (recommended - 100 emails/day free)
      → Mailgun (1,000 emails/month free)
      → Resend (modern, developer-friendly)
      → Amazon SES (cheapest for volume)

- [ ] Sign up for email service
      → Create account
      → Verify sender email/domain
      → Generate API key: _________________________________

- [ ] Configure SMTP in Supabase
      → Settings → Auth → SMTP Settings
      → Enable "Custom SMTP"
      → Enter SMTP details:
        * Host: ____________________________
        * Port: ____________________________
        * Username: ________________________
        * Password/API Key: ________________
        * Sender Email: ____________________
        * Sender Name: AfayaConekt
      → Save

- [ ] Test email delivery
      → Request password reset
      → Check email arrives quickly
      → Click link and verify it works

---

## Phase 10: Optional Configuration ✅

- [ ] Set up database backups
      → Settings → Database → Backups
      → Configure automatic backups

- [ ] Configure CORS settings
      → Settings → API → CORS Configuration
      → Add allowed origins

- [ ] Set up webhooks (if needed)
      → Database → Webhooks
      → Configure for important events

- [ ] Enable database logs
      → Logs & Reports
      → Enable query logs for debugging

- [ ] Set up monitoring
      → Integrate with monitoring service
      → Set up alerts for errors

---

## Phase 11: Security Review ✅

- [ ] Verify RLS is enabled on all tables
      → Database → Tables
      → Check each table has RLS enabled

- [ ] Review RLS policies
      → Database → Policies
      → Ensure policies are restrictive enough

- [ ] Check API keys are not exposed
      → Search codebase for API keys
      → Verify `.env` is in `.gitignore`

- [ ] Review storage policies
      → Storage → Policies
      → Ensure proper access control

- [ ] Enable 2FA for Supabase account
      → Account Settings
      → Enable two-factor authentication

---

## Phase 12: Deploy to Production ✅

- [ ] Update production environment variables
      → Hosting platform settings
      → Set all VITE_SUPABASE_* variables

- [ ] Update Site URL for production
      → Authentication → URL Configuration
      → Add production domain

- [ ] Update Redirect URLs for production
      → Add all production URLs

- [ ] Test production deployment
      → Verify all features work
      → Test from different devices

- [ ] Monitor for errors
      → Check logs regularly
      → Set up error tracking

---

## 🎉 Final Verification

- [ ] All tables created successfully
- [ ] RLS policies working
- [ ] Authentication working
- [ ] Storage working
- [ ] Admin user created and working
- [ ] Email service working
- [ ] All features tested
- [ ] Security reviewed
- [ ] Documentation updated
- [ ] Team members onboarded

---

## 📝 Notes & Issues

________________________________________________________________________________________________

________________________________________________________________________________________________

________________________________________________________________________________________________

________________________________________________________________________________________________

---

## 🆘 Support Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm
- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Migration Guide**: `SUPABASE_MIGRATION_GUIDE.md`

---

**Setup Completed:** ☐ Yes  ☐ No  ☐ Partially

**Completed By:** ______________________

**Date:** ______________________

**Sign-off:** ______________________

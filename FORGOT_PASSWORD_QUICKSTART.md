# 🔐 Forgot Password - Quick Setup Guide

## ✅ What's Already Done (Code Implementation)
- ✅ "Forgot password?" link added to login page
- ✅ Password reset email dialog created
- ✅ `/reset-password` page created
- ✅ Routes configured in App.tsx
- ✅ Supabase integration implemented

## 🚀 What YOU Need to Do (Lovable/Supabase Config)

### STEP 1: Push Your Code
```powershell
git add .
git commit -m "Add forgot password functionality"
git push
```
Lovable will auto-deploy your changes.

### STEP 2: Configure Supabase URLs

**Access Supabase:**
- Option A: Via Lovable Dashboard → Settings → Integrations → Supabase
- Option B: Direct: https://supabase.com/dashboard/project/gmpalqcradshxxvntwlm

**Set These URLs:**
1. Go to: **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://your-lovable-preview.lovable.app` (get from Lovable)
3. Add **Redirect URLs**:
   - `https://your-lovable-preview.lovable.app/reset-password`
   - `http://localhost:8080/reset-password`

### STEP 3: Test It!

**Local Test:**
```powershell
npm run dev
```
- Go to: http://localhost:8080/auth
- Click "Forgot your password?"
- Enter your email
- Check inbox (and spam!)
- Click link → reset password

**Preview Test:**
- After push, test on your Lovable preview URL

## 📧 For Production (Later)

### Set Up Custom Email (Recommended)
1. Sign up for SendGrid (free tier: 100 emails/day)
2. In Supabase: **Project Settings** → **Auth** → **SMTP Settings**
3. Configure:
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: Your SendGrid API key
   - Sender: `noreply@yourdomain.com`

### Other Email Options:
- **Mailgun**: 1,000 emails/month free
- **Resend**: Modern, developer-friendly
- **Amazon SES**: Very cheap for high volume

## 🐛 Troubleshooting

### Email not received?
- ✅ Check spam folder
- ✅ Verify email exists in Supabase (Auth → Users)
- ✅ Check Supabase logs: Auth → Logs
- ✅ Verify URLs are configured correctly

### "Invalid link" error?
- ✅ Links expire after 1 hour
- ✅ Each link can only be used once
- ✅ Request a new reset link

## 📝 Summary

**Minimum to work:**
1. Push code ✅
2. Set Supabase Site URL ⚠️ (YOU DO THIS)
3. Add Redirect URLs ⚠️ (YOU DO THIS)
4. Test ✅

**For production:**
- Configure custom SMTP
- Customize email template
- Add custom domain

Done! 🎉

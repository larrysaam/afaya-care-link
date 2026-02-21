# Forgot Password Setup Checklist

## Frontend Implementation ✅ (Already Done)
- [x] Added forgot password link to Auth.tsx
- [x] Created password reset dialog
- [x] Created ResetPassword.tsx page
- [x] Added /reset-password route to App.tsx
- [x] Implemented Supabase password reset API calls

## Your Configuration Tasks (TODO)

### Development Setup
- [ ] Push code to Git/Lovable
      ```powershell
      git add .
      git commit -m "Add forgot password functionality"
      git push
      ```

- [ ] Get your Lovable preview URL
      - Go to Lovable Dashboard
      - Find your app's preview URL (e.g., `https://afayaconekt.lovable.app`)
      - Write it here: _________________________

- [ ] Configure Supabase Site URL
      - Go to: https://supabase.com/dashboard/project/gmpalqcradshxxvntwlm
      - Navigate to: **Authentication** → **URL Configuration**
      - Set **Site URL** to your Lovable preview URL
      - Click Save

- [ ] Add Redirect URLs in Supabase
      - Same location: **Authentication** → **URL Configuration**
      - Click "Add redirect URL"
      - Add: `https://[your-lovable-url]/reset-password`
      - Add: `http://localhost:8080/reset-password`
      - Click Save

- [ ] Test locally
      ```powershell
      npm run dev
      ```
      - Go to http://localhost:8080/auth
      - Click "Forgot your password?"
      - Enter test email
      - Check email inbox
      - Complete password reset

- [ ] Test on Lovable preview
      - Visit your Lovable preview URL
      - Repeat test steps above

### Production Setup (Do Later)
- [ ] Choose email provider (SendGrid recommended)
      - [ ] Sign up for free account
      - [ ] Generate API key
      - [ ] Verify sender email

- [ ] Configure SMTP in Supabase
      - Go to: **Project Settings** → **Auth** → **SMTP Settings**
      - Enable Custom SMTP
      - Enter provider details:
        * Host: _________________________
        * Port: _________________________
        * Username: _________________________
        * Password: _________________________
        * Sender Email: _________________________
        * Sender Name: AfayaConekt

- [ ] Customize email template (optional)
      - Go to: **Authentication** → **Email Templates**
      - Select "Reset Password"
      - Add branding/logo
      - Update text/styling

- [ ] Add custom domain redirect URLs
      - [ ] Get custom domain
      - [ ] Add to Supabase redirect URLs
      - [ ] Test with custom domain

### Verification
- [ ] Password reset works locally
- [ ] Password reset works on Lovable preview
- [ ] Emails arrive within 1-2 minutes
- [ ] Reset links work correctly
- [ ] Can login with new password
- [ ] Error handling works (wrong email, expired link, etc.)

## Notes / Issues
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________

## Completed On
- Development: _______________
- Production: _______________

# Forgot Password Implementation - Lovable Cloud Configuration Guide

## Overview
The forgot password functionality has been implemented in the Auth page. Users can now request a password reset link, which will be sent to their email.

## What Has Been Implemented

### 1. Frontend Changes
- Added "Forgot your password?" link on the login form
- Created a dialog modal for password reset email input
- Created a new `/reset-password` page for setting the new password
- Added route in App.tsx for the reset password page

### 2. Features
- User clicks "Forgot your password?" on login page
- User enters their email in a dialog
- System sends password reset email via Supabase
- User receives email with a link to reset their password
- Link redirects to `/reset-password` page
- User enters and confirms new password
- Password is updated in Supabase
- User is redirected to login page

## Required Lovable Cloud Configuration

Since this project is built on Lovable, you need to configure the authentication settings through the Lovable platform, which manages your Supabase backend.

### Step 1: Access Lovable Dashboard
1. Go to [Lovable.dev](https://lovable.dev)
2. Open your **AfayaConekt** project
3. Navigate to the **Supabase** integration section

### Step 2: Configure Site URL in Lovable
1. In Lovable Dashboard, go to **Settings** → **Integrations** → **Supabase**
2. Click on **Supabase Settings** or **Configure**
3. Set the **Site URL** to your deployed application URL:
   - For Lovable preview: Use the Lovable-provided preview URL (e.g., `https://your-project.lovable.app`)
   - For custom domain: Use your custom domain URL
4. **Important**: Lovable automatically handles localhost configuration for development

### Step 3: Add Redirect URLs
1. In the same Supabase settings in Lovable, find **Redirect URLs** section
2. Add the following URLs:
   - `https://your-project.lovable.app/reset-password` (replace with your actual Lovable URL)
   - `http://localhost:8080/reset-password` (for local development)
   - Any custom domain URLs: `https://yourdomain.com/reset-password`

### Step 4: Deploy Changes via Lovable
1. After making configuration changes in Lovable, click **Save** or **Apply**
2. Lovable will automatically sync these settings to your Supabase instance
3. No need to manually access Supabase dashboard - Lovable manages it for you!

### Step 4: Deploy Changes via Lovable
1. After making configuration changes in Lovable, click **Save** or **Apply**
2. Lovable will automatically sync these settings to your Supabase instance
3. No need to manually access Supabase dashboard - Lovable manages it for you!

### Step 5: Configure Email Settings (via Lovable or Supabase)

**Option A: Via Lovable (Recommended)**
1. In Lovable Dashboard, check if there's an **Email Settings** section under Supabase integration
2. If available, configure email provider settings there
3. Lovable will sync these to Supabase automatically

**Option B: Direct Supabase Access (If needed)**
If Lovable doesn't expose email settings, you can access Supabase directly:

1. From Lovable Dashboard, find the **View in Supabase** or **Supabase Console** link
2. Or go directly to: https://supabase.com/dashboard/project/gmpalqcradshxxvntwlm
3. Navigate to **Authentication** → **Email Templates**
4. Select **Reset Password** template
5. The default template should work fine:

```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

### Step 6: SMTP Configuration (For Production)

**Important for Production:** Supabase's default email service has rate limits. For production use:

**Via Lovable:**
1. Check if Lovable has SMTP configuration in Settings
2. Configure your email provider (SendGrid, Mailgun, etc.)

**Via Supabase Console (Alternative):**
1. Go to Supabase Console → **Project Settings** → **Auth** → **SMTP Settings**
2. Enable **Custom SMTP**
3. Configure your SMTP provider:
   - **Host**: Your SMTP server (e.g., `smtp.sendgrid.net`)
   - **Port**: Usually `587` for TLS
   - **Username**: Your SMTP username
   - **Password**: Your SMTP password
   - **Sender email**: `noreply@afayaconekt.com` (or your domain)
   - **Sender name**: `AfayaConekt`

**Recommended Email Providers:**
- **SendGrid**: Free tier (100 emails/day), reliable
- **Mailgun**: Free tier (1,000 emails/month)
- **Resend**: Modern, developer-friendly
- **Amazon SES**: Very cost-effective for high volume

### Step 7: Testing the Functionality

1. **Push Code to Lovable:**
   - Commit your changes: 
     ```powershell
     git add .
     git commit -m "Add forgot password functionality"
     git push
     ```
   - Lovable will automatically deploy your changes

2. **Local Testing:**
   ```powershell
   npm run dev
   ```

3. **Test Steps:**
   - Navigate to `http://localhost:8080/auth`
   - Click "Forgot your password?"
   - Enter a registered email address
   - Check your email inbox (and spam folder)
   - Click the reset link in the email
   - You should be redirected to `/reset-password`
   - Enter and confirm your new password
   - Submit and verify you can login with the new password

4. **Test on Lovable Preview:**
   - After pushing to Lovable, test on your preview URL
   - The flow should work the same way

### Step 8: Verify Configuration

**Check these settings in Supabase Console:**
1. Go to: https://supabase.com/dashboard/project/gmpalqcradshxxvntwlm
2. Navigate to **Authentication** → **URL Configuration**
3. Verify:
   - ✅ Site URL is set correctly
   - ✅ Redirect URLs include `/reset-password` paths
   - ✅ Email auth is enabled

**Check Email Logs:**
1. In Supabase Console, go to **Authentication** → **Logs**
2. After testing, check if emails were sent successfully
3. Look for any error messages

### Step 9: Security Best Practices

1. **Rate Limiting**: Supabase automatically rate limits password reset requests
2. **Token Expiry**: Reset tokens expire after 1 hour by default
3. **One-time Use**: Each reset token can only be used once

### Step 10: Environment Variables (Already Configured)

Your `.env` file already has the required Supabase credentials:
```
VITE_SUPABASE_URL="https://gmpalqcradshxxvntwlm.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-key-here"
```

No additional environment variables are needed for password reset.

## Troubleshooting

### Issue: Email not received
**Solutions:**
1. Check spam/junk folder
2. Verify the email address exists in Supabase auth.users table
3. Check Supabase logs: **Authentication** → **Logs**
4. Ensure Site URL and Redirect URLs are correctly configured
5. Check if you've hit rate limits (wait 60 seconds and try again)

### Issue: Invalid or expired link
**Solutions:**
1. Request a new password reset link (tokens expire after 1 hour)
2. Ensure the redirect URL matches exactly with what's configured in Supabase
3. Clear browser cache and cookies

### Issue: "Failed to send reset email"
**Solutions:**
1. Verify Supabase SMTP configuration
2. Check Supabase dashboard for any auth errors
3. Ensure the email provider is not blocking emails

## Additional Customization

### Customize Email Template
You can fully customize the password reset email in Supabase Dashboard:
- Add your logo/branding
- Change colors and styling
- Modify the message text
- Add support links or contact information

### Change Token Expiry Time
This can be configured in Supabase Dashboard under:
**Authentication** → **Email** → **Reset Password** → Token expiry (default: 3600 seconds / 1 hour)

## Summary - Quick Checklist for Lovable Projects

The forgot password feature is now fully implemented on the frontend. Here's what you need to do:

### ✅ Immediate Actions (Required):
1. **Push your code to Lovable/Git**
   ```powershell
   git add .
   git commit -m "Implement forgot password functionality"
   git push
   ```

2. **Configure in Supabase Console** (accessible via Lovable or direct link):
   - Set Site URL: Your Lovable preview URL (e.g., `https://afayaconekt.lovable.app`)
   - Add Redirect URLs:
     - `https://afayaconekt.lovable.app/reset-password`
     - `http://localhost:8080/reset-password`
   - Verify email auth is enabled

3. **Test the flow**:
   - Locally: `npm run dev`
   - On Lovable preview after deployment

### ⚠️ For Production (Recommended):
1. **Set up custom SMTP** (SendGrid, Mailgun, or Resend)
2. **Customize email template** with your branding
3. **Add your custom domain** to redirect URLs

### 📋 Where to Configure:

**Via Lovable Platform:**
- Settings → Integrations → Supabase
- (Lovable may expose some auth settings directly)

**Via Supabase Console:**
- https://supabase.com/dashboard/project/gmpalqcradshxxvntwlm
- Authentication → URL Configuration
- Authentication → Email Templates
- Project Settings → Auth → SMTP Settings (for custom email)

The implementation follows Supabase and Lovable best practices and security standards.

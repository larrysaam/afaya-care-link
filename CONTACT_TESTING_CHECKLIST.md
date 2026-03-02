# ✅ Contact Information Update - Testing Checklist

## Before Going Live - Verify These Changes

### 📱 Phone Numbers Display

#### Home Page - CTA Section:
- [ ] Visit home page and scroll to "Ready to Start Your Medical Journey?" section
- [ ] Verify you see **two phone numbers**:
  - ✅ +237 670 758 611
  - ✅ +91 70079 79670
- [ ] Click/tap each phone number (should open phone dialer on mobile)
- [ ] Both numbers should have phone icons

#### Footer (All Pages):
- [ ] Scroll to footer on any page
- [ ] Verify contact section in footer shows:
  ```
  📧 contact@afayaconekt.care
  📱 +237 670 758 611 (Cameroon)
     +91 70079 79670 (India)
  ```
- [ ] Click email (should open mail client)
- [ ] Click each phone number (should open phone dialer)
- [ ] Verify hover effects work (text should change color on hover)

---

### 📧 Email Display

#### Home Page - CTA Section:
- [ ] "Contact Our Team" button should link to: `mailto:contact@afayaconekt.care`
- [ ] Bottom contact info should show: `contact@afayaconekt.care`
- [ ] Email should have mail icon
- [ ] Click email link (should open mail client)

#### Footer:
- [ ] Email displayed: `contact@afayaconekt.care`
- [ ] Click email (should open mail client with correct address)

---

### 📝 Form Placeholders

#### Signup Form (Auth Page):
- [ ] Go to /auth
- [ ] Click "Sign Up" tab
- [ ] Phone field placeholder should show: `+237 670 758 611`

#### Profile Page:
- [ ] Login to the application
- [ ] Go to Profile page
- [ ] Phone field placeholder should show: `+237 670 758 611`

#### Admin Hospital Form:
- [ ] Login as admin
- [ ] Go to Admin Dashboard
- [ ] Click "Add Hospital"
- [ ] Phone field placeholder should show: `+91 70079 79670`

---

### 📨 Email Notifications

#### Consultation Notification Email:
- [ ] Book a test consultation
- [ ] Check email received
- [ ] Verify email sender shows: "AfayaConekt"
- [ ] Check email footer includes:
  - Contact: contact@afayaconekt.care
  - Phone: +237 670 758 611 (Cameroon) | +91 70079 79670 (India)
- [ ] Verify email branding says "AfayaConekt" (not "Afaya Care Link")
- [ ] Verify copyright says "© 2025 AfayaConekt"

---

### 🎨 Visual Quality Check

#### Responsive Design:
- [ ] Check CTA section on mobile (both phone numbers should display nicely)
- [ ] Check footer on mobile (contact info should stack properly)
- [ ] Check on tablet view
- [ ] Check on desktop view

#### Styling:
- [ ] All phone numbers are consistently formatted
- [ ] All links have hover effects
- [ ] Icons display correctly next to contact info
- [ ] Text is readable and properly spaced

---

### 🔗 Link Functionality

#### Tel Links (Phone Numbers):
On Mobile:
- [ ] Tap Cameroon number → should open dialer with +237670758611
- [ ] Tap India number → should open dialer with +917007979670

On Desktop:
- [ ] Click numbers → should offer to open phone app or Skype/similar

#### Mailto Links (Email):
- [ ] Click email in CTA section → opens mail client
- [ ] Click email in footer → opens mail client
- [ ] Click "Contact Our Team" button → opens mail client
- [ ] All should pre-fill "To:" with contact@afayaconekt.care

---

### 🚀 Quick Test Commands

#### Start Dev Server:
```bash
npm run dev
```

#### View Pages:
- Home: http://localhost:5173/
- Auth: http://localhost:5173/auth
- Profile: http://localhost:5173/profile (after login)
- Admin: http://localhost:5173/admin (admin login required)

---

### 📋 Summary of Changes

**Old Contact Info:**
- Email: care@afayaconekt.com
- Phone: +91 123 456 7890 (only 1 number)

**New Contact Info:**
- Email: contact@afayaconekt.care
- Phone 1: +237 670 758 611 (Cameroon)
- Phone 2: +91 70079 79670 (India)

**Files Modified:** 6 files
**Components Updated:** CTA Section, Footer, Auth Page, Profile Page, Hospital Form, Email Notifications

---

### ✅ Sign-Off

Once all items above are checked, the contact information update is complete and ready for production!

**Tested By:** _________________
**Date:** _________________
**Status:** [ ] PASS  [ ] NEEDS REVISION

---

### 📞 Emergency Rollback

If you need to revert these changes, the old values were:
- Old email: care@afayaconekt.com
- Old phone: +91 123 456 7890

Use Git to revert:
```bash
git log --oneline  # Find commit hash before contact update
git revert <commit-hash>
```

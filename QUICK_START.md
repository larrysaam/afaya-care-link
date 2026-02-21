# 🚀 Quick Start - New Supabase Project Setup

## Project Info
- **New Project ID**: `yfzpcyppnobbqbpsedtm`
- **Project URL**: `https://yfzpcyppnobbqbpsedtm.supabase.co`
- **Dashboard**: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm

---

## ⚡ 5-Minute Setup

### 1. Get Your API Key (2 min)
```
1. Go to: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/settings/api
2. Copy the "anon public" key
```

### 2. Update .env File (1 min)
```env
VITE_SUPABASE_PROJECT_ID="yfzpcyppnobbqbpsedtm"
VITE_SUPABASE_URL="https://yfzpcyppnobbqbpsedtm.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-copied-key-here"
```

### 3. Run Setup Script (2 min)
```powershell
# Option A: Automated setup
.\setup-supabase.ps1

# Option B: Manual setup
supabase login
supabase link --project-ref yfzpcyppnobbqbpsedtm
supabase db push
```

### 4. Start Your App
```powershell
npm run dev
```

**Done!** 🎉

---

## 📋 Essential Post-Setup

### Configure Auth (2 min)
Dashboard → **Authentication** → **URL Configuration**
- Site URL: `http://localhost:8080`
- Redirect URLs: `http://localhost:8080/**`

### Create Storage Bucket (1 min)
Dashboard → **Storage** → New Bucket
- Name: `hospital-images`
- Public: ✅ ON

### Create Admin User (2 min)
```sql
-- In SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## 🧪 Test Your Setup

```powershell
npm run dev
```

Visit: http://localhost:8080

✅ Sign up
✅ Login
✅ View hospitals
✅ Request consultation
✅ Login as admin → http://localhost:8080/admin

---

## 📚 Full Documentation

- **Complete Guide**: `SUPABASE_MIGRATION_GUIDE.md`
- **Detailed Checklist**: `SUPABASE_SETUP_CHECKLIST.md`
- **Forgot Password Setup**: `FORGOT_PASSWORD_SETUP.md`

---

## 🆘 Quick Troubleshooting

**Can't connect?**
→ Check `.env` file has correct keys
→ Restart dev server: `npm run dev`

**No tables?**
→ Run: `supabase db push`

**Not an admin?**
→ Run `create-admin.sql` in SQL Editor

**Images not uploading?**
→ Create `hospital-images` bucket in Storage

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| Dashboard | https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm |
| SQL Editor | https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/sql/new |
| API Settings | https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/settings/api |
| Storage | https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/storage/buckets |
| Auth | https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/auth/users |

---

**Need more help?** See `SUPABASE_MIGRATION_GUIDE.md`

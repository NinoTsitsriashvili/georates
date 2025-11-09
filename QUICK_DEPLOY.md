# ⚡ Quick Deploy Guide

**Fastest way to get GeoRates live in 15 minutes!**

## 🎯 Prerequisites

- GitHub account
- Email address (for Supabase & Vercel)

## 🚀 5-Step Deployment

### 1️⃣ Push to GitHub (2 min)

```bash
cd "/Users/ninotsriashvili/untitled folder/georates"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/georates.git
git push -u origin main
```

### 2️⃣ Create Supabase Database (5 min)

1. Go to [supabase.com](https://supabase.com) → Sign up
2. **New Project** → Name: `georates` → Create
3. Wait 2 min, then go to **Settings** → **API**
4. Copy: `Project URL`, `anon key`, `service_role key`
5. Go to **SQL Editor** → Paste contents of `database/schema.sql` → Run

### 3️⃣ Deploy to Vercel (3 min)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New Project** → Import `georates` repo
3. Click **Deploy** (wait 2 min)
4. Go to **Settings** → **Environment Variables** → Add:
   - `SUPABASE_URL` = (from Supabase)
   - `SUPABASE_ANON_KEY` = (from Supabase)
   - `SUPABASE_SERVICE_ROLE_KEY` = (from Supabase)
   - `ADMIN_SECRET` = (choose a password)
   - `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app`
5. **Deployments** → **Redeploy**

### 4️⃣ Set Up Auto-Refresh (3 min)

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_SECRET`
3. **Actions** tab → **Run workflow** → Test it!

### 5️⃣ Add Initial Data (2 min)

1. Visit: `https://your-app.vercel.app/admin`
2. Enter your `ADMIN_SECRET` password
3. Click **"Refresh Data"**
4. Done! 🎉

## ✅ Verify

- [ ] Site loads: `https://your-app.vercel.app`
- [ ] Admin works: `/admin`
- [ ] Data shows on homepage
- [ ] GitHub Actions runs successfully

## 📚 Full Guide

For detailed instructions, see [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md)

---

**That's it! Your app is live! 🚀**


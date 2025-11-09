# 🚀 Free Deployment Guide - GeoRates

Complete step-by-step guide to deploy GeoRates **100% FREE** with all services included.

## 📋 What We'll Deploy

- ✅ **Frontend**: Next.js app on Vercel (FREE)
- ✅ **Database**: PostgreSQL on Supabase (FREE - 500MB)
- ✅ **Cron Jobs**: GitHub Actions (FREE - 2000 min/month)
- ✅ **All features working**: No interruptions, good limits

## 🎯 Free Tier Limits (More Than Enough!)

| Service | Free Tier | Our Usage |
|---------|-----------|-----------|
| **Vercel** | Unlimited deployments, 100GB bandwidth | ~1GB/month |
| **Supabase** | 500MB database, 2GB bandwidth | ~50MB/month |
| **GitHub Actions** | 2000 minutes/month | ~30 min/month |

## 📝 Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"**
3. Name it: `georates` (or any name you prefer)
4. Make it **Public** (required for free GitHub Actions)
5. Click **"Create repository"**
6. **Don't initialize** with README (we already have files)

7. In your terminal, run:
```bash
cd "/Users/ninotsriashvili/untitled folder/georates"
git init
git add .
git commit -m "Initial commit - GeoRates app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/georates.git
git push -u origin main
```
*(Replace `YOUR_USERNAME` with your GitHub username)*

### Step 2: Set Up Supabase Database (FREE)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Click **"Start your project"**
   - Sign up with GitHub (easiest) or email
   - Verify your email if needed

2. **Create New Project**
   - Click **"New Project"**
   - Organization: Create new or use default
   - Project Name: `georates` (or any name)
   - Database Password: **Save this password!** (you'll need it)
   - Region: Choose closest to Georgia (e.g., `Europe West`)
   - Click **"Create new project"**
   - Wait 2-3 minutes for setup

3. **Get API Keys**
   - Once project is ready, go to **Settings** → **API**
   - Copy these values:
     - **Project URL** → This is your `SUPABASE_URL`
     - **anon public** key → This is your `SUPABASE_ANON_KEY`
     - **service_role secret** key → This is your `SUPABASE_SERVICE_ROLE_KEY`
   - **Save these in a text file** - you'll need them!

4. **Create Database Tables**
   - In Supabase dashboard, go to **SQL Editor**
   - Click **"New query"**
   - Open `database/schema.sql` from this project
   - Copy **ALL** the SQL code
   - Paste into SQL Editor
   - Click **"Run"** (or press Ctrl+Enter)
   - You should see: "Success. No rows returned"
   - Verify tables: Go to **Table Editor** - you should see 4 tables:
     - `exchange_rates`
     - `petrol_prices`
     - `electricity_tariffs`
     - `refresh_logs`

### Step 3: Deploy to Vercel (FREE)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Sign Up"**
   - Sign up with GitHub (recommended - easiest)
   - Authorize Vercel to access your GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Find your `georates` repository
   - Click **"Import"**

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
   - **Click "Deploy"** (we'll add env vars after)

4. **Add Environment Variables**
   - After first deployment, go to **Settings** → **Environment Variables**
   - Add each variable (click "Add" for each):

   ```
   Name: SUPABASE_URL
   Value: (paste your Supabase Project URL)
   Environment: Production, Preview, Development (check all)
   ```

   ```
   Name: SUPABASE_ANON_KEY
   Value: (paste your Supabase anon key)
   Environment: Production, Preview, Development (check all)
   ```

   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: (paste your Supabase service_role key)
   Environment: Production, Preview, Development (check all)
   ```

   ```
   Name: ADMIN_SECRET
   Value: (create a strong password, e.g., "MySecurePass123!")
   Environment: Production, Preview, Development (check all)
   ```

   ```
   Name: NEXT_PUBLIC_APP_URL
   Value: https://your-app-name.vercel.app
   (Replace with your actual Vercel URL - you'll see it after first deploy)
   Environment: Production, Preview, Development (check all)
   ```

5. **Redeploy**
   - Go to **Deployments** tab
   - Click the **"..."** menu on latest deployment
   - Click **"Redeploy"**
   - Wait for build to complete

6. **Test Your Site**
   - Visit your Vercel URL: `https://your-app-name.vercel.app`
   - You should see the GeoRates homepage!
   - Try switching languages and dark mode

### Step 4: Set Up GitHub Actions for Cron Jobs (FREE)

1. **Add GitHub Secrets**
   - Go to your GitHub repository
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - Add these secrets one by one:

   ```
   Name: SUPABASE_URL
   Secret: (paste your Supabase URL)
   ```

   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Secret: (paste your service_role key)
   ```

   ```
   Name: ADMIN_SECRET
   Secret: (same password you used in Vercel)
   ```

2. **Enable GitHub Actions**
   - Go to **Actions** tab in your repository
   - The workflow file (`.github/workflows/cron-refresh.yml`) is already there
   - GitHub Actions should be enabled automatically
   - If you see a yellow banner, click **"I understand my workflows, go ahead and enable them"**

3. **Test the Workflow**
   - In **Actions** tab, you'll see "Daily Data Refresh" workflow
   - Click on it
   - Click **"Run workflow"** → **"Run workflow"** (green button)
   - Wait 1-2 minutes
   - Click on the running workflow to see logs
   - You should see: "✅ Data refresh completed successfully"

4. **Verify Data**
   - Go to your Supabase dashboard
   - Go to **Table Editor** → `exchange_rates`
   - You should see data rows!
   - Check `refresh_logs` table to see the refresh history

### Step 5: Set Up Vercel Cron (Alternative/Backup)

Vercel also supports cron jobs natively. The `vercel.json` is already configured.

1. **Verify Cron Configuration**
   - In Vercel dashboard, go to **Settings** → **Cron Jobs**
   - You should see: `/api/refresh` scheduled for `0 2 * * *` (daily at 2 AM UTC)
   - This is already configured in `vercel.json`

2. **Test Cron Endpoint**
   - Visit: `https://your-app.vercel.app/api/refresh`
   - You should get an error (expected - needs auth)
   - The cron will work automatically with Vercel's internal auth

### Step 6: Initial Data Population

1. **Via Admin Panel** (Easiest)
   - Visit: `https://your-app.vercel.app/admin`
   - Enter your `ADMIN_SECRET` password
   - Click **"Refresh Data"**
   - Wait 10-30 seconds
   - You should see success message

2. **Via GitHub Actions** (Manual)
   - Go to **Actions** tab
   - Click **"Daily Data Refresh"**
   - Click **"Run workflow"** → **"Run workflow"**

3. **Verify Data**
   - Visit your site: `https://your-app.vercel.app`
   - You should see real exchange rates, petrol prices, etc.
   - Check Supabase tables to confirm data is there

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Site loads at Vercel URL
- [ ] Can switch languages (KA, EN, RU)
- [ ] Dark/Light mode toggle works
- [ ] Admin panel accessible at `/admin`
- [ ] Can refresh data from admin panel
- [ ] Data appears on homepage
- [ ] Charts display (if you have historical data)
- [ ] GitHub Actions workflow runs successfully
- [ ] Supabase tables have data
- [ ] Refresh logs show in Supabase

## 🔧 Troubleshooting

### Site Shows "Error" or Blank Page

1. Check Vercel deployment logs:
   - Go to Vercel dashboard → **Deployments**
   - Click on latest deployment
   - Check **"Build Logs"** for errors
   - Common issues:
     - Missing environment variables
     - Build errors (check logs)

2. Check browser console:
   - Press F12 → Console tab
   - Look for errors

### Database Connection Issues

1. Verify Supabase credentials:
   - Check environment variables in Vercel
   - Make sure all 3 Supabase vars are set

2. Test Supabase connection:
   - Go to Supabase dashboard
   - Check if tables exist
   - Try running a simple query in SQL Editor

### Cron Jobs Not Running

1. **GitHub Actions:**
   - Check **Actions** tab for errors
   - Verify secrets are set correctly
   - Check workflow file exists: `.github/workflows/cron-refresh.yml`

2. **Vercel Cron:**
   - Go to **Settings** → **Cron Jobs**
   - Verify cron is enabled
   - Check Vercel logs for cron execution

### No Data Showing

1. Run manual refresh:
   - Go to `/admin`
   - Click "Refresh Data"
   - Wait for completion

2. Check Supabase:
   - Go to Table Editor
   - Check if tables have data
   - If empty, refresh manually

3. Check API endpoints:
   - Visit: `https://your-app.vercel.app/api/exchange-rates`
   - Should return JSON data

## 📊 Monitoring

### Check Data Updates

1. **Via Admin Panel:**
   - Visit `/admin`
   - Check "Refresh Logs" section
   - See last update time

2. **Via Supabase:**
   - Go to `refresh_logs` table
   - See all refresh history

3. **Via GitHub Actions:**
   - Go to **Actions** tab
   - See workflow run history

## 🎉 You're Done!

Your app is now:
- ✅ Live on the internet
- ✅ Automatically updating data daily
- ✅ Using 100% free services
- ✅ Ready for users!

## 🚀 Next Steps (Optional)

1. **Custom Domain:**
   - In Vercel: **Settings** → **Domains**
   - Add your domain
   - Update DNS records

2. **Google AdSense:**
   - Apply at [adsense.google.com](https://adsense.google.com)
   - Once approved, add `NEXT_PUBLIC_ADSENSE_ID` to Vercel env vars

3. **Google Analytics:**
   - Create property at [analytics.google.com](https://analytics.google.com)
   - Add `NEXT_PUBLIC_GA_ID` to Vercel env vars

## 📞 Need Help?

If something doesn't work:
1. Check the error message
2. Review logs (Vercel, GitHub Actions, Supabase)
3. Verify all environment variables are set
4. Make sure database schema is applied

---

**Congratulations! Your GeoRates app is now live! 🎊**


# 🔗 Connecting Supabase to GeoRates - Step by Step

## ✅ Step 1: Get Your Supabase Credentials

1. **Go to your Supabase project dashboard**
   - Visit: https://supabase.com/dashboard
   - Click on your project (the one you just created)

2. **Navigate to Settings → API**
   - In the left sidebar, click **"Settings"** (gear icon)
   - Click **"API"** in the settings menu

3. **Copy these 3 values** (you'll need them):
   
   **a) Project URL:**
   - Look for **"Project URL"** or **"URL"**
   - It looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy this → This is your `SUPABASE_URL`
   
   **b) anon public key:**
   - Look for **"Project API keys"** section
   - Find **"anon"** `public` key
   - Click the eye icon to reveal it (or copy button)
   - Copy this → This is your `SUPABASE_ANON_KEY`
   
   **c) service_role secret key:**
   - In the same section, find **"service_role"** `secret` key
   - ⚠️ **WARNING**: This is a secret key - keep it safe!
   - Click the eye icon to reveal it
   - Copy this → This is your `SUPABASE_SERVICE_ROLE_KEY`

4. **Save these in a text file temporarily:**
   ```
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## ✅ Step 2: Set Up Database Tables

1. **Go to SQL Editor**
   - In the left sidebar, click **"SQL Editor"**
   - Click **"New query"** button (top right)

2. **Open the schema file**
   - In your project, open: `database/schema.sql`
   - Select **ALL** the content (Cmd+A / Ctrl+A)
   - Copy it (Cmd+C / Ctrl+C)

3. **Paste into Supabase SQL Editor**
   - Go back to Supabase SQL Editor
   - Paste the SQL code (Cmd+V / Ctrl+V)
   - You should see the complete schema with:
     - `CREATE TABLE IF NOT EXISTS exchange_rates`
     - `CREATE TABLE IF NOT EXISTS petrol_prices`
     - `CREATE TABLE IF NOT EXISTS electricity_tariffs`
     - `CREATE TABLE IF NOT EXISTS refresh_logs`
     - Plus indexes and functions

4. **Run the SQL**
   - Click **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
   - Wait a few seconds
   - You should see: **"Success. No rows returned"** ✅

5. **Verify Tables Were Created**
   - In the left sidebar, click **"Table Editor"**
   - You should see 4 tables:
     - ✅ `exchange_rates`
     - ✅ `petrol_prices`
     - ✅ `electricity_tariffs`
     - ✅ `refresh_logs`

---

## ✅ Step 3: Configure Environment Variables in Vercel

**First, make sure you've deployed to Vercel. If not:**
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your `georates` repository
4. Click **"Deploy"** (we'll add env vars after)

**Now add environment variables:**

1. **Go to Vercel Project Settings**
   - In your Vercel dashboard, click on your `georates` project
   - Click **"Settings"** tab (top menu)
   - Click **"Environment Variables"** in the left sidebar

2. **Add Each Variable** (click "Add" for each one):

   **Variable 1:**
   - **Name:** `SUPABASE_URL`
   - **Value:** (paste your Supabase Project URL)
   - **Environment:** Check all three: Production, Preview, Development ✅
   - Click **"Save"**

   **Variable 2:**
   - **Name:** `SUPABASE_ANON_KEY`
   - **Value:** (paste your anon public key)
   - **Environment:** Check all three: Production, Preview, Development ✅
   - Click **"Save"**

   **Variable 3:**
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** (paste your service_role secret key)
   - **Environment:** Check all three: Production, Preview, Development ✅
   - Click **"Save"**

   **Variable 4:**
   - **Name:** `ADMIN_SECRET`
   - **Value:** (create a strong password, e.g., `MySecureGeoRates2024!`)
   - **Environment:** Check all three: Production, Preview, Development ✅
   - Click **"Save"**

   **Variable 5:**
   - **Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://your-app-name.vercel.app` (replace with your actual Vercel URL)
   - **Environment:** Check all three: Production, Preview, Development ✅
   - Click **"Save"**

3. **Redeploy Your Application**
   - Go to **"Deployments"** tab
   - Click the **"..."** menu (three dots) on the latest deployment
   - Click **"Redeploy"**
   - Wait for the build to complete (2-3 minutes)

---

## ✅ Step 4: Test the Connection

1. **Visit Your Deployed Site**
   - Go to your Vercel URL: `https://your-app-name.vercel.app`
   - The site should load (might show empty data initially - that's OK)

2. **Test Admin Panel**
   - Visit: `https://your-app-name.vercel.app/admin`
   - Enter your `ADMIN_SECRET` password
   - Click **"Refresh Data"**
   - Wait 10-30 seconds
   - You should see a success message

3. **Verify Data in Supabase**
   - Go back to Supabase dashboard
   - Click **"Table Editor"** → `exchange_rates`
   - You should see data rows! ✅
   - Check `refresh_logs` table to see the refresh history

4. **Check API Endpoints**
   - Visit: `https://your-app-name.vercel.app/api/exchange-rates`
   - You should see JSON data with exchange rates
   - Visit: `https://your-app-name.vercel.app/api/petrol-prices`
   - You should see petrol prices data

---

## ✅ Step 5: Set Up GitHub Actions (For Automated Data Refresh)

1. **Go to Your GitHub Repository**
   - Visit: https://github.com/NinoTsitsriashvili/georates
   - Click **"Settings"** tab (top menu)
   - Click **"Secrets and variables"** → **"Actions"** (left sidebar)

2. **Add Repository Secrets** (click "New repository secret" for each):

   **Secret 1:**
   - **Name:** `SUPABASE_URL`
   - **Secret:** (paste your Supabase Project URL)
   - Click **"Add secret"**

   **Secret 2:**
   - **Name:** `SUPABASE_ANON_KEY`
   - **Secret:** (paste your anon public key)
   - Click **"Add secret"**

   **Secret 3:**
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Secret:** (paste your service_role secret key)
   - Click **"Add secret"**

   **Secret 4:**
   - **Name:** `ADMIN_SECRET`
   - **Secret:** (same password you used in Vercel)
   - Click **"Add secret"**

3. **Test GitHub Actions**
   - Go to **"Actions"** tab in your GitHub repository
   - You should see "Daily Data Refresh" workflow
   - Click on it
   - Click **"Run workflow"** → **"Run workflow"** (green button)
   - Wait 1-2 minutes
   - Click on the running workflow to see logs
   - You should see: **"✅ Data refresh completed successfully"**

---

## ✅ Step 6: Verify Everything Works

Check these:

- [ ] Site loads at Vercel URL
- [ ] Admin panel accessible at `/admin`
- [ ] Can refresh data from admin panel
- [ ] Data appears on homepage
- [ ] Supabase tables have data
- [ ] API endpoints return data
- [ ] GitHub Actions workflow runs successfully
- [ ] Refresh logs show in Supabase

---

## 🐛 Troubleshooting

### "Cannot connect to database" error
- ✅ Check all 3 Supabase environment variables are set in Vercel
- ✅ Verify the keys are correct (no extra spaces)
- ✅ Make sure you redeployed after adding env vars

### "Table does not exist" error
- ✅ Go to Supabase SQL Editor
- ✅ Run the schema SQL again
- ✅ Verify tables exist in Table Editor

### "Unauthorized" error in admin panel
- ✅ Check `ADMIN_SECRET` is set correctly in Vercel
- ✅ Use the exact password you set

### No data showing
- ✅ Run manual refresh from admin panel
- ✅ Check Supabase `refresh_logs` table for errors
- ✅ Verify API endpoints return data

### GitHub Actions failing
- ✅ Check all secrets are added correctly
- ✅ Verify secret names match exactly (case-sensitive)
- ✅ Check workflow logs for specific errors

---

## 🎉 Success!

Once all steps are complete:
- ✅ Your app is connected to Supabase
- ✅ Data is being stored in the database
- ✅ Automated refresh is set up
- ✅ Everything is working!

**Next:** Continue with the rest of the deployment guide to set up cron jobs and finalize everything.

---

## 📝 Quick Reference

**Supabase Dashboard:** https://supabase.com/dashboard  
**Vercel Dashboard:** https://vercel.com/dashboard  
**GitHub Repository:** https://github.com/NinoTsitsriashvili/georates

**Environment Variables Needed:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SECRET`
- `NEXT_PUBLIC_APP_URL`


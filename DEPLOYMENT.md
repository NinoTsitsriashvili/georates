# 🚀 Deployment Guide

This guide walks you through deploying GeoRates to production.

## Prerequisites

- GitHub account
- Supabase account (free tier)
- Vercel account (free tier)
- Google AdSense account (for monetization)
- Google Analytics account (optional)

## Step 1: Set Up Supabase Database

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Run Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `database/schema.sql`
   - Paste and run in SQL Editor
   - Verify tables are created

3. **Get API Keys**
   - Go to Settings > API
   - Copy:
     - Project URL → `SUPABASE_URL`
     - `anon` `public` key → `SUPABASE_ANON_KEY`
     - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Deploy to Vercel

### Option A: Deploy via GitHub

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables**
   In Vercel project settings, add:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_SECRET=your_secure_password
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx (optional)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (optional)
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live!

### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow prompts and add environment variables when asked.

## Step 3: Set Up Automated Data Refresh

### Option 1: Vercel Cron Jobs (Recommended)

Vercel supports cron jobs natively. The `vercel.json` is already configured.

1. **Enable Cron Jobs**
   - Go to Vercel project settings
   - Navigate to "Cron Jobs"
   - The cron job should be automatically detected from `vercel.json`

2. **Verify Schedule**
   - Check that cron is set to run daily at 2 AM UTC
   - Test manually if needed

### Option 2: GitHub Actions

1. **Add GitHub Secrets**
   Go to your repository → Settings → Secrets and variables → Actions
   
   Add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_SECRET`

2. **Enable Workflow**
   - The workflow file (`.github/workflows/cron-refresh.yml`) is already configured
   - GitHub Actions will automatically run daily at 2 AM UTC

3. **Test Workflow**
   - Go to Actions tab
   - Click "Run workflow" to test manually

### Option 3: Render/Railway Cron Service

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up/login

2. **Create Cron Job**
   - New → Cron Job
   - Connect your GitHub repository
   - Configure:
     - Name: `georates-cron`
     - Schedule: `0 2 * * *` (daily at 2 AM UTC)
     - Command: `node scripts/fetch-data.js`
     - Environment: Node
     - Build Command: `npm install`

3. **Add Environment Variables**
   ```
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ADMIN_SECRET=...
   ```

4. **Deploy**
   - Click "Create Cron Job"
   - Render will run the job on schedule

## Step 4: Set Up Google AdSense

1. **Sign Up**
   - Go to [adsense.google.com](https://adsense.google.com)
   - Sign up with your Google account
   - Add your website URL

2. **Get Approval**
   - Wait for Google to review your site (1-2 weeks)
   - Once approved, you'll get a publisher ID

3. **Add AdSense Code**
   - Get your publisher ID: `ca-pub-xxxxxxxxxxxxxxxx`
   - Add to Vercel environment variables: `NEXT_PUBLIC_ADSENSE_ID`
   - Redeploy your site
   - AdSense will automatically load

4. **Replace Placeholders**
   - The placeholder ad units will automatically become real ads
   - Monitor performance in AdSense dashboard

## Step 5: Set Up Google Analytics

1. **Create GA4 Property**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create a new property
   - Get your Measurement ID: `G-XXXXXXXXXX`

2. **Add to Site**
   - Add to Vercel environment: `NEXT_PUBLIC_GA_ID`
   - Redeploy
   - Analytics will start tracking

## Step 6: Initial Data Population

After deployment, populate initial data:

1. **Via Admin Panel**
   - Visit `https://your-domain.com/admin`
   - Login with your `ADMIN_SECRET`
   - Click "Refresh Data"

2. **Via API**
   ```bash
   curl -X POST https://your-domain.com/api/refresh \
     -H "Authorization: Bearer YOUR_ADMIN_SECRET"
   ```

3. **Via Script** (if using Render/Railway)
   - The cron job will run automatically
   - Or trigger manually from the service dashboard

## Step 7: Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to project settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Redeploy

## Step 8: Monitor and Maintain

### Check Data Updates

1. Visit admin panel regularly
2. Check refresh logs
3. Monitor cron job execution

### Troubleshooting

**Data not updating:**
- Check cron job logs
- Verify Supabase connection
- Test API endpoints manually

**Build failures:**
- Check environment variables
- Review build logs
- Ensure all dependencies are installed

**Database issues:**
- Verify Supabase credentials
- Check table permissions
- Review database logs

## Production Checklist

- [ ] Supabase database set up and schema applied
- [ ] Environment variables configured
- [ ] Site deployed to Vercel
- [ ] Cron job configured and tested
- [ ] Initial data populated
- [ ] Admin panel accessible
- [ ] Google AdSense configured (if applicable)
- [ ] Google Analytics configured (if applicable)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Site tested on mobile and desktop
- [ ] All languages working
- [ ] Dark mode working
- [ ] Charts displaying correctly

## Support

If you encounter issues:
1. Check the logs in Vercel dashboard
2. Review admin panel logs
3. Check Supabase logs
4. Open an issue on GitHub

---

**Happy Deploying! 🚀**


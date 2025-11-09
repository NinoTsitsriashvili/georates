# ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly.

## Pre-Deployment

- [ ] Code is committed to Git
- [ ] All files are in the repository
- [ ] `.env.example` exists (for reference)
- [ ] No sensitive data in code (use env vars)

## Step 1: GitHub Repository

- [ ] GitHub account created
- [ ] Repository created (public for free Actions)
- [ ] Code pushed to GitHub
- [ ] Repository is accessible

## Step 2: Supabase Database

- [ ] Supabase account created
- [ ] New project created
- [ ] Database password saved
- [ ] Project URL copied
- [ ] `SUPABASE_ANON_KEY` copied
- [ ] `SUPABASE_SERVICE_ROLE_KEY` copied
- [ ] SQL schema executed in SQL Editor
- [ ] Tables verified (4 tables exist):
  - [ ] `exchange_rates`
  - [ ] `petrol_prices`
  - [ ] `electricity_tariffs`
  - [ ] `refresh_logs`

## Step 3: Vercel Deployment

- [ ] Vercel account created (via GitHub)
- [ ] Project imported from GitHub
- [ ] Environment variables added:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `ADMIN_SECRET`
  - [ ] `NEXT_PUBLIC_APP_URL`
- [ ] First deployment successful
- [ ] Site accessible at Vercel URL
- [ ] Homepage loads correctly
- [ ] Language switching works
- [ ] Dark/Light mode works

## Step 4: GitHub Actions

- [ ] GitHub Secrets added:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `ADMIN_SECRET`
- [ ] Actions enabled in repository
- [ ] Workflow file exists (`.github/workflows/cron-refresh.yml`)
- [ ] Manual workflow run successful
- [ ] Workflow logs show success

## Step 5: Initial Data

- [ ] Admin panel accessible at `/admin`
- [ ] Can login with `ADMIN_SECRET`
- [ ] Manual data refresh successful
- [ ] Data appears on homepage
- [ ] Supabase tables have data
- [ ] Refresh logs show in Supabase

## Step 6: Verification

- [ ] Exchange rates display correctly
- [ ] Petrol prices display correctly
- [ ] Electricity tariffs display correctly
- [ ] Charts work (if historical data exists)
- [ ] All languages work (KA, EN, RU)
- [ ] Mobile responsive design works
- [ ] API endpoints return data:
  - [ ] `/api/exchange-rates`
  - [ ] `/api/petrol-prices`
  - [ ] `/api/electricity-tariffs`
  - [ ] `/api/last-update`

## Step 7: Automation

- [ ] GitHub Actions scheduled correctly (daily at 2 AM UTC)
- [ ] Vercel cron configured (backup)
- [ ] Data updates automatically
- [ ] Refresh logs show regular updates

## Optional: Enhancements

- [ ] Custom domain configured
- [ ] Google AdSense added (if approved)
- [ ] Google Analytics added
- [ ] SSL certificate active (automatic on Vercel)

## Troubleshooting Notes

If something fails, note it here:
- Issue: _______________________
- Solution: _______________________

---

**Deployment Date:** _______________
**Vercel URL:** https://________________.vercel.app
**Supabase Project:** ________________


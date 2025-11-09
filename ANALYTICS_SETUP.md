# 📊 Analytics System Setup Guide

Your free analytics system is now set up! It tracks page views, language preferences, and user behavior.

## ✅ What's Been Created

1. **Database Schema** - `database/analytics_schema.sql`
2. **Analytics Library** - `lib/analytics.ts`
3. **Tracking Component** - `components/Analytics.tsx`
4. **API Endpoints** - `/api/analytics/track` and `/api/analytics/stats`
5. **Admin Dashboard** - `/admin/analytics`

## 🚀 Setup Steps

### Step 1: Run the Analytics Schema in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard/project/klwuauzhgfnnllaihjhe/editor
2. Click **"SQL Editor"** → **"New query"**
3. Open `database/analytics_schema.sql` in your project
4. Copy **ALL** the SQL code
5. Paste into Supabase SQL Editor
6. Click **"Run"**
7. Verify: Go to **"Table Editor"** - you should see new tables:
   - `analytics_events`
   - `analytics_page_views`
   - `analytics_language_usage`
   - `analytics_daily_stats`

### Step 2: Verify Tracking is Working

1. Visit your deployed site
2. Navigate to a few pages
3. Change language
4. Go to Supabase → **"Table Editor"** → `analytics_events`
5. You should see events being logged!

### Step 3: View Analytics Dashboard

1. Visit: `https://your-app.vercel.app/admin/analytics`
2. Enter your admin password
3. View your analytics!

## 📊 What Gets Tracked

### Automatic Tracking:
- ✅ **Page Views** - Every page visit
- ✅ **Language** - Which language user is using
- ✅ **Session ID** - Unique visitor tracking
- ✅ **Screen Size** - Device information
- ✅ **Referrer** - Where users came from
- ✅ **User Agent** - Browser/device info

### Manual Tracking (Optional):
- Language changes
- Theme changes
- Custom events

## 📈 Analytics Dashboard Features

### Overview Tab:
- Total page views
- Unique visitors
- Unique pages
- Top language
- Language breakdown with percentages

### Pages Tab:
- Most visited pages
- Views per page
- Unique visitors per page
- Last viewed timestamp

### Languages Tab:
- Language usage statistics
- Percentage breakdown
- Unique sessions per language

### Daily Tab:
- Daily view counts
- Daily unique visitors
- Pages viewed per day

## 🔧 How It Works

1. **Automatic Tracking**: The `<Analytics />` component in `app/layout.tsx` automatically tracks all page views
2. **Session Management**: Each visitor gets a unique session ID stored in sessionStorage
3. **Data Storage**: All events are stored in Supabase `analytics_events` table
4. **Aggregation**: Database functions aggregate data for fast queries

## 🎯 API Endpoints

### Track Event:
```
POST /api/analytics/track
Body: {
  event_type: 'page_view' | 'language_change' | 'theme_change' | 'custom',
  page_path: '/',
  page_title: 'Home',
  language: 'ka',
  ...
}
```

### Get Statistics:
```
GET /api/analytics/stats?days=30&type=overview
GET /api/analytics/stats?days=30&type=page_views
GET /api/analytics/stats?days=30&type=language
GET /api/analytics/stats?days=30&type=daily
```

## 🔒 Privacy

- No personal information is collected
- Session IDs are anonymous
- No cookies used (uses sessionStorage)
- All data stored in your own Supabase database
- GDPR-friendly

## 📊 Database Functions

The schema includes helpful functions:
- `get_page_views(days)` - Get page view statistics
- `get_language_stats(days)` - Get language usage
- `get_daily_stats(days)` - Get daily statistics

## 🚀 Next Steps

1. ✅ Run the SQL schema in Supabase
2. ✅ Visit your site to generate some events
3. ✅ Check the analytics dashboard
4. ✅ Customize tracking if needed

## 💡 Tips

- **Data Retention**: Events are stored indefinitely (you can add cleanup if needed)
- **Performance**: Database functions make queries fast
- **Scaling**: Supabase free tier handles thousands of events per day
- **Export**: You can export data from Supabase if needed

---

**Your analytics system is ready! 🎉**


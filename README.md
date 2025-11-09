# 🌍 GeoRates — Automated Georgian Market Indicators Dashboard

A fully automated, responsive, multilingual web application that aggregates and displays up-to-date data for Georgian users, including GEL exchange rates, petrol/fuel prices, and electricity tariffs.

## ✨ Features

- **Automated Data Collection**: Fetches data from National Bank of Georgia API and major fuel companies
- **Real-time Updates**: Automatic refresh every 24 hours via cron jobs
- **Multilingual Support**: Georgian 🇬🇪, English 🇬🇧, and Russian 🇷🇺
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Interactive Charts**: 30-day trend visualization using Chart.js
- **Responsive Design**: Mobile-first design with TailwindCSS
- **SEO Optimized**: Meta tags, sitemap, and structured data
- **Admin Panel**: Protected admin interface for manual data refresh
- **Monetization Ready**: Google AdSense integration placeholders

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **Charts**: Chart.js + react-chartjs-2
- **Deployment**: Vercel (frontend) + GitHub Actions (cron jobs) + Supabase (database)

## 📋 Prerequisites

- Node.js 20+ and npm
- Supabase account (free tier works)
- Google AdSense account (for monetization)
- Google Analytics account (optional)

## 🚀 Deployment (FREE!)

**Want to deploy this app for FREE?** Check out our comprehensive deployment guides:

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Get live in 15 minutes! ⚡
- **[FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md)** - Complete step-by-step guide 📚
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Deployment checklist ✅

### Free Services Used:
- ✅ **Vercel** - Hosting (unlimited deployments)
- ✅ **Supabase** - Database (500MB free)
- ✅ **GitHub Actions** - Cron jobs (2000 min/month)

## 🚀 Local Development

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd georates
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Panel
ADMIN_SECRET=your_secure_admin_password_here

# Google AdSense (after approval)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL schema from `database/schema.sql`

Or use the Supabase CLI:

```bash
supabase db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Initial Data Population

Run the data fetch script to populate initial data:

```bash
npm run data:fetch
```

Or manually trigger via the admin panel at `/admin`.

## 📁 Project Structure

```
georates/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin panel
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx
│   ├── ExchangeRatesCard.tsx
│   ├── PetrolPricesCard.tsx
│   ├── ElectricityCard.tsx
│   ├── ThemeProvider.tsx
│   └── LanguageProvider.tsx
├── lib/                   # Utilities and helpers
│   ├── db.ts             # Database functions
│   ├── fetch-data.ts     # Data fetching logic
│   └── i18n.ts           # Internationalization
├── locales/              # Translation files
│   ├── ka.json           # Georgian
│   ├── en.json           # English
│   └── ru.json           # Russian
├── scripts/              # Utility scripts
│   ├── fetch-data.ts     # Data refresh script
│   └── cron-job.js       # Cron job scheduler
├── database/             # Database schema
│   └── schema.sql
└── public/              # Static assets
```

## 🔄 Automated Data Updates

### Option 1: GitHub Actions (Recommended)

The project includes a GitHub Actions workflow (`.github/workflows/cron-refresh.yml`) that runs daily at 2 AM UTC.

1. Add these secrets to your GitHub repository:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_SECRET`

2. The workflow will automatically run daily.

### Option 2: Vercel Cron Jobs

If deploying to Vercel, use the built-in cron feature:

1. Add cron configuration in `vercel.json`
2. Set up environment variables in Vercel dashboard
3. Vercel will automatically trigger `/api/refresh` daily

### Option 3: Render/Railway Cron

1. Deploy the cron job service using `render.yaml` or Railway
2. The cron service will run `scripts/cron-job.js` daily

### Option 4: Manual Trigger

Visit `/admin` and click "Refresh Data" (requires admin password).

## 🎨 Customization

### Adding New Languages

1. Create a new JSON file in `locales/` (e.g., `fr.json`)
2. Copy the structure from `en.json`
3. Translate all strings
4. Update `lib/i18n.ts` to include the new locale

### Modifying Data Sources

Edit `lib/fetch-data.ts` to:
- Update API endpoints
- Modify scraping selectors for petrol prices
- Adjust electricity tariff values

### Styling

The project uses TailwindCSS. Customize colors in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    // Your color palette
  }
}
```

## 📊 API Endpoints

- `GET /api/exchange-rates` - Get latest exchange rates
- `GET /api/exchange-rates/history?currency=USD&days=30` - Get historical rates
- `GET /api/petrol-prices` - Get latest petrol prices
- `GET /api/electricity-tariffs` - Get electricity tariffs
- `POST /api/refresh` - Manually refresh data (requires auth)
- `GET /api/last-update` - Get last update timestamp
- `GET /api/admin/logs` - Get refresh logs (admin only)

## 🚢 Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will automatically:
- Build and deploy on push
- Run cron jobs (if configured)

### Supabase (Database)

1. Create a new Supabase project
2. Run the schema SQL
3. Get connection credentials
4. Add to environment variables

### Render/Railway (Cron Jobs)

1. Create a new service
2. Use `render.yaml` or Railway config
3. Set environment variables
4. Deploy the cron service

## 🔐 Admin Panel

Access the admin panel at `/admin` with your `ADMIN_SECRET` password.

Features:
- Manual data refresh
- View refresh logs
- Monitor data update status

## 📈 Google AdSense Setup

1. Sign up for Google AdSense
2. Get your publisher ID (`ca-pub-xxxxxxxxxxxxxxxx`)
3. Add to `NEXT_PUBLIC_ADSENSE_ID` in environment variables
4. Replace placeholder ad units with your AdSense code
5. Wait for approval (can take 1-2 weeks)

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build
docker-compose build

# Run
docker-compose up
```

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `ADMIN_SECRET` | Admin panel password | Yes |
| `NEXT_PUBLIC_ADSENSE_ID` | Google AdSense ID | No |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes (production) |

## 🐛 Troubleshooting

### Data Not Updating

1. Check cron job logs
2. Verify Supabase connection
3. Check API endpoints are accessible
4. Review refresh logs in admin panel

### Build Errors

1. Ensure all environment variables are set
2. Run `npm install` to update dependencies
3. Check TypeScript errors: `npm run type-check`

### Database Connection Issues

1. Verify Supabase credentials
2. Check database schema is applied
3. Ensure service role key has proper permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- National Bank of Georgia for exchange rate data
- Georgian fuel companies (Gulf, Wissol, Socar)
- Next.js and Supabase communities

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review the admin panel logs

---

**Made with ❤️ for Georgia**


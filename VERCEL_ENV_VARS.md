# 🔐 Vercel Environment Variables - Quick Copy

Copy these values into Vercel → Settings → Environment Variables

## Required Variables

### 1. SUPABASE_URL
```
https://klwuauzhgfnnllaihjhe.supabase.co
```

### 2. SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd3VhdXpoZ2ZubmxsYWloamhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDQwNjIsImV4cCI6MjA3ODI4MDA2Mn0.YxDrU3vkmjLJvn3k4irr6WlijR-r0rVT_4vt9R1VjVA
```

### 3. SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd3VhdXpoZ2ZubmxsYWloamhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcwNDA2MiwiZXhwIjoyMDc4MjgwMDYyfQ.yA-o07yeoV5dqeW1SoJkNJROmU1I0sP9YxH0rYqyOCk
```

### 4. ADMIN_SECRET
```
GeoRates2024Secure!
```
*(You can change this to your own password)*

### 5. NEXT_PUBLIC_APP_URL
```
https://your-app-name.vercel.app
```
*(Replace with your actual Vercel URL after first deployment)*

---

## GitHub Actions Secrets

For GitHub Actions (Settings → Secrets and variables → Actions), add the same values:

- `SUPABASE_URL` = `https://klwuauzhgfnnllaihjhe.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (the service_role key above)
- `ADMIN_SECRET` = `GeoRates2024Secure!`

---

## ⚠️ Important Notes

1. **Never commit these keys to Git** - They're already in `.gitignore`
2. **Change ADMIN_SECRET** - Use a strong password you'll remember
3. **Update NEXT_PUBLIC_APP_URL** - After Vercel deployment, update with your actual URL
4. **Keep service_role key secret** - This has full database access


# ⚡ Quick Start Guide

## 🎯 Fastest Way to Run Locally

### Option 1: Automated Setup (Recommended)

**On Mac/Linux:**
```bash
cd "/Users/ninotsriashvili/untitled folder/georates"
./setup-local.sh
```

**On Windows:**
```bash
cd "C:\path\to\untitled folder\georates"
setup-local.bat
```

This will:
- ✅ Create `.env.local` file automatically
- ✅ Install all dependencies
- ✅ Set up everything needed

Then just run:
```bash
npm run dev
```

---

### Option 2: Manual Setup

**Step 1:** Create `.env.local` file in the `georates` folder:

**On Mac/Linux:**
```bash
cd "/Users/ninotsriashvili/untitled folder/georates"
touch .env.local
```

**On Windows:**
```bash
cd "C:\path\to\untitled folder\georates"
type nul > .env.local
```

**Step 2:** Open `.env.local` in a text editor and paste:

```env
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_ANON_KEY=placeholder_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=placeholder_service_role_key_here
ADMIN_SECRET=dev_password_123
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Step 3:** Install dependencies:
```bash
npm install
```

**Step 4:** Start the server:
```bash
npm run dev
```

**Step 5:** Open browser:
```
http://localhost:3000
```

---

## ✅ That's It!

The frontend will load and you can:
- ✅ See the full UI
- ✅ Switch languages (🇬🇪 🇬🇧 🇷🇺)
- ✅ Toggle dark/light mode
- ✅ Test responsive design

**Note:** Data won't load (shows loading states) because we're using placeholder database credentials. This is normal for local testing without a real database.

---

## 🆘 Need Help?

See `LOCAL_SETUP.md` for detailed instructions and troubleshooting.


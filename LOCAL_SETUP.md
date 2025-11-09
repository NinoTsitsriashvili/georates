# 🚀 Local Setup Guide - Run Frontend Without Code Changes

This guide will help you run the GeoRates frontend locally **without modifying any code**.

## ✅ Prerequisites Check

Before starting, make sure you have:
- **Node.js** installed (version 20 or higher)
- **npm** (comes with Node.js)

To check if you have them:
```bash
node --version
npm --version
```

If you don't have Node.js, download it from: https://nodejs.org/

---

## 📋 Step-by-Step Instructions

### Step 1: Navigate to Project Folder

Open your terminal/command prompt and go to the project directory:

```bash
cd "/Users/ninotsriashvili/untitled folder/georates"
```

**On Windows:**
```bash
cd "C:\path\to\untitled folder\georates"
```

### Step 2: Install Dependencies

Install all required packages (this may take 2-3 minutes):

```bash
npm install
```

**What this does:** Downloads all the libraries and packages needed to run the application.

**Expected output:** You'll see a lot of package names being installed. Wait until you see something like:
```
added 500 packages in 2m
```

### Step 3: Create Minimal Environment File

Create a file named `.env.local` in the `georates` folder with minimal configuration:

**On Mac/Linux:**
```bash
touch .env.local
```

**On Windows:**
```bash
type nul > .env.local
```

Then open `.env.local` in any text editor and add these lines:

```env
# Minimal config for local development
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_ANON_KEY=placeholder_key
SUPABASE_SERVICE_ROLE_KEY=placeholder_key
ADMIN_SECRET=dev_password_123
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** These are placeholder values. The frontend will load, but data won't fetch from a real database. The UI will show loading states.

### Step 4: Start the Development Server

Run this command:

```bash
npm run dev
```

**What this does:** Starts the Next.js development server.

**Expected output:**
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

### Step 5: Open in Browser

Open your web browser and go to:

```
http://localhost:3000
```

---

## 🎨 What You'll See

The frontend includes:

1. **Header** with:
   - GeoRates logo/title
   - Language switcher (🇬🇪 Georgian, 🇬🇧 English, 🇷🇺 Russian)
   - Dark/Light mode toggle (🌙/☀️)

2. **Main Dashboard** with:
   - **Exchange Rates Card**: Shows USD, EUR, RUB, GBP rates with interactive chart
   - **Petrol Prices Card**: Displays prices from Gulf, Wissol, Socar
   - **Electricity Tariffs Card**: Shows regional electricity rates

3. **Features You Can Test:**
   - ✅ Click language buttons to switch languages
   - ✅ Toggle dark/light mode
   - ✅ See responsive design (resize browser window)
   - ✅ View loading states (since no real data connection)

---

## ⚠️ Expected Behavior

**Without a real database connection:**
- ✅ The UI will load and display correctly
- ✅ All buttons and toggles will work
- ✅ Language switching works
- ✅ Dark mode works
- ⚠️ Data cards will show "Loading..." or empty states
- ⚠️ Charts won't display data
- ⚠️ API calls will fail (but won't crash the app)

**This is normal!** The frontend is designed to handle missing data gracefully.

---

## 🛑 To Stop the Server

Press `Ctrl + C` in your terminal (or `Cmd + C` on Mac).

---

## 🔧 Troubleshooting

### Problem: "command not found: npm"
**Solution:** Node.js is not installed. Download from nodejs.org

### Problem: "EACCES" or permission errors
**Solution:** On Mac/Linux, you might need:
```bash
sudo npm install
```

### Problem: Port 3000 already in use
**Solution:** Kill the process using port 3000:
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

Or use a different port:
```bash
PORT=3001 npm run dev
```

### Problem: "Module not found" errors
**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

### Problem: TypeScript errors
**Solution:** These are usually just warnings. The app should still run. If it doesn't:
```bash
npm run type-check
```

---

## 📱 Test Responsive Design

1. Open browser developer tools (F12)
2. Click the device toggle icon (or press Ctrl+Shift+M)
3. Try different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

---

## 🎯 Next Steps (Optional)

If you want to see **real data**:

1. **Set up Supabase** (free):
   - Go to supabase.com
   - Create a project
   - Run the SQL from `database/schema.sql`
   - Update `.env.local` with real credentials

2. **Populate initial data**:
   - Visit `http://localhost:3000/admin`
   - Login with your `ADMIN_SECRET`
   - Click "Refresh Data"

---

## ✅ Success Checklist

- [ ] Node.js installed
- [ ] Navigated to project folder
- [ ] Ran `npm install` successfully
- [ ] Created `.env.local` file
- [ ] Started dev server with `npm run dev`
- [ ] Opened http://localhost:3000 in browser
- [ ] See the GeoRates dashboard
- [ ] Can switch languages
- [ ] Can toggle dark mode

---

**You're all set!** The frontend is running locally. 🎉


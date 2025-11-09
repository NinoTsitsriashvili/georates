# API Endpoints Tutorial

## How to Call the Force Refresh Endpoint

The `/api/force-refresh` endpoint fetches fresh exchange rates from the National Bank of Georgia API and saves them to the database.

### Method 1: Using Your Web Browser (Easiest)

1. **Start your development server** (if not already running):
   ```bash
   cd georates
   npm run dev
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:3000/api/force-refresh
   ```

3. **You should see a JSON response** like:
   ```json
   {
     "success": true,
     "message": "Rates refreshed and saved",
     "fetched": 3,
     "saved": 3,
     "rates": [
       {
         "currency_code": "USD",
         "buy_rate": 2.7135,
         "sell_rate": 2.6865,
         "official_rate": 2.7,
         "date": "2025-01-XX"
       },
       ...
     ],
     "timestamp": "2025-01-XX..."
   }
   ```

### Method 2: Using cURL (Command Line)

**On Mac/Linux:**
```bash
curl http://localhost:3000/api/force-refresh
```

**On Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/force-refresh -Method GET
```

**On Windows (Command Prompt):**
```cmd
curl http://localhost:3000/api/force-refresh
```

### Method 3: Using JavaScript/Fetch (Browser Console)

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Paste and run:
   ```javascript
   fetch('http://localhost:3000/api/force-refresh')
     .then(res => res.json())
     .then(data => console.log(data))
     .catch(err => console.error('Error:', err))
   ```

### Method 4: Using Postman or Similar Tools

1. **Open Postman** (or any API testing tool)
2. **Create a new request:**
   - Method: `GET`
   - URL: `http://localhost:3000/api/force-refresh`
3. **Click Send**
4. **View the response** in the response body

### Method 5: Using Node.js Script

Create a file `test-refresh.js`:
```javascript
const fetch = require('node-fetch'); // or use built-in fetch in Node 18+

async function refreshRates() {
  try {
    const response = await fetch('http://localhost:3000/api/force-refresh');
    const data = await response.json();
    console.log('Refresh Result:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

refreshRates();
```

Run it:
```bash
node test-refresh.js
```

## Other Useful Endpoints

### Test Rates Endpoint (No Database Required)
```
http://localhost:3000/api/test-rates
```
This tests the API without saving to database. Good for debugging.

### Get Current Exchange Rates
```
http://localhost:3000/api/exchange-rates
```
Returns the current rates from the database (what the main page uses).

### Manual Refresh (Requires Auth)
```bash
curl -X POST http://localhost:3000/api/refresh \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

## Troubleshooting

### If you get "Connection refused":
- Make sure your dev server is running: `npm run dev`
- Check that you're using the correct port (usually 3000)

### If you get "Missing Supabase environment variables":
- The `/api/force-refresh` endpoint requires Supabase to save data
- Make sure your `.env.local` file has:
  ```
  SUPABASE_URL=your_supabase_url
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

### If rates are not updating on the main page:
1. Call `/api/force-refresh` to fetch and save new rates
2. Refresh the main page (F5 or Cmd+R)
3. Check browser console for any errors

## Expected Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Rates refreshed and saved",
  "fetched": 3,
  "saved": 3,
  "rates": [
    {
      "currency_code": "USD",
      "buy_rate": 2.7135,
      "sell_rate": 2.6865,
      "official_rate": 2.7,
      "date": "2025-01-15"
    },
    {
      "currency_code": "EUR",
      "buy_rate": 2.9435,
      "sell_rate": 2.9165,
      "official_rate": 2.93,
      "date": "2025-01-15"
    },
    {
      "currency_code": "RUB",
      "buy_rate": 0.029145,
      "sell_rate": 0.028855,
      "official_rate": 0.029,
      "date": "2025-01-15"
    }
  ],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Quick Start Commands

**1. Start the server:**
```bash
cd georates
npm run dev
```

**2. In a new terminal, refresh rates:**
```bash
curl http://localhost:3000/api/force-refresh
```

**3. Check the main page:**
Open `http://localhost:3000` in your browser to see the updated rates!


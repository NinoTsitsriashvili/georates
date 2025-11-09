@echo off
REM GeoRates Local Setup Script for Windows
REM This script creates the necessary .env.local file for local development

echo 🚀 Setting up GeoRates for local development...

REM Create .env.local file
(
echo # Local Development Environment Variables
echo # These are placeholder values - the app will run but won't fetch real data
echo # Replace with real values when connecting to Supabase
echo.
echo # Supabase Configuration (Placeholders - replace with real values)
echo SUPABASE_URL=https://placeholder.supabase.co
echo SUPABASE_ANON_KEY=placeholder_anon_key_here
echo SUPABASE_SERVICE_ROLE_KEY=placeholder_service_role_key_here
echo.
echo # Admin Panel Password
echo ADMIN_SECRET=dev_password_123
echo.
echo # Application URL
echo NEXT_PUBLIC_APP_URL=http://localhost:3000
echo.
echo # Google AdSense (Optional - leave empty for now)
echo # NEXT_PUBLIC_ADSENSE_ID=
echo.
echo # Google Analytics (Optional - leave empty for now)
echo # NEXT_PUBLIC_GA_ID=
echo.
echo # Environment
echo NODE_ENV=development
) > .env.local

echo ✅ Created .env.local file with placeholder values
echo.
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Setup complete!
    echo.
    echo To start the development server, run:
    echo   npm run dev
    echo.
    echo Then open http://localhost:3000 in your browser
) else (
    echo.
    echo ❌ Error installing dependencies
    exit /b 1
)


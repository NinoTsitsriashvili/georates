#!/bin/bash

# GeoRates Local Setup Script
# This script creates the necessary .env.local file for local development

echo "🚀 Setting up GeoRates for local development..."

# Create .env.local file
cat > .env.local << 'EOF'
# Local Development Environment Variables
# These are placeholder values - the app will run but won't fetch real data
# Replace with real values when connecting to Supabase

# Supabase Configuration (Placeholders - replace with real values)
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_ANON_KEY=placeholder_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=placeholder_service_role_key_here

# Admin Panel Password
ADMIN_SECRET=dev_password_123

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google AdSense (Optional - leave empty for now)
# NEXT_PUBLIC_ADSENSE_ID=

# Google Analytics (Optional - leave empty for now)
# NEXT_PUBLIC_GA_ID=

# Environment
NODE_ENV=development
EOF

echo "✅ Created .env.local file with placeholder values"
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "To start the development server, run:"
    echo "  npm run dev"
    echo ""
    echo "Then open http://localhost:3000 in your browser"
else
    echo ""
    echo "❌ Error installing dependencies"
    exit 1
fi


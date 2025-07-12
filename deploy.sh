#!/bin/bash

# BitBash Project Deployment Script for Vercel

echo "🚀 Starting BitBash Project Deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "📋 Checking Vercel authentication..."
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

# Build the frontend locally to check for errors
echo "🔨 Building frontend locally..."
cd Frontend/my-react-app
if npm run build; then
    echo "✅ Frontend build successful!"
    cd ../..
else
    echo "❌ Frontend build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your database (see DEPLOYMENT.md for details)"
echo "3. Test your deployment at the provided URL"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md" 
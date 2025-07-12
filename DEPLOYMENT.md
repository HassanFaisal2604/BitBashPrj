# Vercel Deployment Guide

This document provides step-by-step instructions for deploying your BitBash project to Vercel.

## Project Structure

Your project is configured as a full-stack application with:
- **Frontend**: React app with Vite (in `Frontend/my-react-app/`)
- **Backend**: Flask API with SQLAlchemy (in `Backend/`)
- **Database**: PostgreSQL (will be configured on Vercel)

## Pre-Deployment Setup

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

## Deployment Steps

### 1. Deploy to Vercel
From your project root directory:
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name** → bitbash-project (or your preferred name)
- **Directory** → Keep as current directory (.)

### 2. Configure Environment Variables

After deployment, you need to set up environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

#### Required Variables:
- `DATABASE_URL` → Your PostgreSQL database connection string
- `SECRET_KEY` → A secure secret key for Flask sessions

#### Optional Variables:
- `PAGES_TO_SCRAPE` → Number of pages to scrape (default: 2)

### 3. Database Setup

You have several options for the database:

#### Option A: Vercel Postgres (Recommended)
1. In your Vercel dashboard, go to **Storage**
2. Create a new **Postgres** database
3. Copy the connection string and add it as `DATABASE_URL`

#### Option B: External Database
- Use services like PlanetScale, Supabase, or your own PostgreSQL instance
- Add the connection string as `DATABASE_URL`

### 4. Re-deploy with Environment Variables
```bash
vercel --prod
```

## Local Development

### 1. Install Dependencies
```bash
# Frontend dependencies
cd Frontend/my-react-app
npm install

# Backend dependencies (if using virtual environment)
cd ../../Backend
pip install -r requirements.txt
```

### 2. Set up Environment Variables
Create a `.env` file in your project root based on `environment.config.example`:
```bash
cp environment.config.example .env
```

Edit the `.env` file with your local configuration.

### 3. Run Development Servers

#### Backend (Flask)
```bash
cd Backend
python -m flask --app run:create_app run --debug
```

#### Frontend (React)
```bash
cd Frontend/my-react-app
npm run dev
```

## Configuration Files

### `vercel.json`
This file configures how Vercel builds and deploys your application:
- **Builds**: Configures both frontend (static build) and backend (Python serverless)
- **Routes**: Routes API calls to the backend and static files to the frontend
- **Environment**: Sets `VITE_API_BASE=/api` for production

### `api/index.py`
Entry point for the Flask application in Vercel's serverless environment.

### `api/requirements.txt`
Python dependencies for the serverless backend.

## Troubleshooting

### Build Errors
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are correctly listed in `requirements.txt`
3. Verify environment variables are set correctly

### API Connection Issues
1. Verify the API routes are working: `https://your-app.vercel.app/api/jobs`
2. Check if `VITE_API_BASE` is correctly set in production
3. Ensure CORS is properly configured in your Flask app

### Database Connection Issues
1. Verify `DATABASE_URL` is correctly set
2. Check if your database accepts connections from Vercel's IP ranges
3. Ensure database tables are created (you may need to run migrations)

## Database Migrations

If you need to create tables or run migrations:

1. Connect to your database using the `DATABASE_URL`
2. Run your SQLAlchemy models to create tables
3. Or use a database management tool to import your schema

## Production URLs

After deployment, your application will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api`

## Support

For issues specific to:
- **Vercel deployment**: Check [Vercel documentation](https://vercel.com/docs)
- **Flask on Vercel**: Check [Vercel Python runtime docs](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- **React deployment**: Check [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html) 
# 🚀 Vercel Deployment Quick Setup

This guide will get your BitBash project deployed to Vercel in minutes.

## 🎯 Pre-Deployment Checklist

Run the verification script to ensure everything is ready:

```bash
./verify-deployment.sh
```

## ⚡ Quick Deploy (3 steps)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
./deploy.sh
```

Or manually:
```bash
vercel --prod
```

## 🔧 Environment Variables Setup

After deployment, add these in your Vercel dashboard:

**Required:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `SECRET_KEY` - Generate with: `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`

**Optional:**
- `PAGES_TO_SCRAPE` - Number of pages to scrape (default: 2)

## 🎨 Project Structure

```
BitBashPrj/
├── vercel.json                    # 🔧 Vercel configuration
├── api/
│   ├── index.py                   # 🐍 Serverless Flask entry point
│   └── requirements.txt           # 📦 Python dependencies
├── Frontend/my-react-app/         # ⚛️ React frontend
├── Backend/                       # 🏗️ Flask backend code
├── deploy.sh                      # 🚀 Deployment script
├── verify-deployment.sh           # ✅ Verification script
└── DEPLOYMENT.md                  # 📖 Detailed deployment guide
```

## 🌐 How It Works

- **Frontend**: React app → Static files on Vercel CDN
- **Backend**: Flask app → Serverless functions
- **Database**: PostgreSQL → Connected via environment variables
- **Routes**: 
  - `/` → Frontend
  - `/api/*` → Backend serverless functions

## 🚨 Troubleshooting

### Common Issues:

1. **401 Errors**: Check if project protection is enabled in Vercel dashboard
2. **Build Errors**: Run `npm run build` locally first
3. **API Errors**: Verify `DATABASE_URL` and `SECRET_KEY` are set

### Debug Steps:

```bash
# Test frontend build
cd Frontend/my-react-app && npm run build

# Verify configuration
./verify-deployment.sh

# Check deployment logs
vercel logs
```

## 🎉 Success!

After deployment, your app will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/jobs`

## 📞 Support

- Check `DEPLOYMENT.md` for detailed instructions
- Visit [Vercel docs](https://vercel.com/docs) for platform-specific help
- Use `./verify-deployment.sh` to diagnose issues 
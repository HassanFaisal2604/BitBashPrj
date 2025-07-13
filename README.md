# BitBash – Full-Stack Actuary Job Board

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen)](https://bitbash-project.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0%2B-blue)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3%2B-blue)](https://flask.palletsprojects.com/)

A complete job-listing web platform that pulls live actuarial vacancies from ActuaryList.com and provides a full CRUD interface to manage them. Built with modern web technologies and deployed on Vercel.

**🚀 Live Demo:** https://bitbash-project.vercel.app/

**Demonstration Video** https://drive.google.com/file/d/1HzvrBYMZqSMyMSInBZimH4mK9f3ERWPE/view?usp=sharing

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [macOS Setup](#macos-setup)
  - [Windows Setup](#windows-setup)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **🔍 Live Job Scraping:** Automated Selenium-based scraper that pulls real-time actuarial job listings
- **📊 Full CRUD Operations:** Create, Read, Update, Delete job postings with a user-friendly interface
- **🔧 Advanced Filtering:** Server-side filtering and sorting by location, salary, experience level, and more
- **📱 Responsive Design:** Mobile-first design that works seamlessly across all devices
- **⚡ Real-time Updates:** Live data synchronization between frontend and backend
- **🔒 Error Handling:** Comprehensive error handling and user feedback
- **🎨 Modern UI:** Clean, intuitive interface built with Tailwind CSS
- **🚀 Serverless Deployment:** Efficient deployment using Vercel's serverless functions

## 🛠 Technology Stack

### Backend
- **Flask 2.3+** - Python web framework
- **SQLAlchemy 2.0+** - Database ORM
- **PostgreSQL** - Primary database
- **Selenium 4.15+** - Web scraping automation
- **Flask-CORS** - Cross-origin resource sharing
- **python-dotenv** - Environment variable management

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hooks** - State management and side effects

### Deployment & DevOps
- **Vercel** - Frontend hosting and serverless functions
- **PostgreSQL** - Cloud database hosting
- **Git** - Version control
- **npm/pip** - Package management

## 📁 Project Structure

```
BitBashPrj/
├── 📁 Backend/                    # Flask API server
│   ├── 📁 api/                   # API routes and models
│   │   ├── models.py             # Database models
│   │   └── routes.py             # API endpoints
│   ├── 📁 scraper/               # Web scraping logic
│   │   ├── __init__.py
│   │   └── app.py                # Selenium scraper
│   ├── config.py                 # Application configuration
│   ├── requirements.txt          # Python dependencies
│   └── run.py                    # Flask application factory
├── 📁 Frontend/                   # React application
│   └── 📁 my-react-app/          # Main React app
│       ├── 📁 public/            # Static assets
│       ├── 📁 src/               # React source code
│       │   ├── 📁 components/    # Reusable components
│       │   ├── 📁 contexts/      # React contexts
│       │   ├── 📁 hooks/         # Custom hooks
│       │   ├── App.jsx           # Main App component
│       │   └── main.jsx          # Entry point
│       ├── package.json          # Node.js dependencies
│       └── vite.config.js        # Vite configuration
├── 📁 api/                       # Vercel serverless functions
│   ├── index.py                  # Main API handler
│   └── requirements.txt          # Serverless dependencies
├── README.md                     # Project documentation
└── vercel.json                   # Vercel deployment config
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### For macOS:
- **Python 3.8+** (Check: `python3 --version`)
- **Node.js 16+** (Check: `node --version`)
- **npm 7+** (Check: `npm --version`)
- **Git** (Check: `git --version`)

### For Windows:
- **Python 3.8+** (Check: `python --version`)
- **Node.js 16+** (Check: `node --version`)
- **npm 7+** (Check: `npm --version`)
- **Git** (Check: `git --version`)

## 🚀 Installation & Setup

### macOS Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/HassanFaisal2604/BitBashPrj.git
cd BitBashPrj
```

#### 2. Backend Setup
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r Backend/requirements.txt

# Set up environment variables
cd Backend
cp .env.example .env  # Create this file with your config
```

#### 3. Frontend Setup
```bash
# Navigate to React app directory
cd Frontend/my-react-app

# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env  # Create this file with your config
```

### Windows Setup

#### 1. Clone the Repository
```cmd
git clone https://github.com/HassanFaisal2604/BitBashPrj.git
cd BitBashPrj
```

#### 2. Backend Setup
```cmd
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install Python dependencies
pip install -r Backend\requirements.txt

# Set up environment variables
cd Backend
copy .env.example .env  # Create this file with your config
```

#### 3. Frontend Setup
```cmd
# Navigate to React app directory
cd Frontend\my-react-app

# Install Node.js dependencies
npm install

# Create environment file
copy .env.example .env  # Create this file with your config
```

#### 4. Database Setup
```cmd
No need to setup Database locally as it is using cloud PostgreSQL, 
```

## 🔧 Development

### Running the Application

#### macOS Development Commands:

**Backend (Terminal 1):**
```bash
cd BitBashPrj
source venv/bin/activate
# Stay in the project root so that Python can resolve the `Backend` package
export FLASK_APP=Backend.run:create_app
export FLASK_ENV=development
flask run
# Backend will be available at http://localhost:5000/api/jobs
```

**Frontend (Terminal 2):**
```bash
cd BitBashPrj/Frontend/my-react-app
npm run dev
# Frontend will be available at http://localhost:5173
```

#### Windows Development Commands:

**Backend (PowerShell):**
```powershell
cd BitBashPrj
./venv/Scripts/Activate.ps1
$env:FLASK_APP = "Backend.run:create_app"
$env:FLASK_ENV = "development"
flask run
# Backend will be available at http://localhost:5000
```

**Backend (Command Prompt):**
```cmd
cd BitBashPrj
venv\Scripts\activate
set FLASK_APP=Backend.run:create_app
set FLASK_ENV=development
flask run
# Backend will be available at http://localhost:5000
```

### Environment Variables

Create `.env` files in both `Backend/` and `Frontend/my-react-app/` directories:

**Backend/.env:**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost/bitbash_db

# Flask
FLASK_ENV=development
FLASK_APP=Backend.run:create_app
SECRET_KEY=your-secret-key-here-change-in-production

# Scraper (optional)
SCRAPER_DELAY=2
```

**Frontend/my-react-app/.env:**
```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=BitBash Job Board
```

## 📡 API Documentation

### Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://bitbash-project.vercel.app/`

### Endpoints

#### Jobs
- `GET /api/jobs` - Get all jobs with optional filtering
- `GET /api/jobs/<id>` - Get specific job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/<id>` - Update existing job
- `DELETE /api/jobs/<id>` - Delete job

#### Health Check
- `GET /api/health` - API health status

### Query Parameters
- `location` - Filter by location
- `salary_min` - Minimum salary filter
- `salary_max` - Maximum salary filter
- `experience_level` - Filter by experience level
- `sort` - Sort order (asc/desc)
- `sort_by` - Sort field (salary, date, etc.)



---

**⭐ Star this repository if you find it helpful!**

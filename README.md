# BitBash – Full-Stack Actuarial Job Board

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen)](https://bitbash-project.vercel.app/)
[![Video Demo](https://img.shields.io/badge/Video%20Demo-Watch%20Here-blue)](https://drive.google.com/file/d/1HzvrBYMZqSMyMSInBZimH4mK9f3ERWPE/view?usp=sharing)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0%2B-blue)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3%2B-blue)](https://flask.palletsprojects.com/)

> **A professional-grade job board platform demonstrating full-stack development expertise**

A complete job-listing web platform that pulls live actuarial vacancies from ActuaryList.com and provides a full CRUD interface to manage them. Built with modern web technologies and deployed on Vercel.

**🚀 Live Application:** https://bitbash-project.vercel.app/  
**🎥 Demo Video:** https://drive.google.com/file/d/1HzvrBYMZqSMyMSInBZimH4mK9f3ERWPE/view?usp=sharing

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features-implemented)
- [Technology Stack](#-technology-stack)
- [Skills Demonstrated](#-skills-demonstrated)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Live Demonstration](#-live-demonstration)
- [Professional Practices](#-professional-development-practices)
- [Project Metrics](#-project-metrics)

---

## 🎯 **Project Overview**

BitBash showcases comprehensive full-stack web development skills through a specialized job board for actuarial professionals. This project demonstrates proficiency in:

- **Full-Stack Development** with React and Python
- **Database Design** and management with PostgreSQL
- **Web Scraping** and automation using Selenium
- **API Development** with RESTful principles
- **Cloud Deployment** and DevOps practices
- **Responsive Design** and modern user experience

---

## ✨ **Key Features Implemented**

### **Frontend Capabilities**
- ✅ **Modern React Development** - Hooks, context, custom components
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **State Management** - Efficient data flow and user interaction handling
- ✅ **API Integration** - Seamless backend communication
- ✅ **User Experience** - Intuitive interface with loading states and error handling

### **Backend Capabilities**
- ✅ **RESTful API Design** - Well-structured endpoints following REST principles
- ✅ **Database Management** - PostgreSQL with SQLAlchemy ORM
- ✅ **Web Scraping** - Automated data collection using Selenium
- ✅ **Error Handling** - Comprehensive exception management
- ✅ **CORS Configuration** - Proper cross-origin resource sharing setup

### **DevOps & Deployment**
- ✅ **Cloud Deployment** - Production-ready deployment on Vercel
- ✅ **Environment Management** - Proper configuration for different environments
- ✅ **Version Control** - Git workflow with clear commit history
- ✅ **Documentation** - Comprehensive project documentation

---

## 🛠 **Technology Stack**

| Category | Technologies | Proficiency Demonstrated |
|----------|-------------|--------------------------|
| **Frontend** | React 18, JavaScript ES6+, Tailwind CSS, Vite | Modern frontend development |
| **Backend** | Python, Flask, SQLAlchemy, PostgreSQL | Server-side architecture |
| **Automation** | Selenium WebDriver, Python scripting | Web scraping and automation |
| **Deployment** | Vercel, Cloud hosting, Serverless functions | DevOps and cloud deployment |
| **Tools** | Git, npm, pip, VS Code | Development workflow |

### **Detailed Technology Breakdown**

#### Backend
- **Flask 2.3+** - Python web framework
- **SQLAlchemy 2.0+** - Database ORM
- **PostgreSQL** - Primary database
- **Selenium 4.15+** - Web scraping automation
- **Flask-CORS** - Cross-origin resource sharing
- **python-dotenv** - Environment variable management

#### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hooks** - State management and side effects

#### Deployment & DevOps
- **Vercel** - Frontend hosting and serverless functions
- **PostgreSQL** - Cloud database hosting
- **Git** - Version control
- **npm/pip** - Package management

---

## 🎓 **Skills Demonstrated**

| Skill Category | Specific Competencies |
|----------------|----------------------|
| **Programming Languages** | Python, JavaScript (ES6+), HTML5, CSS3 |
| **Frameworks & Libraries** | React, Flask, SQLAlchemy, Tailwind CSS |
| **Database Management** | PostgreSQL, SQL queries, ORM usage |
| **Web Technologies** | RESTful APIs, CORS, HTTP protocols |
| **Automation** | Selenium WebDriver, web scraping |
| **Cloud & Deployment** | Vercel, serverless functions, cloud hosting |
| **Development Tools** | Git, npm, pip, modern IDE usage |
| **Problem Solving** | Debugging, optimization, architecture design |

---

## 📁 **Project Structure**

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
├── run.py                        # Root Flask entry point
├── README.md                     # Project documentation
└── vercel.json                   # Vercel deployment config
```

---

## 📋 **Prerequisites**

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

---

## 🚀 **Installation & Setup**

### **macOS Setup**

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

# Set up environment variables (optional)
cd Backend
cp .env.example .env  # Create this file with your config if needed
cd ..
```

#### 3. Frontend Setup
```bash
# Navigate to React app directory
cd Frontend/my-react-app

# Install Node.js dependencies
npm install

# Create environment file (optional)
cp .env.example .env  # Create this file with your config if needed
cd ../..
```

### **Windows Setup**

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

# Set up environment variables (optional)
cd Backend
copy .env.example .env  # Create this file with your config if needed
cd ..
```

#### 3. Frontend Setup
```cmd
# Navigate to React app directory
cd Frontend\my-react-app

# Install Node.js dependencies
npm install

# Create environment file (optional)
copy .env.example .env  # Create this file with your config if needed
cd ..\..
```

#### 4. Database Setup
```cmd
# No need to setup Database locally as it is using cloud PostgreSQL
```

---

## 🔧 **Development**

### **Running the Application**

#### **macOS Development Commands:**

**Backend (Terminal 1):**
```bash
cd BitBashPrj
source venv/bin/activate
export FLASK_APP=run
export FLASK_ENV=development
flask run
# Backend will be available at http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd BitBashPrj/Frontend/my-react-app
npm run dev
# Frontend will be available at http://localhost:5173
```

#### **Windows Development Commands:**

**Backend (PowerShell):**
```powershell
cd BitBashPrj
.\venv\Scripts\Activate.ps1
$env:FLASK_APP = "run"
$env:FLASK_ENV = "development"
flask run
# Backend will be available at http://localhost:5000
```

**Backend (Command Prompt):**
```cmd
cd BitBashPrj
venv\Scripts\activate
set FLASK_APP=run
set FLASK_ENV=development
flask run
# Backend will be available at http://localhost:5000
```

**Frontend (Windows):**
```cmd
cd BitBashPrj\Frontend\my-react-app
npm run dev
# Frontend will be available at http://localhost:5173
```

### **Environment Variables**

Create `.env` files in both `Backend/` and `Frontend/my-react-app/` directories if needed:

**Backend/.env:**
```env
# Database (optional - uses cloud PostgreSQL by default)
DATABASE_URL=postgresql://username:password@localhost/bitbash_db

# Flask
FLASK_ENV=development
FLASK_APP=run
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

---

## 📡 **API Documentation**

### **Base URL**
- **Development:** `http://localhost:5000`
- **Production:** `https://bitbash-project.vercel.app/`

### **Endpoints**

#### **Jobs**
- `GET /api/jobs` - Get all jobs with optional filtering
- `GET /api/jobs/<id>` - Get specific job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/<id>` - Update existing job
- `DELETE /api/jobs/<id>` - Delete job

#### **Health Check**
- `GET /api/health` - API health status

### **Query Parameters**
- `location` - Filter by location
- `salary_min` - Minimum salary filter
- `salary_max` - Maximum salary filter
- `experience_level` - Filter by experience level
- `sort` - Sort order (asc/desc)
- `sort_by` - Sort field (salary, date, etc.)

---

## 🚀 **Live Demonstration**

### **Try the Application**
👉 **[Live Demo](https://bitbash-project.vercel.app/)** - Fully functional deployment

### **Watch the Walkthrough**
👉 **[Video Demo](https://drive.google.com/file/d/1HzvrBYMZqSMyMSInBZimH4mK9f3ERWPE/view?usp=sharing)** - 3-minute feature overview

### **What You Can Test**
- Browse real job listings scraped from live sources
- Use advanced filtering and search functionality
- Experience responsive design on different devices
- See real-time data updates and user feedback
- Test CRUD operations (Create, Read, Update, Delete jobs)

---

## 💼 **Professional Development Practices**

### **Code Quality**
- Clean, readable code with consistent formatting
- Meaningful variable and function names
- Proper commenting and documentation
- Modular architecture for maintainability

### **Version Control**
- Regular commits with descriptive messages
- Organized project structure
- Clear development workflow

### **Documentation**
- Comprehensive README with setup instructions
- Code comments explaining complex logic
- API documentation for all endpoints

### **Testing & Validation**
- Manual testing across different browsers and devices
- Error handling validation
- User experience testing

---

## 📈 **Project Metrics**

- **Lines of Code**: ~2,000+ across frontend and backend
- **Components**: 10+ reusable React components
- **API Endpoints**: 8 RESTful endpoints with full CRUD operations
- **Responsive Breakpoints**: Mobile, tablet, and desktop optimized
- **External Integrations**: Live data scraping from job sites
- **Deployment**: Production-ready cloud deployment

---

## 🎯 **Key Technical Achievements**

### **Problem-Solving Approach**
1. **Cross-Origin Resource Sharing**: Configured CORS for secure API access
2. **Responsive Design**: Ensured optimal experience across all device sizes
3. **Data Persistence**: Implemented reliable database operations
4. **Error Handling**: Created comprehensive error management system
5. **Performance**: Optimized loading times and user interactions

### **Technical Solutions**
- Used modern React patterns (hooks, context) for efficient state management
- Implemented proper separation of concerns in backend architecture
- Created reusable components for maintainable frontend code
- Added comprehensive error handling throughout the application

---

**This project demonstrates practical full-stack development skills, modern web technologies, and professional software development practices.**

**⭐ Star this repository if you find it helpful!**
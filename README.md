# BitBash – Full-Stack Actuary Job Board

A complete job-listing web platform that pulls live actuarial vacancies from ActuaryList.com and provides a full CRUD interface to manage them.

**🚀 Live Demo:** https://bit-bash-prj.vercel.app/

## Features

- **Backend:** Flask API with full CRUD functionality, server-side filtering, and sorting
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Scraper:** Selenium-based bot to populate database with live job data
- **Frontend:** Responsive React UI with Vite and Tailwind CSS

## Project Structure

```
BitBashPrj/
├── Backend/                # Flask API server
│   ├── api/               # Routes and models
│   ├── scraper/           # Data scraping logic
│   └── run.py             # Flask app factory
├── Frontend/              # React application
│   └── my-react-app/      # Vite + React + Tailwind
└── api/                   # Vercel serverless functions
```

## Technology Stack

- **Backend:** Flask, SQLAlchemy, Selenium, PostgreSQL
- **Frontend:** React, Vite, Tailwind CSS
- **Deployment:** Vercel (Frontend + Serverless Functions)
- **Database:** PostgreSQL (hosted)

## Local Development

### Backend
```bash
cd Backend
pip install -r requirements.txt
export FLASK_APP=run:create_app
flask run
```

### Frontend
```bash
cd Frontend/my-react-app
npm install
npm run dev
```

## Deployment

The project is deployed on Vercel with automatic deployments from the `master1` branch. Both frontend and backend run on the same domain using Vercel's serverless functions.
# BitBash – Full-Stack Actuary Job Board

This repository contains **both** the Flask API/Selenium scraper (in `Backend/`) **and** the React + Vite single-page application (in `Frontend/`). Together they form a complete job-listing web platform that pulls live actuarial vacancies from ActuaryList.com and provides a full CRUD interface to manage them.

[![Demo Screenshot](link_to_your_screenshot.png)](link_to_your_video_demo)

**[➡️ Watch the Full Video Demo Here](link_to_your_video_demo)**

---

## Features

-   **Backend:** A robust Flask API with full CRUD functionality, server-side filtering (by keyword, job type, location, tags), and sorting.
-   **Database:** Uses PostgreSQL with SQLAlchemy ORM.
-   **Scraper:** A Selenium-based bot to populate the database with live job data from ActuaryList.
-   **Frontend:** A responsive and modern React UI built with Vite and styled with Tailwind CSS. Features include modals for adding/editing, toast notifications for feedback, and loading skeletons for a smooth user experience.

## Project Structure

```
BitBashPrj/
├── Backend/
│   ├── api/
│   │   ├── models.py       # SQLAlchemy database models
│   │   └── routes.py       # All API endpoint logic (CRUD, filtering)
│   ├── scraper/
│   │   └── app.py          # Selenium scraper script
│   ├── config.py           # Application configuration
│   ├── requirements.txt    # Python dependencies
│   └── run.py              # Flask app factory
│
└── Frontend/
    └── my-react-app/
        ├── src/
        │   ├── api.js      # API service functions
        │   ├── components/ # React components
        │   └── ...
        ├── package.json
        └── ...
```

---

## 🚀 Getting Started

### Prerequisites

-   Python (3.9+)
-   Node.js (18.x+) and npm
-   A running PostgreSQL database instance (local or cloud-hosted like Neon)

### 1. Backend Setup

First, set up and run the Flask API server.

```bash
# 1. Clone the repository and navigate into the backend directory
git clone https://github.com/<your-repo>/BitBashPrj.git
cd BitBashPrj/Backend

# 2. Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt  # install Backend dependencies

# 4. Configure your database connection
#    Copy the example .env file and fill in your database URL
cp .env.example .env
#    Now, edit the .env file with your credentials.

# 5. Tables will be created automatically the first time you run the app/scraper.

# 6. (Optional) Populate the database with live data
#    This will run the Selenium scraper.
python scraper/app.py

# 7. Run the Flask API server
#    Stay in the repository root so that the `Backend` package can be resolved.
```bash
# macOS / Linux
export FLASK_APP=Backend.run:create_app   # module:function
export FLASK_ENV=development              # enables reloader & debugger

# Windows (PowerShell)
$env:FLASK_APP = "Backend.run:create_app"
$env:FLASK_ENV = "development"

# Windows (Command Prompt)
set FLASK_APP=Backend.run:create_app
set FLASK_ENV=development

# Start the server
flask run
```
Your backend is now running on `http://127.0.0.1:5000`.

### 2. Frontend Setup

In a **new terminal window**, set up and run the React client.

```bash
# 1. Navigate into the frontend directory
cd ../Frontend/my-react-app

# 2. Install Node.js dependencies
npm install

# 3. Configure the API endpoint
#    The frontend needs to know where the backend is running.
cp .env.example .env
#    The default value in the .env file should work for local development.

# 4. Run the React development server
npm run dev
```
Your frontend is now running on `http://localhost:5173` (or another port if 5173 is busy) and is connected to your backend.

---

## Key Dependencies

-   **Backend:** Flask, SQLAlchemy, Selenium, python-dotenv, Flask-CORS.
-   **Frontend:** React, Vite, Tailwind CSS, Lucide React.
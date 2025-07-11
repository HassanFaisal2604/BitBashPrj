# BitBash Actuary Job Scraper

This project scrapes actuarial-job listings from [ActuaryList](https://www.actuarylist.com/) and persists them in a PostgreSQL database.  
The codebase is intentionally minimal: **no web framework / API endpoints have been implemented yet**—the focus is on reliable data collection and storage.

## Project Layout
```
BitBashPrj/
│
├── app/
│   ├── api/
│   │   ├── models.py         # SQLAlchemy models + DB session helper
│   │   └── routes.py         # (empty placeholder for future API routes)
│   │
│   ├── scraper/
│   │   ├── __init__.py       # marks scraper as a package
│   │   └── app.py            # Selenium logic that performs the scrape
│   └── requirements.txt      # Python dependencies
│
├── README.md                 # ← you are here
└── venv/                     # (optional) local virtual-env, excluded from VCS
```

## Quick-start
1. **Clone & create a virtual environment**
   ```bash
   git clone https://github.com/<your-org>/BitBashPrj.git
   cd BitBashPrj
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r app/requirements.txt
   ```

3. **Configure the database connection**  
   Either supply a single `DATABASE_URL` environment variable (preferred) **or** the individual `NEON_*` parts.  
   Create a `.env` file in the repository root (or export variables in your shell):
   ```ini
   # .env
   DATABASE_URL=postgresql+psycopg2://<user>:<password>@<host>:<port>/<db>?sslmode=require
   # – OR –
   NEON_USER=<user>
   NEON_PASS=<password>
   NEON_HOST=<host>
   NEON_PORT=5432
   NEON_DB=<db>
   ```
   The scraper will automatically create the `jobs` table if it does not yet exist.

4. **Run the scraper**
   ```bash
   python app/scraper/app.py
   ```
   By default the script scrapes **two pages** of job listings.  
   To change this, open `app/scraper/app.py` and modify the constant `pages_to_scrape` near the top of the file.

## Dependencies
See [`app/requirements.txt`](app/requirements.txt).  
Key libraries:
- **Selenium 4** – browser automation.
- **webdriver-manager** – automatic ChromeDriver handling.
- **SQLAlchemy 2** – ORM & DB connection management.
- **psycopg2-binary** – PostgreSQL driver.
- **pandas** – optional CSV seeding helper.
- **python-dotenv** – loads environment variables from `.env`.

## Notes & Troubleshooting
1. **Headless Chrome**: if you prefer running Chrome without a UI, add `chrome_options.add_argument("--headless")` in `app/scraper/app.py`.
2. **Pop-ups**: the scraper auto-closes common modal dialogs; you may need to adapt selectors if the site UI changes.
3. **Database SSL**: Neon requires `sslmode=require`—the connection URI in the example already includes it.
4. **Table already exists**: The creation step is wrapped in `CREATE TABLE IF NOT EXISTS`; safe to run multiple times.

---
© 2024 BitBash – released under the MIT License. 
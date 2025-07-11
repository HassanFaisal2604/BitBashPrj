# Optional CSV seed helper
import pandas as pd
from pathlib import Path
from sqlalchemy import create_engine, Column, String
# SQLAlchemy 2.0+: import declarative_base from orm to avoid deprecation warning
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
# Load env vars
import os
from dotenv import load_dotenv

load_dotenv()

# --- 1. SQLAlchemy setup ---
Base = declarative_base()

# --------------------------------------------------
#   Job ORM model
# --------------------------------------------------


class Job(Base):
    __tablename__ = 'jobs'

    Job_ID = Column(String, primary_key=True)
    Job_Title = Column(String)
    Company_Name = Column(String)
    Location = Column(String)
    Posting_Date = Column(String)
    Job_URL = Column(String)
    Company_URL = Column(String)
    Salary = Column(String)
    Tags = Column(String)
    Job_Type = Column(String)

    # ------------------------------
    # Helper / utility methods
    # ------------------------------
    def to_dict(self) -> dict:
        """Return a serialisable representation of the Job record."""
        return {
            "id": self.Job_ID,
            "title": self.Job_Title,
            "company": self.Company_Name,
            "location": self.Location,
            "posting_date": self.Posting_Date,
            "job_type": self.Job_Type,
            "tags": self.Tags,
            "url": self.Job_URL,
            "company_url": self.Company_URL,
            "salary": self.Salary,
        }

    # Provide a convenience class-level query attribute similar to Flask-SQLAlchemy
    @classmethod
    def query(cls):  # type: ignore
        """Shorthand to enable Job.query semantics."""
        return session.query(cls)

# --- 2. PostgreSQL connection (Neon-compatible) ---
# Preferred: full URL in .env (e.g., DATABASE_URL="postgresql+psycopg2://user:pass@host/db?sslmode=require")
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback: build from individual parts
    DB_USER = os.getenv("NEON_USER", "")
    DB_PASS = os.getenv("NEON_PASS", "")
    DB_HOST = os.getenv("NEON_HOST", "localhost")
    DB_PORT = os.getenv("NEON_PORT", "5432")
    DB_NAME = os.getenv("NEON_DB", "postgres")
    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=require"

engine = create_engine(DATABASE_URL)

# Create table if it doesn't exist
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# --- 3. Optional CSV seed ---
csv_path = Path(__file__).with_name("actuary_jobs.csv")

if csv_path.exists():
    df = pd.read_csv(csv_path)
    for _, row in df.iterrows():
        job = Job(
            Job_ID=str(row['Job ID']),  # ensure varchar comparison uses string
            Job_Title=row['Job Title'],
            Company_Name=row['Company Name'],
            Location=row['Location'],
            Posting_Date=row['Posting Date'],
            Job_URL=row['Job URL'],
            Company_URL=row['Company URL'],
            Salary=row['Salary'],
            Tags=row['Tags'],
            Job_Type=row['Job Type']
        )
        session.merge(job)
    session.commit()
    print(f"✅ Uploaded {len(df)} jobs to database from CSV seed.")

# --- 4. (Optional) Debug print of first few rows ---
try:
    print("\n=== Sample jobs ===")
    for job in session.query(Job).order_by(Job.Job_ID).limit(10):
        print(f"{job.Job_ID:>6}  {job.Job_Title[:40]:40}  {job.Company_Name}")
except Exception:
    pass  # ignore errors if the table is empty


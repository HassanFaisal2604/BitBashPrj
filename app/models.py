import pandas as pd
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

# --- 3. Read CSV and upload ---
csv_path = "app/actuary_jobs.csv"
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
    session.merge(job)  # merge avoids duplicate primary key error
session.commit()
print(f"✅ Uploaded {len(df)} jobs to database.")

# --- 4. Fetch and print for testing    
print("\n=== Jobs in database ===")
for job in session.query(Job).order_by(Job.Job_ID).limit(10):   # change limit as you like
    print(f"{job.Job_ID:>6}  {job.Job_Title[:40]:40}  {job.Company_Name}")


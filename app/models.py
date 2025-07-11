import pandas as pd
from sqlalchemy import create_engine, Column, String
# SQLAlchemy 2.0+: import declarative_base from orm to avoid deprecation warning
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os

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
# Replace these with your Neon.tech DB credentials
DB_USER = os.getenv("NEON_USER", "neondb_owner")
DB_PASS = os.getenv("NEON_PASS", "npg_mH3QnYdtP9hS")
DB_HOST = os.getenv("NEON_HOST", "your_db_host")
DB_PORT = os.getenv("NEON_PORT", "5432")
DB_NAME = os.getenv("NEON_DB", "your_db_name")

DATABASE_URL = "postgresql+psycopg2://neondb_owner:npg_mH3QnYdtP9hS@ep-steep-rice-ae1u38d4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
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


from sqlalchemy import create_engine, Column, String, UniqueConstraint, DateTime
# SQLAlchemy 2.0+: import declarative_base from orm to avoid deprecation warning
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
# Load env vars
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# --- 1. SQLAlchemy setup ---
Base = declarative_base()

# --------------------------------------------------
#   Job ORM model
# --------------------------------------------------


class Job(Base):
    __tablename__ = 'jobs'

    __table_args__ = (
        UniqueConstraint('Job_Title', 'Company_Name', name='uq_title_company'),
    )

    Job_ID = Column(String, primary_key=True)
    Job_Title = Column(String, nullable=False)
    Company_Name = Column(String, nullable=False)
    Location = Column(String, nullable=False)
    Posting_Date = Column(String, nullable=False)
    Job_URL = Column(String)
    Company_URL = Column(String)
    Salary = Column(String)
    Tags = Column(String, nullable=False)
    Job_Type = Column(String, nullable=False)
    scraped_on = Column(DateTime, default=datetime.utcnow, nullable=False)

    # ------------------------------
    # Helper / utility methods
    # ------------------------------
    def to_dict(self) -> dict:
        """Return a serialisable representation of the Job record."""
        # Pre-compute scraped_on to avoid repeated isinstance checks
        scraped_on_iso = None
        if self.scraped_on is not None:
            scraped_on_iso = self.scraped_on.isoformat()
            
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
            "scraped_on": scraped_on_iso,
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

# Optimize engine configuration for better performance
engine = create_engine(
    DATABASE_URL,
    pool_size=10,          # Connection pool size
    max_overflow=20,       # Additional connections beyond pool_size
    pool_pre_ping=True,    # Validate connections before use
    pool_recycle=3600,     # Recycle connections every hour
)

# Create table if it doesn't exist
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# --- 3. Database initialization ---
# Database tables are created automatically via Base.metadata.create_all(engine)

# --- 4. (Optional) Debug print of first few rows ---
try:
    print("\n=== Sample jobs ===")
    for job in session.query(Job).order_by(Job.Job_ID).limit(10):
        print(f"{job.Job_ID:>6}  {job.Job_Title[:40]:40}  {job.Company_Name}")
except Exception:
    pass  # ignore errors if the table is empty


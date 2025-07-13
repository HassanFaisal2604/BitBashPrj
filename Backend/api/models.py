from sqlalchemy import create_engine, Column, String, UniqueConstraint, DateTime, Index, Integer, Float
# SQLAlchemy 2.0+: import declarative_base from orm to avoid deprecation warning
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
# Load env vars
import os
from dotenv import load_dotenv
from datetime import datetime
import re

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
        # Add indexes for performance
        Index('idx_location', 'Location'),
        Index('idx_job_type', 'Job_Type'),
        Index('idx_tags', 'Tags'),
        Index('idx_scraped_on', 'scraped_on'),
        Index('idx_salary_numeric', 'salary_numeric'),
        Index('idx_posting_age_hours', 'posting_age_hours'),
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
    # Add computed columns for performance
    salary_numeric = Column(Float, default=0.0)  # Cached numeric salary for sorting
    posting_age_hours = Column(Float, default=0.0)  # Cached posting age for sorting

    # ------------------------------
    # Helper / utility methods
    # ------------------------------
    def _compute_salary_numeric(self) -> float:
        """Convert salary text to a comparable float (USD)."""
        salary_value = str(self.Salary or "")
        if not salary_value or 'not specified' in salary_value.lower():
            return 0.0

        # Remove commas for cleaner numeric extraction
        s_clean = salary_value.replace(',', '')
        # Find all numeric parts (handles ranges "110-150k" or "$120k")
        nums = re.findall(r"\d+(?:\.\d+)?", s_clean)
        if not nums:
            return 0.0

        values = []
        idx = 0
        for num in nums:
            # Locate the position of this number in the original string to detect following 'k'
            pos = s_clean.find(num, idx)
            idx = pos + len(num)
            # Check if 'k' appears immediately after the number
            multiplier = 1_000 if idx < len(s_clean) and s_clean[idx].lower() == 'k' else 1
            values.append(float(num) * multiplier)

        # Use average of range if multiple numbers; otherwise the single value
        return sum(values) / len(values)
        
    def _compute_posting_age_hours(self) -> float:
        """Return approximate hours since posting based on textual Posting_Date."""
        posting_date_value = str(self.Posting_Date or "")
        if not posting_date_value:
            return float('inf')  # Treat unknown as oldest

        s_low = posting_date_value.lower().strip()

        # Handle keywords
        if 'recent' in s_low:
            return 0.0
        if 'just now' in s_low:
            return 0.0
        # --- Abbreviated units ---
        # Hours: e.g., "22h ago"
        m = re.match(r"(\d+)\s*h", s_low)
        if m:
            return float(int(m.group(1)))

        # Days: "17d ago"
        m = re.match(r"(\d+)\s*d", s_low)
        if m:
            return float(int(m.group(1)) * 24)

        # Weeks: "3w ago"
        m = re.match(r"(\d+)\s*w", s_low)
        if m:
            return float(int(m.group(1)) * 24 * 7)

        # Verbose units
        if 'hour' in s_low or 'hr' in s_low:
            m = re.search(r"(\d+)", s_low)
            hrs = int(m.group(1)) if m else 1
            return float(hrs)
        if 'day' in s_low:
            m = re.search(r"(\d+)", s_low)
            days = int(m.group(1)) if m else 1
            return float(days * 24)
        if 'week' in s_low:
            m = re.search(r"(\d+)", s_low)
            weeks = int(m.group(1)) if m else 1
            return float(weeks * 24 * 7)

        # Attempt to parse as date string YYYY-MM-DD or ISO format
        try:
            from dateutil import parser as dateparser  # type: ignore
            dt = dateparser.parse(posting_date_value)
            
            # Make both datetimes timezone-naive for comparison
            if dt.tzinfo is not None:
                dt = dt.replace(tzinfo=None)  # Remove timezone info
            
            age_hours = (datetime.utcnow() - dt).total_seconds() / 3600.0
            
            # Handle future dates (negative age) - assign a very high value but not infinity
            # This ensures they appear last in both newest-first and oldest-first sorting
            if age_hours < 0:
                return 999999.0  # Very high but finite value
            
            return age_hours
        except Exception:
            pass

        # Fallback: high value so that unknowns appear last in newest-first
        return float('inf')
        
    def update_computed_fields(self):
        """Update computed fields for performance optimization."""
        self.salary_numeric = self._compute_salary_numeric()
        self.posting_age_hours = self._compute_posting_age_hours()

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
        return get_session().query(cls)

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

# Ensure DATABASE_URL is not None
if not DATABASE_URL:
    raise ValueError("DATABASE_URL must be set in environment variables")

# Global variables for engine and session
_engine = None
_session = None

def get_engine():
    """Get or create the database engine."""
    global _engine
    if _engine is None:
        # Ensure DATABASE_URL is available
        if not DATABASE_URL:
            raise ValueError("DATABASE_URL must be set in environment variables")
        # Optimize engine configuration for serverless
        _engine = create_engine(
            DATABASE_URL,
            pool_size=1,           # Smaller pool for serverless
            max_overflow=0,        # No overflow for serverless
            pool_pre_ping=True,    # Validate connections before use
            pool_recycle=300,      # Recycle connections every 5 minutes
        )
        # Create table if it doesn't exist
        Base.metadata.create_all(_engine)
    return _engine

def get_session():
    """Get or create the database session."""
    global _session
    if _session is None:
        Session = sessionmaker(bind=get_engine())
        _session = Session()
    return _session

# For backward compatibility
session = get_session()


import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Centralised application settings loaded from .env or reasonable defaults."""

    # --- General configuration ---
    SECRET_KEY = os.getenv('SECRET_KEY', 'a_very_secret_default_key')

    # --- Database configuration ---
    DATABASE_URL = os.getenv('DATABASE_URL')

    # --- Scraper configuration ---
    # Number of pages the Selenium scraper should process. Defaults to `2`.
    PAGES_TO_SCRAPE = int(os.getenv('PAGES_TO_SCRAPE', '2'))

    # Add future configuration variables below as needed
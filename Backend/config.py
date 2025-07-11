import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    """Centralised application settings loaded from .env or reasonable defaults."""

    # --- General configuration ---
    SECRET_KEY = os.getenv('SECRET_KEY', 'a_very_secret_default_key')

    # --- Database configuration ---
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- Scraper configuration ---
    # Number of pages the Selenium scraper should process. Defaults to `2`.
    PAGES_TO_SCRAPE = int(os.getenv('PAGES_TO_SCRAPE', '2'))

    # Add future configuration variables below as needed
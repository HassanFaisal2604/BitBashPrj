from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
import time
import re
from datetime import datetime

# Ensure parent Backend directory is on PYTHONPATH then import models directly
import sys, pathlib

project_root = pathlib.Path(__file__).resolve().parent.parent.parent  # BitBashPrj/
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
from Backend.api.models import Job, session  # type: ignore


# ---------- Helper utilities ----------
def _strip_leading_symbols(txt: str) -> str:
    """Remove leading emojis or other non-alphanumeric symbols while preserving letters/digits."""
    return re.sub(r"^[^\w]+", "", txt).strip()

# --- 1. SETUP SELENIUM ---
# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)

# Initialize the Chrome WebDriver
driver = webdriver.Chrome(options=chrome_options)

driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

def close_popups():
    """Attempt to close any modal/pop-up that may obscure the page."""
    close_selectors = [
        "button[type='button'].rounded-md.bg-white.text-gray-400",
        "button[aria-label*='Close']",
        "button[title*='Close']",
        "button[class*='close']",
        "[data-testid*='close']",
    ]
    for sel in close_selectors:
        try:
            btn = driver.find_element(By.CSS_SELECTOR, sel)
            if btn.is_displayed():
                btn.click()
                time.sleep(1)
                break
        except NoSuchElementException:
            continue

# --- 2. LOAD THE WEBPAGE ---
url = "https://www.actuarylist.com/"
print(f"Loading {url}...")

# Set the number of pages to scrape (default: 2). Adjust here if you need more pages.
pages_to_scrape = 2

for current_page in range(1, pages_to_scrape + 1):
    page_url = url if current_page == 1 else f"{url}?page={current_page}"
    print(f"Navigating to {page_url} …")
    driver.get(page_url)
    time.sleep(5)  # allow content to settle
    close_popups()

    # Get all potential cards then filter those containing company element
    potential_cards = driver.find_elements(By.CSS_SELECTOR, "div[class*='job-card']")
    print(f"Page {current_page}: Found {len(potential_cards)} potential cards")

    job_cards = []
    company_css = "p[class*='job-card__company']"
    for card in potential_cards:
        if card.find_elements(By.CSS_SELECTOR, company_css):
            job_cards.append(card)
    print(f"Page {current_page}: Filtered to {len(job_cards)} valid cards")

    for card in job_cards:
        try:
            # Company
            company_name = card.find_element(By.CSS_SELECTOR, company_css).text.strip()
            # Title
            title_css = "p[class*='job-card__position']"
            job_title = card.find_element(By.CSS_SELECTOR, title_css).text.strip()
            job_title = re.sub(r"^(FEATURED|NEW)\s*", "", job_title, flags=re.IGNORECASE)
            
            # Skip jobs with missing critical data
            if not job_title or not company_name:
                print(f"Skipping job with missing title or company: '{job_title}' - '{company_name}'")
                continue
                
            # LOCATION block: limit to the dedicated locations container to exclude tags
            loc_container_css = "div[class*='job-card__locations']"
            location = ""
            try:
                loc_container = card.find_element(By.CSS_SELECTOR, loc_container_css)
                # country
                country_css = "a[class*='job-card__country']"
                country_name = _strip_leading_symbols(
                    loc_container.find_element(By.CSS_SELECTOR, country_css).text
                )
                # cities
                cities_css = "a[class*='job-card__location']"
                cities = [
                    _strip_leading_symbols(c.text)
                    for c in loc_container.find_elements(By.CSS_SELECTOR, cities_css)
                    if c.text.strip()
                ]
                location_parts = [country_name] + cities if country_name else cities
                location = ", ".join(location_parts)
            except NoSuchElementException:
                location = "Remote"  # Default fallback
                
            # Skip jobs with no location data
            if not location:
                print(f"Skipping job with missing location: '{job_title}' at '{company_name}'")
                continue
                
            # Date
            date_css = "p[class*='posted-on']"
            posting_date = card.find_element(By.CSS_SELECTOR, date_css).text.strip()
            if not posting_date:
                posting_date = "Recently posted"  # Default fallback
                
            # URL & ID
            job_link = card.find_element(By.CSS_SELECTOR, "a.Job_job-page-link__a5I5g").get_attribute("href")
            m = re.search(r"/actuarial-jobs/(\d+)", job_link)
            job_id = m.group(1) if m else ""
            
            # Skip jobs without valid ID
            if not job_id:
                print(f"Skipping job without valid ID: '{job_title}' at '{company_name}'")
                continue
                
            company_link_elems = card.find_elements(By.CSS_SELECTOR, "a[href*='/actuarial-employers/']")
            company_url = company_link_elems[0].get_attribute("href") if company_link_elems else ""
            # Salary
            sal_elems = card.find_elements(By.CSS_SELECTOR, "p[class*='job-card__salary']")
            salary_raw = sal_elems[0].text.strip() if sal_elems else "Not specified"
            salary = salary_raw.replace("💰", "").strip()
            if not salary:
                salary = "Not specified"
                
            # Tags
            tags_elems = card.find_elements(By.CSS_SELECTOR, "div[class*='job-card__tags'] a")
            tags_list = [t.text.strip() for t in tags_elems if t.text.strip()]
            tags = ", ".join(tags_list) if tags_list else "General"

            # JOB TYPE determination
            job_type = "Full-Time"  # default
            tags_lower = ",".join(tags_list).lower()
            if "intern" in tags_lower:
                job_type = "Internship"
            elif "contract" in tags_lower:
                job_type = "Contract"
            elif "part-time" in tags_lower or "part time" in tags_lower:
                job_type = "Part-Time"

            job_obj = Job(
                Job_ID=job_id,
                Job_Title=job_title,
                Company_Name=company_name,
                Location=location,
                Posting_Date=posting_date,
                Job_URL=job_link,
                Company_URL=company_url,
                Salary=salary,
                Tags=tags,
                Job_Type=job_type,
                scraped_on=datetime.utcnow(),
            )

            # Attempt to merge the job into the database
            try:
                session.merge(job_obj)          # DB UPSERT
                session.flush()                 # Force immediate insert/update
            except Exception as e:
                session.rollback()              # Clear the failed transaction
                print(f'Skipping job {job_id}: {e}')
            # Commit is handled outside the loop
        except NoSuchElementException:
            continue
    
    if current_page == pages_to_scrape:
        break  # finished requested pages; loop will exit naturally

# Clean up the browser once scraping is complete
driver.quit()

# Commit all upserts to the database (default behaviour)
session.commit()

session.close()
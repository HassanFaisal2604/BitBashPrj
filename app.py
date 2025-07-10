from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
import pandas as pd
import time
import re

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

# --- 2. LOAD THE WEBPAGE ---
url = "https://www.actuarylist.com/"
print(f"Loading {url}...")


driver.get(url)
wait = WebDriverWait(driver, 15)

try:
    print("Waiting for page to load...")
    time.sleep(5)

    # Close popup if present
    close_selectors = [
        "button[type='button'].rounded-md.bg-white.text-gray-400",
        "button[aria-label*='Close']",
        "button[title*='Close']",
        "button[class*='close']",
        "[data-testid*='close']"
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

    # Get all potential cards then filter those containing company element
    potential_cards = driver.find_elements(By.CSS_SELECTOR, "div[class*='job-card']")
    print(f"Found {len(potential_cards)} potential cards")

    job_cards = []
    company_css = "p[class*='job-card__company']"
    for card in potential_cards:
        if card.find_elements(By.CSS_SELECTOR, company_css):
            job_cards.append(card)
    print(f"Filtered to {len(job_cards)} valid cards")

    job_data = []
    for idx, card in enumerate(job_cards[:20]):
        try:
            # Company
            company_name = card.find_element(By.CSS_SELECTOR, company_css).text.strip()
            # Title
            title_css = "p[class*='job-card__position']"
            job_title = card.find_element(By.CSS_SELECTOR, title_css).text.strip()
            job_title = re.sub(r"^(FEATURED|NEW)\s*", "", job_title, flags=re.IGNORECASE)
            # LOCATION block: limit to the dedicated locations container to exclude tags
            loc_container_css = "div[class*='job-card__locations']"
            location = ""
            try:
                loc_container = card.find_element(By.CSS_SELECTOR, loc_container_css)
                # country
                country_css = "a[class*='job-card__country']"
                country_name = loc_container.find_element(By.CSS_SELECTOR, country_css).text.strip()
                country_name = re.sub(r"^[^A-Za-z]*", "", country_name)  # strip flag emoji
                # cities
                cities_css = "a[class*='job-card__location']"
                cities = [c.text.strip() for c in loc_container.find_elements(By.CSS_SELECTOR, cities_css) if c.text.strip()]
                location_parts = [country_name] + cities if country_name else cities
                location = ", ".join(location_parts)
            except NoSuchElementException:
                location = ""
            # Date
            date_css = "p[class*='posted-on']"
            posting_date = card.find_element(By.CSS_SELECTOR, date_css).text.strip()
            # URL & ID
            job_link = card.find_element(By.CSS_SELECTOR, "a.Job_job-page-link__a5I5g").get_attribute("href")
            m = re.search(r"/actuarial-jobs/(\d+)", job_link)
            job_id = m.group(1) if m else ""
            company_link_elems = card.find_elements(By.CSS_SELECTOR, "a[href*='/actuarial-employers/']")
            company_url = company_link_elems[0].get_attribute("href") if company_link_elems else ""
            # Salary
            sal_elems = card.find_elements(By.CSS_SELECTOR, "p[class*='job-card__salary']")
            salary = sal_elems[0].text.strip() if sal_elems else "Not specified"
            # Tags
            tags_elems = card.find_elements(By.CSS_SELECTOR, "div[class*='job-card__tags'] a")
            tags_list = [t.text.strip() for t in tags_elems if t.text.strip()]
            tags = ", ".join(tags_list)

            # JOB TYPE determination
            job_type = "Full-Time"  # default
            tags_lower = ",".join(tags_list).lower()
            if "intern" in tags_lower:
                job_type = "Internship"
            elif "contract" in tags_lower:
                job_type = "Contract"
            elif "part-time" in tags_lower or "part time" in tags_lower:
                job_type = "Part-Time"

            job_data.append({
                "Job Title": job_title,
                "Company Name": company_name,
                "Location": location,
                "Posting Date": posting_date,
                "Job URL": job_link,
                "Company URL": company_url,
                "Salary": salary,
                "Tags": tags,
                "Job Type": job_type,
                "Job ID": job_id
            })
        except NoSuchElementException:
            continue

finally:
    driver.quit()

if job_data:
    df = pd.DataFrame(job_data)
    df.to_csv("actuary_jobs.csv", index=False)
    print(df.head())
else:
    print("No job data collected")
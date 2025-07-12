from flask import Blueprint, jsonify, request

# Import Job model and database session from models.py
from .models import Job, session
from datetime import datetime

# All routes defined in this file will automatically be prefixed with /api (set in run.py)
bp = Blueprint('api', __name__)


# ==============================================================================
# 1. RETRIEVE JOBS (GET /api/jobs) with Filtering & Sorting
# ==============================================================================
@bp.route('/jobs', methods=['GET'])
def get_jobs():
    """Fetch a list of jobs with optional filtering and sorting."""

    # Begin with base query
    query = Job.query()

    # --- Filtering ---
    job_type = request.args.get('job_type')
    if job_type:
        query = query.filter(Job.Job_Type.ilike(f"%{job_type}%"))

    location = request.args.get('location')
    if location:
        query = query.filter(Job.Location.ilike(f"%{location}%"))

    tag = request.args.get('tag')
    if tag:
        query = query.filter(Job.Tags.ilike(f"%{tag}%"))

    # --- Sorting ---
    sort = request.args.get('sort', 'posting_date_desc')

    # Helper to extract numeric value from salary strings like "$134k-$161k"
    import re
    from typing import cast

    def _salary_to_number(s: str) -> float:
        """Convert salary text to a comparable float (USD)."""
        if not s or 'not specified' in s.lower():
            return 0.0

        # Remove commas for cleaner numeric extraction
        s_clean = s.replace(',', '')
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
            multiplier = 1_000 if pos < len(s_clean) and s_clean[pos:pos+1].lower() == 'k' else 1
            values.append(float(num) * multiplier)

        # Use average of range if multiple numbers; otherwise the single value
        return sum(values) / len(values)

    if sort in ('posting_date_asc', 'posting_date_desc'):
        # Fetch all first; Posting_Date is stored as human-readable text, so we parse it.
        jobs = query.all()

        def _posting_age_hours(s: str) -> float:
            """Return approximate hours since posting based on textual Posting_Date."""
            if not s:
                return float('inf')  # Treat unknown as oldest

            s_low = s.lower().strip()

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

            # Attempt to parse as date string YYYY-MM-DD
            try:
                from dateutil import parser as dateparser  # type: ignore
                dt = dateparser.parse(s)
                age_hours = (datetime.utcnow() - dt).total_seconds() / 3600.0
                return age_hours
            except Exception:
                pass

            # Fallback: high value so that unknowns appear last in newest-first
            return float('inf')

        # Newest first – smaller age means more recent
        reverse = sort == 'posting_date_asc'  # older first should reverse
        jobs.sort(key=lambda j: _posting_age_hours(cast(str, j.Posting_Date) if getattr(j, 'Posting_Date', None) is not None else ''), reverse=reverse)
    elif sort in ('salary_high', 'salary_low'):
        # Fetch first then sort in Python because Salary is stored as text
        jobs = query.all()
        reverse = sort == 'salary_high'  # high to low
        jobs.sort(key=lambda j: _salary_to_number(cast(str, j.Salary) if getattr(j, 'Salary', None) is not None else ''), reverse=reverse)
    else:
        # Default sorting (newest first)
        query = query.order_by(Job.scraped_on.desc())
        jobs = query.all()

    # Convert to dict once sorting is finalized
    jobs_data = [job.to_dict() for job in jobs]
    
    # Add cache headers for better frontend performance
    response = jsonify(jobs_data)
    response.headers['Cache-Control'] = 'public, max-age=60'  # Cache for 1 minute
    return response


# ==============================================================================
# 2. CREATE A JOB (POST /api/jobs)
# ==============================================================================
@bp.route('/jobs', methods=['POST'])
def create_job():
    data = request.get_json(silent=True)
    required_fields = {'title', 'company', 'location'}

    if not data or not required_fields.issubset(data):
        return jsonify({
            'error': 'Missing required fields: title, company, and location are required.'
        }), 400

    # Validate that required fields are not empty strings
    for field in required_fields:
        if not data[field] or not data[field].strip():
            return jsonify({
                'error': f'Field "{field}" cannot be empty.'
            }), 400

    # Optimized duplicate check - only check if both title and company are provided
    title = data['title'].strip()
    company = data['company'].strip()
    
    # Use EXISTS for better performance than .first()
    from sqlalchemy import exists
    duplicate_exists = session.query(
        exists().where(
            (Job.Job_Title == title) & (Job.Company_Name == company)
        )
    ).scalar()
    
    if duplicate_exists:
        return jsonify({'error': 'A job with the same title and company already exists.'}), 409

    from uuid import uuid4
    new_id = str(uuid4())

    # Clean and validate data
    tags = data.get('tags', '').strip()
    if not tags:
        tags = 'General'
    
    salary = data.get('salary', '').strip()
    if not salary:
        salary = 'Not specified'
        
    posting_date = data.get('posting_date', '').strip()
    if not posting_date:
        posting_date = 'Recently posted'

    new_job = Job(
        Job_ID=new_id,
        Job_Title=title,
        Company_Name=company,
        Location=data['location'].strip(),
        Posting_Date=posting_date,
        Job_Type=data.get('job_type', 'Full-Time'),
        Tags=tags,
        Job_URL=data.get('url', '#'),
        Company_URL=data.get('company_url', ''),
        Salary=salary,
        scraped_on=datetime.utcnow(),
    )

    session.add(new_job)
    session.commit()

    return jsonify(new_job.to_dict()), 201


# ==============================================================================
# 3. RETRIEVE A SINGLE JOB (GET /api/jobs/<id>)
# ==============================================================================
@bp.route('/jobs/<string:job_id>', methods=['GET'])
def get_job(job_id):
    job = session.get(Job, job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    return jsonify(job.to_dict())


# ==============================================================================
# 4. UPDATE A JOB (PUT /api/jobs/<id>)
# ==============================================================================
@bp.route('/jobs/<string:job_id>', methods=['PUT'])
def update_job(job_id):
    job = session.get(Job, job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    data = request.get_json(silent=True) or {}

    # Validate that if provided, required fields are not empty
    for field in ['title', 'company', 'location']:
        if field in data and (not data[field] or not data[field].strip()):
            return jsonify({
                'error': f'Field "{field}" cannot be empty.'
            }), 400

    # Prepare update dictionary for bulk update
    updates = {}
    
    if 'title' in data:
        updates['Job_Title'] = data['title'].strip()
    if 'company' in data:
        updates['Company_Name'] = data['company'].strip()
    if 'location' in data:
        updates['Location'] = data['location'].strip()
    if 'job_type' in data:
        updates['Job_Type'] = data['job_type']
    if 'tags' in data:
        tags_value = data['tags']
        updates['Tags'] = tags_value.strip() if tags_value and tags_value.strip() else 'General'
    if 'salary' in data:
        salary_value = data['salary']
        updates['Salary'] = salary_value.strip() if salary_value and salary_value.strip() else 'Not specified'

    # Apply updates if any
    if updates:
        for attr, value in updates.items():
            setattr(job, attr, value)

    session.commit()
    return jsonify(job.to_dict())


# ==============================================================================
# 5. DELETE A JOB (DELETE /api/jobs/<id>)
# ==============================================================================
@bp.route('/jobs/<string:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = session.get(Job, job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    session.delete(job)
    session.commit()

    return '', 204

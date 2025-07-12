from flask import Blueprint, jsonify, request
from functools import lru_cache
from datetime import datetime, timedelta
import hashlib

# Import Job model and database session from models.py
from .models import Job, session

# All routes defined in this file will automatically be prefixed with /api (set in run.py)
bp = Blueprint('api', __name__)

# Simple in-memory cache for query results
_query_cache = {}
_cache_timeout = 60  # Cache for 60 seconds

def _get_cache_key(params):
    """Generate a cache key from query parameters."""
    sorted_params = sorted(params.items())
    param_str = '&'.join(f"{k}={v}" for k, v in sorted_params)
    return hashlib.md5(param_str.encode()).hexdigest()

def _is_cache_valid(timestamp):
    """Check if cache entry is still valid."""
    return (datetime.utcnow() - timestamp).total_seconds() < _cache_timeout

# ==============================================================================
# 1. RETRIEVE JOBS (GET /api/jobs) with Filtering & Sorting - OPTIMIZED
# ==============================================================================
@bp.route('/jobs', methods=['GET'])
def get_jobs():
    """Fetch a list of jobs with optional filtering and sorting - OPTIMIZED VERSION."""
    
    # Generate cache key from request parameters
    cache_key = _get_cache_key(request.args.to_dict())
    
    # Check cache first
    if cache_key in _query_cache:
        cached_data, timestamp = _query_cache[cache_key]
        if _is_cache_valid(timestamp):
            response = jsonify(cached_data)
            response.headers['Cache-Control'] = 'public, max-age=60'
            response.headers['X-Cache'] = 'HIT'
            return response

    # Begin with base query
    query = Job.query()

    # --- Filtering (using indexed columns) ---
    job_type = request.args.get('job_type')
    if job_type:
        query = query.filter(Job.Job_Type.ilike(f"%{job_type}%"))

    location = request.args.get('location')
    if location:
        query = query.filter(Job.Location.ilike(f"%{location}%"))

    tag = request.args.get('tag')
    if tag:
        query = query.filter(Job.Tags.ilike(f"%{tag}%"))

    # --- Database-level Sorting (much faster than Python sorting) ---
    sort = request.args.get('sort', 'posting_date_desc')

    if sort == 'posting_date_desc':
        # Newest first - use computed column for fast sorting
        query = query.order_by(Job.posting_age_hours.asc())  # Lower hours = more recent
    elif sort == 'posting_date_asc':
        # Oldest first
        query = query.order_by(Job.posting_age_hours.desc())
    elif sort == 'salary_high':
        # High to low salary - use computed column
        query = query.order_by(Job.salary_numeric.desc())
    elif sort == 'salary_low':
        # Low to high salary
        query = query.order_by(Job.salary_numeric.asc())
    else:
        # Default sorting (newest first by scraped_on)
        query = query.order_by(Job.scraped_on.desc())

    # Execute query once with all filters and sorting applied
    jobs = query.all()

    # Convert to dict (this is still needed for JSON serialization)
    jobs_data = [job.to_dict() for job in jobs]
    
    # Cache the result
    _query_cache[cache_key] = (jobs_data, datetime.utcnow())
    
    # Clean old cache entries (simple cleanup)
    if len(_query_cache) > 100:  # Limit cache size
        expired_keys = [
            k for k, (_, timestamp) in _query_cache.items() 
            if not _is_cache_valid(timestamp)
        ]
        for k in expired_keys:
            del _query_cache[k]
    
    # Add cache headers for better frontend performance
    response = jsonify(jobs_data)
    response.headers['Cache-Control'] = 'public, max-age=60'  # Cache for 1 minute
    response.headers['X-Cache'] = 'MISS'
    return response

# ==============================================================================
# 2. CREATE A JOB (POST /api/jobs) - OPTIMIZED
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
    
    # Compute performance fields
    new_job.update_computed_fields()

    session.add(new_job)
    session.commit()
    
    # Clear cache since data has changed
    _query_cache.clear()

    return jsonify(new_job.to_dict()), 201
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
    needs_compute_update = False
    
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
        needs_compute_update = True  # Salary change requires recomputing numeric value

    # Apply updates if any
    if updates:
        for attr, value in updates.items():
            setattr(job, attr, value)
        
        # Update computed fields if salary changed
        if needs_compute_update:
            job.update_computed_fields()

    session.commit()
    
    # Clear cache since data has changed
    _query_cache.clear()
    
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
    
    # Clear cache since data has changed
    _query_cache.clear()

    return '', 204

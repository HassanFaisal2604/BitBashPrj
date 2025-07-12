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
    sort = request.args.get('sort')
    if sort == 'posting_date_asc':
        query = query.order_by(Job.scraped_on.asc())
    else:
        query = query.order_by(Job.scraped_on.desc())

    # Execute query and convert to dict in one go for better performance
    jobs = query.all()
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

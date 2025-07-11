from flask import Blueprint, jsonify, request

# Import Job model and database session from models.py
from .models import Job, session

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
        query = query.order_by(Job.Job_ID.asc())  # Proxy for oldest first
    else:  # Default & posting_date_desc
        query = query.order_by(Job.Job_ID.desc())  # Newest first (approx.)

    jobs = query.all()
    return jsonify([job.to_dict() for job in jobs])


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

    # Generate a new ID (use max+1 or uuid)

    # Prevent duplicate (same title & company)
    existing = Job.query().filter(
        Job.Job_Title == data['title'],
        Job.Company_Name == data['company']
    ).first()
    if existing:
        return jsonify({'error': 'A job with the same title and company already exists.'}), 409

    from uuid import uuid4
    new_id = str(uuid4())

    new_job = Job(
        Job_ID=new_id,
        Job_Title=data['title'],
        Company_Name=data['company'],
        Location=data['location'],
        Posting_Date=data.get('posting_date', 'N/A'),
        Job_Type=data.get('job_type', 'Full-Time'),
        Tags=data.get('tags', ''),
        Job_URL=data.get('url', '#'),
        Company_URL=data.get('company_url', ''),
        Salary=data.get('salary', 'Not specified'),
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

    # Update only provided fields
    job.Job_Title = data.get('title', job.Job_Title)
    job.Company_Name = data.get('company', job.Company_Name)
    job.Location = data.get('location', job.Location)
    job.Job_Type = data.get('job_type', job.Job_Type)
    job.Tags = data.get('tags', job.Tags)

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

import React, { useState, useEffect } from 'react'
import { Building, Plus } from 'lucide-react'
import AddJobModal from './components/AddJobModal'
import FilterBar from './components/FilterBar'
import JobCard from './components/JobCard'
import { getJobs, createJob, deleteJob as apiDeleteJob, updateJob } from './api'
import { useToast } from './components/ToastProvider.jsx'
import { useConfirm } from './components/ConfirmProvider.jsx'
import SkeletonCard from './components/SkeletonCard'

// Job type definition (for IDE hints only)
/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} title
 * @property {string} company
 * @property {string} location
 * @property {'Full-Time'|'Part-Time'|'Internship'|'Contract'} type
 * @property {string[]} tags
 * @property {string} postedDate
 * @property {string=} salary
 */

export default function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showAdd, setShowAdd] = useState(false)
  const toast = useToast()
  const confirm = useConfirm()

  // ------------------------------------------------------------
  // 1. Fetch jobs from API whenever filters / sort change
  // ------------------------------------------------------------
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError('')
        const params = {}
        if (locationFilter) params.location = locationFilter
        if (typeFilter) params.job_type = typeFilter
        if (sortBy) params.sort = sortBy === 'newest' ? 'posting_date_desc' : 'posting_date_asc'

        const data = await getJobs(params)
        const mapped = data.map((j) => ({
          id: j.id,
          title: j.title,
          company: j.company,
          location: j.location,
          type: j.job_type,
          postedDate: j.posting_date,
          salary: j.salary,
          tags: (j.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
        }))
        setJobs(mapped)
      } catch (err) {
        setError(err.message || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [locationFilter, typeFilter, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    setTypeFilter('')
    setSortBy('newest')
  }

  // ------------------------------------------------------------
  // 2. Add a new job (POST /jobs)
  // ------------------------------------------------------------
  const handleAdd = async (payload) => {
    try {
      setLoading(true)
      setError('')
      const nowIso = new Date().toISOString()
      const createdRaw = await createJob({
        title: payload.title,
        company: payload.company,
        location: payload.location,
        job_type: payload.type,
        tags: payload.tags.join(', '),
        salary: payload.salary,
        posting_date: nowIso,
      })
      const created = {
        id: createdRaw.id,
        title: createdRaw.title,
        company: createdRaw.company,
        location: createdRaw.location,
        type: createdRaw.job_type,
        postedDate: createdRaw.posting_date,
        posting_date: createdRaw.posting_date,
        salary: createdRaw.salary,
        tags: (createdRaw.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      }
      const createdWithFlash = { ...created, flash: true }
      setJobs([createdWithFlash, ...jobs])
      setTimeout(() => {
        setJobs((prev) => prev.map((j) => ({ ...j, flash: false })))
      }, 2000)
      toast('Job added successfully', 'success')
    } catch (err) {
      toast(err.message || 'Failed to add job', 'error')
    } finally {
      setLoading(false)
      setShowAdd(false)
    }
  }

  // ------------------------------------------------------------
  // 3. Delete a job (DELETE /jobs/:id)
  // ------------------------------------------------------------
  const handleDelete = async (id) => {
    const ok = await confirm('Are you sure you want to delete this job?')
    if (!ok) return
    try {
      await apiDeleteJob(id)
      setJobs(jobs.filter((j) => j.id !== id))
      toast('Job deleted', 'success')
    } catch (err) {
      toast(err.message || 'Failed to delete job', 'error')
    }
  }

  // ------------------------------------------------------------
  // 4. Update a job (PUT /jobs/:id)
  // ------------------------------------------------------------
  const handleUpdate = async (id, payload) => {
    try {
      setLoading(true)
      setError('')
      const updatedRaw = await updateJob(id, {
        title: payload.title,
        company: payload.company,
        location: payload.location,
        job_type: payload.type,
        tags: payload.tags.join(', '),
        salary: payload.salary,
      })
      const updated = {
        id: updatedRaw.id,
        title: updatedRaw.title,
        company: updatedRaw.company,
        location: updatedRaw.location,
        type: updatedRaw.job_type,
        postedDate: updatedRaw.posting_date,
        salary: updatedRaw.salary,
        tags: (updatedRaw.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      }
      setJobs(jobs.map((j) => (j.id === id ? updated : j)))
      toast('Job updated', 'success')
    } catch (err) {
      toast(err.message || 'Failed to update job', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ------------------------------------------------------------
  // 4. Client-side search & derived lists
  // ------------------------------------------------------------
  const filtered = jobs.filter((job) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.tags.some((t) => t.toLowerCase().includes(term))
    )
  })

  // The backend already sends sorted but we preserve front-end toggle as fallback
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.posting_date || b.postedDate) - new Date(a.posting_date || a.postedDate)
    return new Date(a.posting_date || a.postedDate) - new Date(b.posting_date || b.postedDate)
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ActuaryList</h1>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-5 w-5" /> Post a Job
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <FilterBar
        {...{
          searchTerm,
          setSearchTerm,
          locationFilter,
          setLocationFilter,
          typeFilter,
          setTypeFilter,
          sortBy,
          setSortBy,
          clearFilters,
        }}
      />

      {/* List */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">{filtered.length} Actuarial Positions Available</h2>
          <p className="text-gray-600">Find your next career opportunity in actuarial science</p>
        </div>
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        )}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((job) => (
              <JobCard key={job.id} job={job} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-gray-600">No jobs found. Adjust search or filters.</p>
        )}
      </main>

      {/* Modals */}
      <AddJobModal show={showAdd} onAdd={handleAdd} onClose={() => setShowAdd(false)} />
    </div>
  )
}




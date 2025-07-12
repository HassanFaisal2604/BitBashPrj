import React, { useState, useEffect } from 'react'
import { Building, Plus, Sparkles } from 'lucide-react'
import AddJobModal from './components/AddJobModal'
import FilterBar from './components/FilterBar'
import JobCard from './components/JobCard'
import { getJobs, createJob, deleteJob as apiDeleteJob, updateJob } from './api'
import { useToast } from './hooks/useToast'
import { useConfirm } from './hooks/useConfirm'
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

        // Map UI sort options to backend sort keys
        if (sortBy === 'newest') {
          params.sort = 'posting_date_desc'
        } else if (sortBy === 'oldest') {
          params.sort = 'posting_date_asc'
        } else if (sortBy === 'salary_high') {
          params.sort = 'salary_high'
        } else if (sortBy === 'salary_low') {
          params.sort = 'salary_low'
        } // 'relevance' or unknown maps to backend default

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
          url: j.url, // Add URL for external links
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
        salary: createdRaw.salary,
        tags: (createdRaw.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
        url: createdRaw.url,
      }
      const createdWithFlash = { ...created, flash: true }
      setJobs([createdWithFlash, ...jobs])
      setTimeout(() => {
        setJobs((prev) => prev.map((j) => ({ ...j, flash: false })))
      }, 2000)
      toast('Job posted successfully! 🎉', 'success')
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
      toast('Job deleted successfully', 'success')
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
        url: updatedRaw.url,
      }
      setJobs(jobs.map((j) => (j.id === id ? updated : j)))
      toast('Job updated successfully! ✨', 'success')
    } catch (err) {
      toast(err.message || 'Failed to update job', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ------------------------------------------------------------
  // 5. Client-side search & derived lists
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 w-full overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 lg:py-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ActuaryList</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Find your dream actuarial career</p>
              </div>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-white transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Post a Job</span>
              <span className="sm:hidden">Post</span>
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
          jobs: filtered, // Pass filtered jobs for count calculation
        }}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${filtered.length} Actuarial Position${filtered.length !== 1 ? 's' : ''}`}
            </h2>
            {filtered.length > 0 && (
              <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
            )}
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            {loading ? 'Fetching the latest opportunities...' : 'Find your next career opportunity in actuarial science'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-3 sm:gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium mb-2">Oops! Something went wrong</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && (
          <div className="grid gap-3 sm:gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job, index) => (
              <div
                key={job.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <JobCard job={job} onDelete={handleDelete} onUpdate={handleUpdate} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Building className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || locationFilter || typeFilter
                ? 'Try adjusting your search or filters to find more opportunities.'
                : 'Be the first to post a job opportunity!'}
            </p>
            {(searchTerm || locationFilter || typeFilter) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddJobModal show={showAdd} onAdd={handleAdd} onClose={() => setShowAdd(false)} />
    </div>
  )
}




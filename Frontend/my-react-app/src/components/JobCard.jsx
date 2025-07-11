import React from 'react'
import { Building, MapPin, Calendar, DollarSign } from 'lucide-react'
import JobActions from './JobActions'

const tagColors = {
  Pricing: 'bg-blue-100 text-blue-800',
  Health: 'bg-green-100 text-green-800',
  'Life Insurance': 'bg-purple-100 text-purple-800',
  Pensions: 'bg-orange-100 text-orange-800',
  'P&C': 'bg-red-100 text-red-800',
  'Data Science': 'bg-indigo-100 text-indigo-800',
  'Machine Learning': 'bg-pink-100 text-pink-800',
  Leadership: 'bg-yellow-100 text-yellow-800',
  Python: 'bg-gray-100 text-gray-800',
  SQL: 'bg-gray-100 text-gray-800',
  R: 'bg-gray-100 text-gray-800',
  Excel: 'bg-gray-100 text-gray-800',
  'Entry Level': 'bg-emerald-100 text-emerald-800',
}
const getTagColor = (tag) => tagColors[tag] || 'bg-slate-100 text-slate-800'

function JobCard({ job, onDelete, onUpdate }) {
  const { flash } = job
  const formatPostedDate = (dateStr) => {
    if (!dateStr) return ''
    const timestamp = Date.parse(dateStr)
    if (Number.isNaN(timestamp)) {
      return dateStr // fallback to original value if not a valid date string
    }

    const diffMs = Date.now() - timestamp
    const oneHour = 1000 * 60 * 60
    const oneDay = oneHour * 24

    if (diffMs < oneHour) {
      return 'Just now'
    }

    if (diffMs < oneDay) {
      const hrs = Math.floor(diffMs / oneHour)
      return `${hrs}h ago`
    }

    const days = Math.floor(diffMs / oneDay)
    return `${days}d ago`
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 ${flash ? 'ring-2 ring-green-400 animate-pulse' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{job.title}</h3>
          <p className="text-lg text-gray-600 mb-2 flex items-center">
            <Building className="w-4 h-4 mr-1" />
            {job.company}
          </p>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location} • {job.type}
          </div>
          {job.salary && (
            <div className="flex items-center text-sm text-green-600 font-medium mb-3">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.salary}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {formatPostedDate(job.postedDate)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {job.tags.map((tag) => (
          <span key={tag} className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}>{tag}</span>
        ))}
      </div>
      <JobActions job={job} onDelete={onDelete} onUpdate={onUpdate} />
    </div>
  )
}
export default JobCard 
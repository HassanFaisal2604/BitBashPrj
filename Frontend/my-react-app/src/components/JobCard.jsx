import React from 'react'
import { Building, MapPin, Calendar, DollarSign, ExternalLink } from 'lucide-react'
import JobActions from './JobActions'

const tagColors = {
  Pricing: 'bg-blue-100 text-blue-800 border-blue-200',
  Health: 'bg-green-100 text-green-800 border-green-200',
  'Life Insurance': 'bg-purple-100 text-purple-800 border-purple-200',
  Pensions: 'bg-orange-100 text-orange-800 border-orange-200',
  'P&C': 'bg-red-100 text-red-800 border-red-200',
  'Data Science': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Machine Learning': 'bg-pink-100 text-pink-800 border-pink-200',
  Leadership: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Python: 'bg-gray-100 text-gray-800 border-gray-200',
  SQL: 'bg-gray-100 text-gray-800 border-gray-200',
  R: 'bg-gray-100 text-gray-800 border-gray-200',
  Excel: 'bg-gray-100 text-gray-800 border-gray-200',
  'Entry Level': 'bg-emerald-100 text-emerald-800 border-emerald-200',
}
const getTagColor = (tag) => tagColors[tag] || 'bg-slate-100 text-slate-800 border-slate-200'

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
    <div className={`
      group relative bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm
      hover:shadow-md hover:border-gray-300 hover:-translate-y-1
      transition-all duration-300 ease-out
      ${flash ? 'ring-2 ring-green-400 animate-pulse' : ''}
    `}>
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {job.title}
          </h3>
          <div className="flex items-center text-base sm:text-lg text-gray-600 mb-2 hover:text-gray-800 transition-colors duration-200">
            <Building className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{job.company}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate mr-2">{job.location}</span>
            <span className="text-gray-400">•</span>
            <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              {job.type}
            </span>
          </div>
          {job.salary && (
            <div className="flex items-center text-sm text-green-600 font-medium mb-3 bg-green-50 px-3 py-1 rounded-lg w-fit">
              <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start gap-2">
          <div className="text-xs text-gray-400 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatPostedDate(job.postedDate)}</span>
          </div>
          {job.url && job.url !== '#' && (
            <button 
              onClick={() => window.open(job.url, '_blank')}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 hover:bg-blue-50 rounded-full"
              aria-label="View job posting"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tags with improved mobile layout */}
      <div className="flex flex-wrap gap-2 mb-6">
        {job.tags.slice(0, 6).map((tag, index) => (
          <span 
            key={tag} 
            className={`
              px-3 py-1 rounded-full text-xs sm:text-sm font-medium border
              transform hover:scale-105 transition-all duration-200
              ${getTagColor(tag)}
            `}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {tag}
          </span>
        ))}
        {job.tags.length > 6 && (
          <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
            +{job.tags.length - 6} more
          </span>
        )}
      </div>

      {/* Enhanced actions section */}
      <div className="transform transition-all duration-200 group-hover:translate-y-0">
        <JobActions job={job} onDelete={onDelete} onUpdate={onUpdate} />
      </div>

      {/* Subtle hover indicator */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
    </div>
  )
}

export default JobCard 
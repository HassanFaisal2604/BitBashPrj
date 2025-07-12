import React from 'react'
import { Building, MapPin, Calendar, DollarSign, ExternalLink, Clock } from 'lucide-react'
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

  const visibleTags = job.tags.slice(0, 3)
  const remainingTagsCount = job.tags.length - 3

  return (
    <div className={`
      group relative bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 
      hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300 hover:-translate-y-1
      transition-all duration-300 ease-out w-full overflow-hidden
      ${flash ? 'ring-2 ring-green-400 animate-pulse' : ''}
    `}>
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-3">
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 break-words">
            {job.title}
          </h3>
          <div className="flex items-center text-sm sm:text-base lg:text-lg text-blue-600 font-semibold mb-1 sm:mb-2 hover:text-blue-700 transition-colors duration-200 min-w-0">
            <Building className="w-4 h-4 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{job.company}</span>
          </div>
          <div className="flex items-center text-sm sm:text-sm text-gray-500 mb-2 sm:mb-3 flex-wrap gap-1">
            <div className="flex items-center min-w-0">
              <MapPin className="w-4 h-4 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <span className="text-gray-400 px-1">•</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
              {job.type}
            </span>
          </div>
          {job.salary && (
            <div className="flex items-center text-sm sm:text-sm text-green-600 font-medium mb-2 sm:mb-3 bg-green-50 px-2 sm:px-3 py-1 rounded-lg w-fit">
              <DollarSign className="w-4 h-4 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start gap-2 sm:gap-2 flex-shrink-0">
          <div className="text-xs sm:text-xs text-gray-400 flex items-center whitespace-nowrap">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatPostedDate(job.postedDate)}</span>
          </div>
          {job.url && job.url !== '#' && (
            <button 
              onClick={() => window.open(job.url, '_blank')}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-full touch-target-44 active:scale-95"
              aria-label="View job posting"
            >
              <ExternalLink className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tags with improved mobile layout */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-hidden">
        {visibleTags.map((tag, index) => (
          <span 
            key={tag} 
            className={`
              px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border
              transform hover:scale-105 transition-all duration-200 whitespace-nowrap
              ${getTagColor(tag)}
            `}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {tag}
          </span>
        ))}
        {remainingTagsCount > 0 && (
          <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors duration-200 whitespace-nowrap">
            +{remainingTagsCount} more
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
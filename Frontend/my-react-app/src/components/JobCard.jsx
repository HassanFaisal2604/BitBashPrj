import React from 'react'
import { Building, MapPin, DollarSign } from 'lucide-react'
import JobActions from './JobActions'
import { Clock } from 'lucide-react'

// New color palette mapping based on design system
const COLOR_PALETTE = {
  primaryAccent: 'text-indigo-600', // #6366F1 approximated with indigo-600
  successBg: 'bg-emerald-100',     // #10B981 approximated with emerald-100
  successText: 'text-emerald-700',
  neutralTagBg: 'bg-gray-200',     // #E5E7EB
  neutralTagText: 'text-gray-700', // #374151 approx
  borderNeutral: 'border-gray-300',
}

// Simplified tag colors following new color system
const tagColors = {
  Salary: `${COLOR_PALETTE.successBg} ${COLOR_PALETTE.successText} ${COLOR_PALETTE.borderNeutral}`,
  // Default mapping will use neutral styling defined in getTagColor()
}

// Job type badges use neutral grey background for consistency
const jobTypeBadge = {
  'Full-Time': `${COLOR_PALETTE.neutralTagBg} ${COLOR_PALETTE.neutralTagText}`,
  'Part-Time': `${COLOR_PALETTE.neutralTagBg} ${COLOR_PALETTE.neutralTagText}`,
  'Internship': `${COLOR_PALETTE.neutralTagBg} ${COLOR_PALETTE.neutralTagText}`,
  'Contract': `${COLOR_PALETTE.neutralTagBg} ${COLOR_PALETTE.neutralTagText}`,
}

// Fallback to neutral styling for all unspecified tags
const getTagColor = (tag) => tagColors[tag] || `${COLOR_PALETTE.neutralTagBg} ${COLOR_PALETTE.neutralTagText} ${COLOR_PALETTE.borderNeutral}`

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
      flex flex-col flex-grow h-full group relative bg-white border ${COLOR_PALETTE.borderNeutral} rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5
      cursor-pointer
      hover:shadow-xl hover:shadow-gray-400/60 hover:scale-[1.02] hover:border-gray-300
      transition-all duration-300 ease-out w-full overflow-hidden
      ${flash ? 'ring-2 ring-emerald-400 animate-pulse' : ''}
    `}>
      {/* Main body wrapper for sticky footer */}
      <div className="flex-grow">

        {/* Mobile-optimized header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-3">
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 leading-snug line-clamp-2 group-hover:text-indigo-600 group-hover:underline transition-colors duration-200 break-words">
              {job.title}
            </h3>
            <div className="flex items-center text-sm sm:text-base lg:text-lg text-gray-600 font-normal mb-1 sm:mb-2 min-w-0">
              <Building className="w-4 h-4 sm:w-4 sm:h-4 mr-2 flex-shrink-0 opacity-70" />
              <span className="truncate opacity-90">{job.company}</span>
            </div>
            <div className="flex items-center text-sm sm:text-sm text-gray-500 mb-1 sm:mb-2 flex-wrap gap-1">
              <div className="flex items-center min-w-0">
                <MapPin className="w-4 h-4 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              <span className="text-gray-400 px-1">•</span>
              <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${jobTypeBadge[job.type] || 'bg-gray-100 text-gray-700'}`}>
                {job.type}
              </span>
            </div>
            {/* Timestamp directly below location/type for better visibility */}
            <div className="flex items-center text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 gap-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{formatPostedDate(job.postedDate)}</span>
            </div>
            {job.salary && (
              <div className={`flex items-center text-sm sm:text-sm ${COLOR_PALETTE.successText} font-medium mb-2 sm:mb-3 ${COLOR_PALETTE.successBg} px-2 sm:px-3 py-1 rounded-lg w-fit`}>
                <DollarSign className="w-4 h-4 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{job.salary}</span>
              </div>
            )}
          </div>
          {/* Removed time display from header, will be repositioned at card bottom */}
        </div>

        {/* Tags */}
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

      </div> {/* End of flex-grow body */}

      {/* Sticky footer (no timestamp, only actions) */}
      <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-100">
        <JobActions job={job} onDelete={onDelete} onUpdate={onUpdate} inline />
      </div>

      {/* Subtle hover tint instead of vivid purple gradient */}
      <div className="absolute inset-0 rounded-xl bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-all duration-300 pointer-events-none" />
    </div>
  )
}

export default JobCard 
import React from 'react'

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="animate-pulse">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
          <div className="flex-1 min-w-0">
            {/* Job title */}
            <div className="h-6 bg-gray-200 rounded-lg mb-3 w-3/4"></div>
            
            {/* Company name */}
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            {/* Location and type */}
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mr-2"></div>
              <div className="w-1 h-1 bg-gray-200 rounded-full mr-2"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
            
            {/* Salary (sometimes present) */}
            <div className="h-6 bg-gray-200 rounded-lg w-32 mb-3"></div>
          </div>
          
          {/* Date and external link */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Tags section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-6 bg-gray-200 rounded-full"
              style={{ 
                width: `${60 + Math.random() * 40}px`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>

        {/* Actions section */}
        <div className="pt-4 border-t border-gray-100">
          <div className="hidden sm:flex justify-between items-center">
            <div className="h-9 bg-gray-200 rounded-lg w-20"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-20"></div>
          </div>
          <div className="sm:hidden flex gap-2">
            <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard 
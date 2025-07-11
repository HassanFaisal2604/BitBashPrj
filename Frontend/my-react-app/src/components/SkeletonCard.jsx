import React from 'react'

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-6 shadow-md">
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-4" />
      <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
      <div className="h-3 w-2/3 bg-gray-200 rounded mb-2" />
      <div className="flex gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="h-6 w-12 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  )
}

export default SkeletonCard 
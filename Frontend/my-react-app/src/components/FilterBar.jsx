import React, { useState } from 'react'
import { Search, MapPin, Filter, X, ChevronDown, Globe, Briefcase, Clock, DollarSign } from 'lucide-react'

function FilterBar({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  clearFilters,
  jobs = [], // Add jobs prop to calculate counts
}) {
  const [showFilters, setShowFilters] = useState(false)
  const hasActiveFilters = locationFilter || typeFilter || searchTerm

  // Calculate counts for filter options
  const locationCounts = jobs.reduce((acc, job) => {
    acc[job.location] = (acc[job.location] || 0) + 1
    return acc
  }, {})

  const typeCounts = jobs.reduce((acc, job) => {
    acc[job.type] = (acc[job.type] || 0) + 1
    return acc
  }, {})

  const locationOptions = [
    { value: '', label: 'All Locations', count: jobs.length },
    { value: 'Remote', label: 'Remote', count: locationCounts['Remote'] || 0 },
    { value: 'New York', label: 'New York', count: locationCounts['New York'] || 0 },
    { value: 'Chicago', label: 'Chicago', count: locationCounts['Chicago'] || 0 },
    { value: 'California', label: 'California', count: locationCounts['California'] || 0 },
    { value: 'Pakistan', label: 'Pakistan', count: locationCounts['Pakistan'] || 0 }
  ]

  const typeOptions = [
    { value: '', label: 'All Types', count: jobs.length },
    { value: 'Full-Time', label: 'Full-Time', count: typeCounts['Full-Time'] || 0 },
    { value: 'Part-Time', label: 'Part-Time', count: typeCounts['Part-Time'] || 0 },
    { value: 'Internship', label: 'Internship', count: typeCounts['Internship'] || 0 },
    { value: 'Contract', label: 'Contract', count: typeCounts['Contract'] || 0 },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Clock },
    { value: 'oldest', label: 'Oldest First', icon: Clock },
    { value: 'salary_high', label: 'Highest Salary', icon: DollarSign },
    { value: 'salary_low', label: 'Lowest Salary', icon: DollarSign },
  ]

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Search */}
        <div className="relative mb-4 sm:mb-4 lg:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between sm:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
              ${hasActiveFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {[locationFilter, typeFilter, searchTerm].filter(Boolean).length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button 
                onClick={clearFilters} 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-sm"
              >
                Clear all
              </button>
            )}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile filters panel */}
        <div className={`
          sm:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${showFilters ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}
        `}>
          <div className="grid grid-cols-1 gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className={`
                  appearance-none w-full bg-white border rounded-lg px-4 py-3 pr-10 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200
                  ${locationFilter ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}
                `}
              >
                {locationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`
                  appearance-none w-full bg-white border rounded-lg px-4 py-3 pr-10 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200
                  ${typeFilter ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}
                `}
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
              <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className={`
                    appearance-none bg-white border rounded-lg px-4 py-3 pr-10 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 
                    hover:border-gray-400 hover:shadow-sm
                    ${locationFilter ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-300'}
                  `}
                >
                  {locationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`
                    appearance-none bg-white border rounded-lg px-4 py-3 pr-10 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 
                    hover:border-gray-400 hover:shadow-sm
                    ${typeFilter ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-300'}
                  `}
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.count})
                    </option>
                  ))}
                </select>
                <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button 
                onClick={clearFilters} 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
              >
                Clear all filters
              </button>
            )}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400 hover:shadow-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar 
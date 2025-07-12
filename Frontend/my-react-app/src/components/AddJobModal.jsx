import React, { useState, useEffect, useRef } from 'react'
import { X, Loader2 } from 'lucide-react'
import ModalPortal from './ModalPortal'

function AddJobModal({ show, onAdd, onClose }) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    tags: '',
    salary: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Auto-focus first input to reduce user friction
  const firstInputRef = useRef(null)

  // Handle modal animations
  useEffect(() => {
    if (show) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => setIsVisible(true), 10)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [show])

  // Close on ESC (hook must be unconditional)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (show) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, show])

  if (!show) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.company || !form.location) return
    setIsSaving(true)
    const job = {
      id: Date.now().toString(),
      title: form.title,
      company: form.company,
      location: form.location,
      type: form.type,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      postedDate: new Date().toISOString(),
      salary: form.salary,
    }
    try {
      await onAdd(job)
      setForm({ title: '', company: '', location: '', type: 'Full-Time', tags: '', salary: '' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ModalPortal>
      <div className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}>
        {/* Backdrop */}
        <div 
          className={`
            absolute inset-0 bg-black transition-opacity duration-300
            ${isVisible ? 'opacity-50' : 'opacity-0'}
          `}
          onClick={onClose}
        />
        
               {/* Modal */}
        <div className={`
          relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl
          transition-all duration-300 ease-out transform
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
          ${!isVisible ? 'pointer-events-none' : ''}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900">Post New Job</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Required fields */}
            {['title', 'company', 'location'].map((field) => (
              <div key={field} className="space-y-2">
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)} *
                </label>
                <input
                  id={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  ref={field === 'title' ? firstInputRef : undefined}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
                  placeholder={`Enter ${field}...`}
                />
              </div>
            ))}

            {/* Job type */}
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Job Type
              </label>
              <select
                id="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
              >
                {['Full-Time', 'Part-Time', 'Internship', 'Contract'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Optional fields */}
            <div className="space-y-2">
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salary Range
              </label>
              <input
                id="salary"
                value={form.salary}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
                placeholder="e.g., $85,000 - $110,000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                id="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
                placeholder="e.g., Pricing, SQL, Python"
              />
              <p className="text-xs text-gray-500">Separate multiple tags with commas</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="submit"
                disabled={isSaving || !form.title || !form.company || !form.location}
                className={`
                  flex-1 rounded-xl py-3 px-6 text-white font-medium
                  transition-all duration-200 transform
                  ${isSaving || !form.title || !form.company || !form.location
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Post Job'
                )}
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 rounded-xl bg-gray-100 py-3 px-6 text-gray-700 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}

export default AddJobModal 
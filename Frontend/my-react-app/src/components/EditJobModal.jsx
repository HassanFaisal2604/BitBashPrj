import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Loader2 } from 'lucide-react'

function EditJobModal({ show, job, onSave, onClose }) {
  // Clone job into local form state so edits don't mutate original before save
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    tags: '',
    salary: '',
  })

  // When the modal opens (show becomes true) or job changes, populate form
  useEffect(() => {
    if (show && job) {
      setForm({
        title: job.title ?? '',
        company: job.company ?? '',
        location: job.location ?? '',
        type: job.type ?? 'Full-Time',
        tags: job.tags?.join(', ') ?? '',
        salary: job.salary ?? '',
      })
    }
  }, [show, job])

  const [isSaving, setIsSaving] = useState(false)

  // esc close (hook unconditional)
  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!show) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.company || !form.location) return
    setIsSaving(true)
    const payload = {
      title: form.title,
      company: form.company,
      location: form.location,
      type: form.type,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      salary: form.salary,
    }
    try {
      await onSave(payload)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Edit Job</h3>
          <button onClick={onClose} className="text-gray-400 transition-colors duration-200 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {['title', 'company', 'location'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="mb-2 block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)} *
              </label>
              <input
                id={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label htmlFor="type" className="mb-2 block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              id="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              {['Full-Time', 'Part-Time', 'Internship', 'Contract'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="salary" className="mb-2 block text-sm font-medium text-gray-700">
              Salary Range
            </label>
            <input
              id="salary"
              value={form.salary}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="$85,000 - $110,000"
            />
          </div>
          <div>
            <label htmlFor="tags" className="mb-2 block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Pricing, SQL"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 rounded-lg bg-blue-600 py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving…</span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-200 py-2 px-4 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditJobModal 
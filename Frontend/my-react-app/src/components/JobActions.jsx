import React, { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import EditJobModal from './EditJobModal'

function JobActions({ job, onDelete, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false)

  const handleSave = async (payload) => {
    await onUpdate(job.id, payload)
    setShowEdit(false)
  }

  return (
    <>
      {/* Desktop layout - Icon buttons on hover */}
      <div className="hidden sm:flex justify-end items-center pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
            title="Edit job"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
            title="Delete job"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile layout - Full buttons always visible */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => setShowEdit(true)}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 min-h-[44px] touch-target-44"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(job.id)}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-150 min-h-[44px] touch-target-44"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <EditJobModal key={job.id} show={showEdit} job={job} onSave={handleSave} onClose={() => setShowEdit(false)} />
    </>
  )
}

export default JobActions 
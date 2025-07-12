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

      {/* Mobile layout - Icon buttons only, more compact */}
      <div className="sm:hidden">
        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
          <div className="flex gap-1">
            <button
              onClick={() => setShowEdit(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110 touch-target-44"
              title="Edit job"
              aria-label="Edit job"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(job.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/80 rounded-lg transition-all duration-200 transform hover:scale-110 touch-target-44"
              title="Delete job"
              aria-label="Delete job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <EditJobModal key={job.id} show={showEdit} job={job} onSave={handleSave} onClose={() => setShowEdit(false)} />
    </>
  )
}

export default JobActions 
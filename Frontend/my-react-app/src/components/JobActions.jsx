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
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button
          onClick={() => setShowEdit(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          onClick={() => onDelete(job.id)}
          className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
      <EditJobModal show={showEdit} job={job} onSave={handleSave} onClose={() => setShowEdit(false)} />
    </>
  )
}

export default JobActions 
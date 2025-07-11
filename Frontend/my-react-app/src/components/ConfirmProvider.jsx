import React, { createContext, useContext, useState, useCallback } from 'react'

const ConfirmContext = createContext(() => Promise.resolve(false))

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ message: '', isOpen: false, resolve: null })

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setState({ message, isOpen: true, resolve })
    })
  }, [])

  const handleClose = (result) => {
    state.resolve && state.resolve(result)
    setState({ ...state, isOpen: false, resolve: null })
  }

  React.useEffect(() => {
    if (!state.isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') handleClose(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [state.isOpen])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h3>
            <p className="text-gray-700 mb-6">{state.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleClose(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleClose(true)}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export const useConfirm = () => useContext(ConfirmContext) 
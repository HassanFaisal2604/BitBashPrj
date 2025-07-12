import React, { useState, useCallback } from 'react'
import { AlertTriangle } from 'lucide-react'
import ModalPortal from './ModalPortal'
import { ConfirmContext } from '../contexts/ConfirmContext'

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ message: '', isOpen: false, resolve: null, isVisible: false })

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setState({ message, isOpen: true, resolve, isVisible: false })
      // Trigger animation after state update
      setTimeout(() => {
        setState(prev => ({ ...prev, isVisible: true }))
      }, 10)
    })
  }, [])

  const handleClose = useCallback((result) => {
    // Fade out animation
    setState(prev => ({ ...prev, isVisible: false }))
    setTimeout(() => {
      state.resolve && state.resolve(result)
      setState({ message: '', isOpen: false, resolve: null, isVisible: false })
    }, 200)
  }, [state])

  React.useEffect(() => {
    if (!state.isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') handleClose(false)
    }
    document.addEventListener('keydown', handleKey)
    if (state.isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [state.isOpen, handleClose])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.isOpen && (
        <ModalPortal>
          <div className={`
            fixed inset-0 z-50 flex items-center justify-center p-4
            transition-all duration-200 ease-out
            ${state.isVisible ? 'opacity-100' : 'opacity-0'}
          `}>
            {/* Backdrop */}
            <div 
              className={`
                absolute inset-0 bg-black transition-opacity duration-200
                ${state.isVisible ? 'opacity-50' : 'opacity-0'}
              `}
              onClick={() => handleClose(false)}
            />
            
            {/* Modal */}
            <div className={`
              relative w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6
              transition-all duration-200 ease-out transform
              ${state.isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
            `}>
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{state.message}</p>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleClose(false)}
                  className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-gray-700 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleClose(true)}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </ConfirmContext.Provider>
  )
}

 
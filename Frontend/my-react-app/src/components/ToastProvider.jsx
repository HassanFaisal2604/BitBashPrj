import React, { createContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react'

export const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  }

  const removeToast = useCallback((id) => {
    // First fade out
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))
    // Then remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    // Add hidden initially
    setToasts((prev) => [...prev, { id, message, type, visible: false }])
    // Show after next tick for animation
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)))
    }, 10)
    // Auto-remove after duration
    setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast container - positioned for better visibility */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 w-full max-w-md px-4 sm:px-0 sm:top-6 sm:right-6 sm:left-auto sm:transform-none">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || icons.info
          return (
            <div
              key={toast.id}
              className={`
                pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm
                transition-all duration-300 ease-in-out transform
                ${toast.visible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 -translate-y-2 scale-95'
                }
                ${colors[toast.type] || colors.info}
              `}
              onClick={() => removeToast(toast.id)}
              role="alert"
            >
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-5">{toast.message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeToast(toast.id)
                }}
                className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close notification"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

 
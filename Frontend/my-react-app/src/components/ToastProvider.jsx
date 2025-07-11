import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(() => {})

const colors = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    // start hidden then reveal for transition
    setToasts((prev) => [...prev, { id, message, type, visible: false }])
    // reveal after next tick
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)))
    }, 10)
    setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast stack */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 transform ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'} ${colors[t.type] || colors.info}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext) 
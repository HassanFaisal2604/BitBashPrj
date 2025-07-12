import { createContext } from 'react'

export const ConfirmContext = createContext(() => Promise.resolve(false)) 
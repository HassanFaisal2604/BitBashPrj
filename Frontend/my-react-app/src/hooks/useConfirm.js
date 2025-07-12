import { useContext } from 'react'
import { ConfirmContext } from '../contexts/ConfirmContext'

export function useConfirm() {
  return useContext(ConfirmContext)
} 
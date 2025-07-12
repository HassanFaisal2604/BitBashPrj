import { useContext } from 'react'
import { ConfirmContext } from '../components/ConfirmProvider'

export function useConfirm() {
  return useContext(ConfirmContext)
} 
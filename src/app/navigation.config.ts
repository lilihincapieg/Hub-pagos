import type { ComponentType } from 'react'
import { DocumentsIcon, ExploreIcon, OperationsIcon, PaymentsIcon } from './navigation.icons'

export interface AppNavItem {
  id: string
  label: string
  path: string
  Icon: ComponentType
}

export const appNavItems: AppNavItem[] = [
  { id: 'home', label: 'Inicio', path: '/', Icon: ExploreIcon },
  { id: 'payments-hub', label: 'Pagos', path: '/payments-hub', Icon: PaymentsIcon },
  { id: 'operations', label: 'Operaciones', path: '/', Icon: OperationsIcon },
  { id: 'documents', label: 'Documentos', path: '/', Icon: DocumentsIcon },
]

export function getActiveNavId(pathname: string): string {
  if (pathname.startsWith('/payments-hub')) return 'payments-hub'
  if (pathname === '/') return 'home'
  return 'home'
}

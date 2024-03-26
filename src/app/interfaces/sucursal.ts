import { ActionFormProps } from './index'

/**
 * Tipado para objectos departamentos
 */
export interface DepartamentoProps {
  codigo: number
  codigoPais: number
  departamento: string
  sigla: string
}

/**
 * Tipado para objectos sucursales
 */
export interface SucursalProps {
  _id: string
  codigo: number
  departamento: DepartamentoProps
  direccion: string
  municipio: string
  telefono: string
  state: string
  usucre: string
  usumod: string
  createdAt: string
  updatedAt: string
}

/**
 * Tipado para los argumentos o inputs de las sucursales
 */
export interface SucursalInputProps {
  codigo: number
  direccion: string
  telefono: string
  departamento: DepartamentoProps | null
  municipio: string
  action: ActionFormProps
}

/**
 * Tipado para los argumentos o inputs  de las sucursales para las apis
 */
export interface SucursalInputApiProps {
  codigo: number
  direccion: string
  telefono: string
  departamento: number
  municipio: string
}

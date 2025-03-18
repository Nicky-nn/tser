import { actionForm, ActionFormProps, AuditoriaProps } from '../../../interfaces'
import { SinTipoDocumentoIdentidadProps } from '../../sin/interfaces/sin.interface'

export interface ClienteProps extends AuditoriaProps {
  _id: string
  apellidos: string
  codigoCliente: string | null
  codigoExcepcion: number
  complemento: string
  email: string
  nombres: string
  numeroDocumento: string
  razonSocial: string
  tipoDocumentoIdentidad: SinTipoDocumentoIdentidadProps
  state: string
  telefono: string
  direccion?: string
}

export interface ClienteInputProps {
  sinTipoDocumento: SinTipoDocumentoIdentidadProps | null
  codigoCliente: string
  razonSocial: string
  numeroDocumento: string
  complemento: string
  email: string
  nombres: string
  apellidos: string
  telefono: string
  codigoExcepcion: number
  action: ActionFormProps
  busquedaCliente?: string
  direccion?: string
}

export interface Cliente99001InputProps {
  codigoCliente: string
  razonSocial: string
  email: string
  action: ActionFormProps
  apellidos?: string
  nombres?: string
}

export interface ClienteApiInputProps {
  nombres: string
  apellidos: string
  codigoTipoDocumentoIdentidad: number
  numeroDocumento: string
  complemento: string
  email: string
  razonSocial: string
  telefono: string
  codigoExcepcion: number
}

export interface Cliente99001ApiInputProps {
  apellidos: string
  codigoCliente: string
  email: string
  nombres: string
  razonSocial: string
}

export const CLIENTE_99001_DEFAULT_INPUT: Cliente99001InputProps = {
  codigoCliente: '',
  razonSocial: '',
  email: '',
  action: actionForm.REGISTER,
}

export const CLIENTE_DEFAULT_INPUT: ClienteInputProps = {
  sinTipoDocumento: null,
  codigoCliente: '',
  razonSocial: '',
  numeroDocumento: '',
  complemento: '',
  email: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  codigoExcepcion: 1,
  action: actionForm.REGISTER,
}

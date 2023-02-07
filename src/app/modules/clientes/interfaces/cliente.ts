import { actionForm, ActionFormProps, AuditoriaProps } from '../../../interfaces'
import { SinTipoDocumentoIdentidadProps } from '../../sin/interfaces/sin.interface'

export interface ClienteProps extends AuditoriaProps {
  _id: string
  apellidos: string
  codigoCliente: string
  codigoExcepcion: number
  complemento: string
  email: string
  nombres: string
  numeroDocumento: string
  razonSocial: string
  tipoDocumentoIdentidad: SinTipoDocumentoIdentidadProps
  state: string
  telefono: string
}

export interface ClienteInputProps {
  sinTipoDocumento: SinTipoDocumentoIdentidadProps | null
  razonSocial: string
  numeroDocumento: string
  complemento: string
  email: string
  nombres: string
  apellidos: string
  telefono: string
  action: ActionFormProps
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
  razonSocial: '',
  numeroDocumento: '',
  complemento: '',
  email: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  action: actionForm.REGISTER,
}

import {
  ClienteApiInputProps,
  ClienteInputProps,
  ClienteProps,
} from '../interfaces/cliente'
import { genReplaceEmpty } from '../../../utils/helper'
import { SinTipoDocumentoIdentidadProps } from '../../sin/interfaces/sin.interface'
import { actionForm, ActionFormProps } from '../../../interfaces'

/**
 * Decomponemos al cliente para el formulario
 * @param input
 * @param action
 */
export const clienteDecomposeService = (
  input: ClienteProps,
  action: ActionFormProps,
): ClienteInputProps => {
  return {
    sinTipoDocumento: input.tipoDocumentoIdentidad,
    razonSocial: input.razonSocial,
    numeroDocumento: input.numeroDocumento,
    complemento: genReplaceEmpty(input.complemento, ''),
    email: input.email,
    nombres: genReplaceEmpty(input.nombres, ''),
    apellidos: genReplaceEmpty(input.apellidos, ''),
    telefono: genReplaceEmpty(input.telefono, ''),
    action,
  }
}

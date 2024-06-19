import { ActionFormProps } from '../../../interfaces'
import { genReplaceEmpty } from '../../../utils/helper'
import { ClienteInputProps, ClienteProps } from '../interfaces/cliente'

/**
 * Decomponemos al cliente para el formulario
 * @param input
 * @param action
 */
export const clienteDecomposeService = (
  input: ClienteProps,
  action: ActionFormProps,
): ClienteInputProps => {
  //@ts-ignore
  return {
    sinTipoDocumento: input.tipoDocumentoIdentidad,
    razonSocial: input.razonSocial,
    numeroDocumento: input.numeroDocumento,
    complemento: genReplaceEmpty(input.complemento, ''),
    email: input.email,
    nombres: genReplaceEmpty(input.nombres, ''),
    apellidos: genReplaceEmpty(input.apellidos, ''),
    telefono: genReplaceEmpty(input.telefono, ''),
    codigoExcepcion: genReplaceEmpty(input.codigoExcepcion, 1),
    action,
  }
}

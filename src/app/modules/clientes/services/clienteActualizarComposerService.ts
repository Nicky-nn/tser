import { genReplaceEmpty } from '../../../utils/helper'
import { ClienteApiInputProps, ClienteInputProps } from '../interfaces/cliente'

/**
 * Componemos el input a valores que acepta el servicio, para modificación, no se envia el valor de tipo de documento por estar bloqueado
 * @param input
 */
export const clienteActualizarComposeService = (
  input: ClienteInputProps,
): ClienteApiInputProps => {
  return <any>{
    apellidos: genReplaceEmpty(input.apellidos, ''),
    complemento: genReplaceEmpty(input.complemento, ''),
    email: genReplaceEmpty(input.email, ''),
    nombres: genReplaceEmpty(input.nombres, ''),
    numeroDocumento: input.numeroDocumento,
    razonSocial: input.razonSocial,
    telefono: genReplaceEmpty(input.telefono, ''),
  }
}

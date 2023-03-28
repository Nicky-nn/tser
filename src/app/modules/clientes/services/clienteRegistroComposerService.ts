import { genReplaceEmpty } from '../../../utils/helper'
import { ClienteApiInputProps, ClienteInputProps } from '../interfaces/cliente'

/**
 * Componemos el input a valores que acepta el servicio
 * @param input
 */
export const clienteRegistroComposeService = (
  input: ClienteInputProps,
): ClienteApiInputProps => {
  return {
    nombres: input.nombres,
    apellidos: genReplaceEmpty(input.apellidos, ''),
    codigoTipoDocumentoIdentidad: input.sinTipoDocumento?.codigoClasificador!,
    numeroDocumento: input.numeroDocumento,
    complemento: genReplaceEmpty(input.complemento, null),
    email: input.email,
    razonSocial: input.razonSocial,
    telefono: genReplaceEmpty(input.telefono, null),
  }
}

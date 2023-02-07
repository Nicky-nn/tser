import { genReplaceEmpty } from '../../../utils/helper'
import { Cliente99001ApiInputProps, Cliente99001InputProps } from '../interfaces/cliente'

/**
 * Componemos el input a valores que acepta el servicio
 * @param input
 */
export const cliente99001ActualizarComposeService = (
  input: Cliente99001InputProps,
): Cliente99001ApiInputProps => {
  return <any>{
    nombres: genReplaceEmpty(input.nombres, ''),
    apellidos: genReplaceEmpty(input.apellidos, ''),
    email: input.email,
    razonSocial: input.razonSocial,
  }
}

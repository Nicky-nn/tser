import {
  Cliente99001ApiInputProps,
  Cliente99001InputProps,
  ClienteApiInputProps,
  ClienteInputProps,
} from '../interfaces/cliente'
import { genReplaceEmpty } from '../../../utils/helper'

/**
 * Componemos el input a valores que acepta el servicio
 * @param input
 */
export const cliente99001RegistroComposeService = (
  input: Cliente99001InputProps,
): Cliente99001ApiInputProps => {
  return {
    apellidos: genReplaceEmpty(input.apellidos, ''),
    codigoCliente: input.codigoCliente,
    email: input.email,
    nombres: genReplaceEmpty(input.nombres, ''),
    razonSocial: input.razonSocial,
  }
}

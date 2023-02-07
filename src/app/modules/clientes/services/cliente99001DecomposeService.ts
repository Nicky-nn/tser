import { ActionFormProps } from '../../../interfaces'
import { genReplaceEmpty } from '../../../utils/helper'
import { Cliente99001InputProps, ClienteProps } from '../interfaces/cliente'

/**
 * Decomponemos al cliente para el formulario
 * @param input
 * @param action
 */
export const cliente99001DecomposeService = (
  input: ClienteProps,
  action: ActionFormProps,
): Cliente99001InputProps => {
  return {
    codigoCliente: input.codigoCliente,
    razonSocial: input.razonSocial,
    email: input.email,
    nombres: genReplaceEmpty(input.nombres, ''),
    apellidos: genReplaceEmpty(input.apellidos, ''),
    action,
  }
}

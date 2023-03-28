import { logg } from '../../../utils/helper'
import { Cliente99001InputProps } from '../interfaces/cliente'

/**
 * Validamos los datos de formulario del producto
 * @param input
 */
export const cliente99001RegistroValidator = async (
  input: Cliente99001InputProps,
): Promise<Array<string>> => {
  try {
    logg('begin')
    return []
  } catch (e: any) {
    return [e.message]
  }
}

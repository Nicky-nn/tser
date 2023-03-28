import { logg } from '../../../utils/helper'
import { ClienteInputProps } from '../interfaces/cliente'

/**
 * Validamos los datos de formulario del producto
 * @param input
 */
export const clienteRegistroValidator = async (
  input: ClienteInputProps,
): Promise<Array<string>> => {
  try {
    logg('BEGIN')
    return []
  } catch (e: any) {
    return [e.message]
  }
}

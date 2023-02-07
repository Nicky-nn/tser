import { Cliente99001InputProps, ClienteInputProps } from '../interfaces/cliente'

/**
 * Validamos los datos de formulario del producto
 * @param input
 */
export const cliente99001RegistroValidator = async (
  input: Cliente99001InputProps,
): Promise<Array<string>> => {
  try {
    return []
  } catch (e: any) {
    return [e.message]
  }
}

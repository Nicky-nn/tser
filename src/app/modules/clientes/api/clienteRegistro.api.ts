// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { ClienteApiInputProps, ClienteProps } from '../interfaces/cliente'

const query = gql`
  mutation CLIENTE_REGISTRO($input: ClienteInput!) {
    clienteCreate(input: $input) {
      _id
      razonSocial
      codigoCliente
      tipoDocumentoIdentidad {
        codigoClasificador
        descripcion
      }
      numeroDocumento
      complemento
      nombres
      apellidos
      email
      telefono
    }
  }
`

export const apiClienteRegistro = async (
  input: ClienteApiInputProps,
): Promise<ClienteProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, { input })
    return data.clienteCreate
  } catch (error: any) {
    const errorMessage =
      error.response?.errors?.[0]?.message || 'Error al registrar cliente'
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'Entendido',
    })
    console.error('Error en apiClienteRegistro', error)
    throw new MyGraphQlError(error)
  }
}

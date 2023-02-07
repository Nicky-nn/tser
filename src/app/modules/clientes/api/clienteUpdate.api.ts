// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import {
  ClienteApiInputProps,
  ClienteInputProps,
  ClienteProps,
} from '../interfaces/cliente'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

const query = gql`
  mutation CLIENTE_ACTUALIZACION($id: ID!, $input: ClienteUpdateInput!) {
    clienteUpdate(id: $id, input: $input) {
      _id
      razonSocial
      tipoDocumentoIdentidad {
        codigoClasificador
        descripcion
      }
      codigoCliente
      numeroDocumento
      complemento
      nombres
      apellidos
      email
      codigoExcepcion
    }
  }
`

export const apiClienteActualizar = async (
  id: string,
  input: ClienteApiInputProps,
): Promise<ClienteProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, { id, input })
    return data.clienteUpdate
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

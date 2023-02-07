// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { Cliente99001ApiInputProps, ClienteProps } from '../interfaces/cliente'

const query = gql`
  mutation CLIENTE_99001_ACTUALIZAR($id: ID!, $input: Cliente99001UpdateInput!) {
    cliente99001Update(id: $id, input: $input) {
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

export const apiCliente99001Actualizar = async (
  id: string,
  input: Cliente99001ApiInputProps,
): Promise<ClienteProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, { id, input })
    return data.cliente99001Update
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import {
  Cliente99001InputProps,
  ClienteInputProps,
  ClienteProps,
} from '../interfaces/cliente'

const apiQuery = gql`
  mutation CLIENTE_99001_REGISTRO($input: Cliente99001Input!) {
    cliente99001Create(input: $input) {
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
    }
  }
`

export const apiCliente99001Create = async (
  input: Cliente99001InputProps,
): Promise<ClienteProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  console.log(input)

  const data: any = await client.request(apiQuery, { input })
  return data.cliente99001Create
}

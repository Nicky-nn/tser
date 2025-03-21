// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { ClienteProps } from '../interfaces/cliente'

const queryGql = gql`
  query CLIENTES_BUSQUEDA($query: String!) {
    clienteBusqueda(query: $query) {
      _id
      apellidos
      codigoCliente
      complemento
      email
      nombres
      numeroDocumento
      razonSocial
      telefono
      tipoDocumentoIdentidad {
        codigoClasificador
        descripcion
      }
      state
      direccion
    }
  }
`

/**
 * @description Busqueda de clientes segun alguna referencia
 * @param query
 */
export const apiClienteBusqueda = async (query: string): Promise<ClienteProps[]> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(queryGql, { query })
    return data.clienteBusqueda
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

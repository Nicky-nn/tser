// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

const query = gql`
  mutation CLIENTES_ELIMINAR($codigosCliente: [String]!) {
    clientesEliminar(codigosCliente: $codigosCliente)
  }
`

/**
 * @description Eliminacion de clientes
 * @param codigosCliente
 */
export const apiClientesEliminar = async (codigosCliente: string[]): Promise<boolean> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, { codigosCliente })
    return data.clientesEliminar
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

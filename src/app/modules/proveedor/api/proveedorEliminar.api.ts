// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

const gqlQuery = gql`
  mutation PROVEEDOR_ELIMINAR($codigoProveedor: [String]!) {
    proveedorEliminar(codigoProveedor: $codigoProveedor)
  }
`

/**
 * @description eliminacion de un proveedor
 * @param codigoProveedor
 */
export const apiProveedorEliminar = async (codigoProveedor: string): Promise<boolean> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, { codigoProveedor })
    return data.proveedorEliminar
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

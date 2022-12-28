// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'

const gqlQuery = gql`
  mutation PROVEEDOR_ELIMINAR($codigoProveedor: [String]!) {
    proveedorEliminar(codigoProveedor: $codigoProveedor)
  }
`

export const apiProveedorEliminar = async (codigoProveedor: string): Promise<boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, { codigoProveedor })
  return data.proveedorEliminar
}

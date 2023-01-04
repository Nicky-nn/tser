// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'

const query = gql`
  mutation FCV_PRODUCTOS_ELIMINAR($ids: [ID]!) {
    fcvProductosEliminar(ids: $ids)
  }
`

export const apiGiftCardVarianteEliminar = async (id: string): Promise<boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query, { id })
  return data.fcvProductosEliminar
}

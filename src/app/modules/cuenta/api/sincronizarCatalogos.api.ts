// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'

const gqlQuery = gql`
  mutation SYNC_CATALOGOS {
    syncCatalogos
  }
`

/**
 * @description Nos permite sincronizar el codigo cufd de la cuenta activa
 */
export const apiSincronizarCatalogos = async (): Promise<Boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(gqlQuery)
  return data.syncCatalogos
}

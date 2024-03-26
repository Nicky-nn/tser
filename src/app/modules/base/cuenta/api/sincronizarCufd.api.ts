// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../../base/services/GraphqlError'

const gqlQuery = gql`
  mutation SYNC_CUFD {
    syncCufd(forzarActualizacion: 1) {
      codigo
      codigoControl
      direccion
      fechaInicial
      fechaVigencia
    }
  }
`

/**
 * @description Nos permite sincronizar el codigo cufd de la cuenta activa
 */
export const apiSincronizarCufd = async (): Promise<Boolean> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(gqlQuery)
    return data.syncCufd
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

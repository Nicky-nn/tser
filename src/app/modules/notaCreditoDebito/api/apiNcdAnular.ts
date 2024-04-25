// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

const apiQuery = gql`
  mutation NCD_FCV_ANULA($cufs: [ID]!, $codigoMotivo: Int!) {
    notaCreditoDebitoFcvAnular(cufs: $cufs, codigoMotivo: $codigoMotivo)
  }
`

/**
 * @description Anulación de una NCD
 * @param cufs
 * @param codigoMotivo
 */
export const apiNcdAnular = async (
  cufs: string[],
  codigoMotivo: number,
): Promise<boolean> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(apiQuery, { cufs, codigoMotivo })
    return data.notaCreditoDebitoFcvAnular
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

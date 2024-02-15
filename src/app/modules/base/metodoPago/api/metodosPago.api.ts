// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../../base/services/GraphqlError'
import { MetodoPagoProp } from '../interfaces/metodoPago'

const apiQuery = gql`
  query METODOS_PAGO {
    metodosPago {
      codigoClasificador
      descripcion
    }
  }
`

/**
 * @description Clasificador de métodos de pago
 */
export const apiMetodosPago = async (): Promise<MetodoPagoProp[]> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(apiQuery)
    return data.metodosPago
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

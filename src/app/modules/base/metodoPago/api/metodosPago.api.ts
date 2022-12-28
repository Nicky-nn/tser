// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../../base/models/paramsModel'
import { MetodoPagoProp } from '../interfaces/metodoPago'

const apiQuery = gql`
  query METODOS_PAGO {
    metodosPago {
      codigoClasificador
      descripcion
    }
  }
`

export const apiMetodosPago = async (): Promise<MetodoPagoProp[]> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(apiQuery)
  return data.metodosPago
}

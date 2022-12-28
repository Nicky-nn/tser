// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { SinUnidadMedidaProps } from '../interfaces/sin.interface'

const query = gql`
  query UNIDAD_MEDIDA {
    sinUnidadMedida {
      codigoClasificador
      descripcion
    }
  }
`

export const apiSinUnidadMedida = async (): Promise<SinUnidadMedidaProps[]> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query)
  return data.sinUnidadMedida
}

// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { SinTipoDocumentoIdentidadProps } from '../interfaces/sin.interface'

const query = gql`
  query TIPO_DOCUMENTO_IDENTIDAD {
    sinTipoDocumentoIdentidad {
      codigoClasificador
      descripcion
    }
  }
`

export const fetchSinTipoDocumentoIdentidad = async (): Promise<
  SinTipoDocumentoIdentidadProps[]
> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query)
  return data.sinTipoDocumentoIdentidad
}

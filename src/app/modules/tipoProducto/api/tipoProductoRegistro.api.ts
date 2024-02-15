// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import {
  TipoProductoInputProp,
  TipoProductoProps,
} from '../interfaces/tipoProducto.interface'

const gqlQuery = gql`
  mutation TIPO_PRODUCTO_REGISTRO($input: TipoProductoInput!) {
    tipoProductoRegistro(input: $input) {
      _id
      descripcion
      codigoParent
      parientes
      state
      usucre
      createdAt
      usumod
      UpdatedAt
    }
  }
`

/**
 * @description Funcion para registrar un tipo de producto
 * @param input
 */
export const apiTipoProductoRegistro = async (
  input: TipoProductoInputProp,
): Promise<TipoProductoProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, { input })
    return data.tipoProductoRegistro
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

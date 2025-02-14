// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { PageInfoProps, PageInputProps } from '../../../interfaces'

const queryGql = gql`
  fragment FIELDS on TipoArticulo {
    _id
    codigo
    descripcion
    notas
    state
    usucre
    createdAt
    usumod
    updatedAt
  }
  query LISTADO(
    $limit: Int! = 10
    $page: Int = 1
    $reverse: Boolean = false
    $query: String
  ) {
    tipoArticuloListado(limit: $limit, page: $page, reverse: $reverse, query: $query) {
      pageInfo {
        hasNextPage
        hasPrevPage
        totalDocs
        limit
        page
        totalPages
      }
      docs {
        ...FIELDS
      }
    }
  }
`

export interface TipoArticuloProps {
  _id: string
  codigo: string
  descripcion: string
  notas: string[]
  state: string
  usucre: string
  createdAt: string
  usumod: string
  updatedAt: string
}

/**
 * Respuesta de productos
 */
interface TipoArticuloListadoResponse {
  pageInfo: PageInfoProps
  docs: TipoArticuloProps[]
}

/**
 * Listado del clasificador de tipos de articulos
 * @param pageInfo
 */
export const apiTipoArticuloListado = async (
  pageInfo: PageInputProps,
): Promise<TipoArticuloListadoResponse> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(queryGql, { ...pageInfo })
    return data.tipoArticuloListado
  } catch (error: any) {
    throw new MyGraphQlError(error)
  }
}

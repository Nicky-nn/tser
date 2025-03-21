// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { PageInfoProps, PageProps } from '../../../interfaces'
import { ClienteProps } from '../interfaces/cliente'

interface ClienteListadoProps {
  pageInfo: PageInfoProps
  docs: ClienteProps[]
}

const query = gql`
  query CLIENTES_LISTADO($limit: Int!, $reverse: Boolean, $page: Int!, $query: String) {
    clientesAll(limit: $limit, reverse: $reverse, page: $page, query: $query) {
      pageInfo {
        hasNextPage
        hasPrevPage
        totalDocs
        limit
        page
        totalPages
      }
      docs {
        _id
        apellidos
        codigoCliente
        complemento
        email
        nombres
        numeroDocumento
        razonSocial
        codigoExcepcion
        tipoDocumentoIdentidad {
          codigoClasificador
          descripcion
        }
        direccion
        telefono
        state
        usucre
        createdAt
        usumod
        UpdatedAt
      }
    }
  }
`

/**
 * Listado de clientes
 * @param pageInfo
 */
export const fetchClienteListado = async (
  pageInfo: PageProps,
): Promise<ClienteListadoProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, { ...pageInfo })
    return data.clientesAll
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

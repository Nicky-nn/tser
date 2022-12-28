// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageInputProps } from '../../../interfaces'
import { GiftCardProps } from '../interfaces/giftCard.interface'

/**
 * Respuesta de productos
 */
export interface ApiGiftCardResponse {
  docs: Array<GiftCardProps>
  pageInfo: PageInfoProps
}

const query = gql`
  query GIFT_CARDS($limit: Int!, $reverse: Boolean, $page: Int!, $query: String) {
    giftCards(limit: $limit, reverse: $reverse, page: $page, query: $query) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        _id
        titulo
        state
        usucre
        createdAt
        usumod
        createdAt
        actividadEconomica {
          codigoCaeb
          descripcion
          tipoActividad
        }
        variantes {
          titulo
          _id
          sinProductoServicio {
            codigoActividad
            codigoProducto
            descripcionProducto
          }
          precio
          codigoProducto
          imagen {
            altText
            url
          }
          unidadMedida {
            codigoClasificador
            descripcion
          }
        }
      }
    }
  }
`

export const apiGiftCards = async (
  pageInfo: PageInputProps,
): Promise<ApiGiftCardResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query, pageInfo)
  return data.giftCards
}

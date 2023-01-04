// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageInputProps } from '../../../interfaces'
import { GiftCardVarianteProps } from '../interfaces/giftCard.interface'

/**
 * Respuesta de productos
 */
export interface ApiGiftCardVarianteResponse {
  docs: Array<GiftCardVarianteProps>
  pageInfo: PageInfoProps
}

const query = gql`
  query GIFT_CARD_VARIANTES(
    $limit: Int!
    $reverse: Boolean
    $page: Int!
    $query: String
  ) {
    giftCardVariantes(limit: $limit, reverse: $reverse, page: $page, query: $query) {
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
        sinProductoServicio {
          codigoActividad
          codigoProducto
          descripcionProducto
        }
        giftCard {
          _id
          titulo
          actividadEconomica {
            codigoCaeb
          }
          totalVariantes
          imagenDestacada {
            altText
            url
          }
        }
        codigoProducto
        titulo
        nombre
        codigoBarras
        precio
        imagen {
          altText
          url
        }
        incluirCantidad
        verificarStock
        unidadMedida {
          codigoClasificador
          descripcion
        }
        inventario {
          sucursal {
            codigo
            direccion
            telefono
            municipio
          }
          stock
        }
        state
        usucre
        createdAt
        usumod
        createdAt
      }
    }
  }
`

export const apiGiftCardVariantes = async (
  pageInfo: PageInputProps,
): Promise<ApiGiftCardVarianteResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query, pageInfo)
  return data.giftCardVariantes
}

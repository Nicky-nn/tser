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
        descripcion
        state
        usucre
        createdAt
        usumod
        createdAt
        disponibilidad
        activo
        actividadEconomica {
          codigoCaeb
          descripcion
          tipoActividad
        }
        proveedor {
          codigo
          nombre
        }
        tipoProducto {
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
        variantes {
          titulo
          nombre
          _id
          incluirCantidad
          verificarStock
          codigoBarras
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
          inventario {
            sucursal {
              codigo
              direccion
              telefono
              departamento {
                codigo
                codigoPais
                sigla
                departamento
              }
              municipio
            }
            stock
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

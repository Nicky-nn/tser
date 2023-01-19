// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { GiftCardProps } from '../interfaces/giftCard.interface'

const query = gql`
  query GIFT_CARD($id: ID!) {
    giftCard(id: $id) {
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
`

export const apiGiftCard = async (id: string): Promise<GiftCardProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query, { id })
  return data.giftCard
}

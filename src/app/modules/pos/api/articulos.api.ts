// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { PageInfoProps, PageInputProps } from '../../../interfaces'

/**
 * Respuesta de productos
 */
export interface ApiProductoResponse {
  docs: Array<any>
  pageInfo: PageInfoProps
}

const query = gql`
  query REST_ARTICULOS(
    $cds: Int!
    $limit: Int!
    $reverse: Boolean
    $page: Int!
    $query: String
  ) {
    articuloListado(
      cds: $cds
      limit: $limit
      reverse: $reverse
      page: $page
      query: $query
    ) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        codigoArticulo
        nombreArticulo
        descripcionArticulo
        tipoArticulo {
          codigo
          descripcion
        }
        sinProductoServicio {
          codigoActividad
          codigoProducto
          descripcionProducto
        }
        actividadEconomica {
          codigoCaeb
          descripcion
        }
        tipoArticulo {
          codigo
          descripcion
        }
        proveedor {
          codigo
          nombre
        }
        codigoGrupoUnidadMedida
        grupoUnidadMedida {
          codigoGrupo
          nombreGrupo
          unidadMedidaBase {
            codigoUnidadMedida
          }
        }
        articuloPrecioBase {
          articuloUnidadMedida {
            codigoUnidadMedida
            nombreUnidadMedida
          }
          monedaPrimaria {
            moneda {
              codigo
              descripcion
              tipoCambio
              tipoCambioCompra
              sigla
            }
            precioBase
            precio
            manual
          }
        }
        articuloPrecio {
          articuloUnidadMedida {
            codigoUnidadMedida
            nombreUnidadMedida
          }
          monedaPrimaria {
            moneda {
              codigo
              descripcion
            }
            precioBase
            precio
            manual
          }
          cantidadBase
        }
        inventario {
          totalStock
          totalDisponible
          totalSolicitado
          totalComprometido
          sucursal {
            codigo
          }
          detalle {
            almacen {
              codigoAlmacen
            }
            stock
            comprometido
            solicitado
            disponible
            lotes {
              codigoLote
              stock
              comprometido
              solicitado
              disponible
            }
          }
        }
        imagen {
          variants {
            thumbnail
            medium
            square
            public
          }
          id
          filename
        }
      }
    }
  }
`

/**
 * @description Consumo de la API para el listado de productos y sus variantes
 * @param pageInfo Información de la página
 */
export const apiListadoArticulos = async (
  pageInfo: PageInputProps,
): Promise<ApiProductoResponse> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Establecer un encabezado único
    client.setHeader('authorization', `Bearer ${token}`)

    // Agregar el parámetro "CDS" al objeto de pageInfo
    const queryVariables = { ...pageInfo, cds: 1 }

    const data: any = await client.request(query, queryVariables)
    return data.articuloListado
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

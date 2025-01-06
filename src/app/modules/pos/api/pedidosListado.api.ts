// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { PageInfoProps, PageInputProps } from '../../../interfaces'
import { EntidadParamsInput } from '../../ventas/api/factura.listado.api'

// Define los tipos para los datos que esperas recibir

/**
 * Unidad de medida para un artículo.
 */
interface ArticuloUnidadMedida {
  codigoUnidadMedida: string
  nombreUnidadMedida: string
}

/**
 * Moneda utilizada en el precio de un artículo.
 */
interface Moneda {
  codigo: string
  descripcion: string
}

/**
 * Detalles de precios de un artículo.
 */
interface ArticuloPrecio {
  articuloUnidadMedida: ArticuloUnidadMedida
  monedaPrecio: {
    moneda: Moneda
    precioBase: number
    precio: number
  }
}

/**
 * Producto en un pedido.
 */
interface Producto {
  codigoArticulo: string
  articuloPrecio: ArticuloPrecio
}

/**
 * Detalles de un pedido.
 */
interface RestPedido {
  numeroPedido: number
  sucursal: {
    codigo: string
  }
  productos: Producto[]
  state: string
}

export interface ApiPedidoResponse {
  docs: Array<RestPedido>
  pageInfo: PageInfoProps
}

// Define la consulta GraphQL
const LISTADO_PEDIDOS_QUERY = gql`
  query LISTADO_PEDIDOS(
    $limit: Int!
    $entidad: EntidadParamsInput!
    $reverse: Boolean
    $page: Int!
    $query: String
  ) {
    restPedidoListado(
      limit: $limit
      entidad: $entidad
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
        numeroPedido
        numeroOrden

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
        puntoVenta {
          codigo
          tipoPuntoVenta {
            codigoClasificador
            descripcion
          }
          nombre
          descripcion
        }
        mesa {
          nombre
          nroComensales
        }
        cliente {
          email
          nombres
          telefono
          codigoCliente
          numeroDocumento
        }
        moneda {
          codigo
          descripcion
          sigla
          tipoCambio
          tipoCambioCompra
          usucre
          usumod
          createdAt
          updatedAt
        }
        tipoCambio
        montoTotal
        descuentoAdicional
        productos {
          complementos {
            almacen {
              codigoAlmacen
              nombre
              state
              sucursal {
                codigo
              }
              ubicacion
            }
            articuloPrecio {
              cantidad
              articuloUnidadMedida {
                codigoUnidadMedida
                nombreUnidadMedida
              }
              cantidadBase
              descuento
              descuentoAdicional
              factorAjuste
              impuesto
              otrosCostos
            }
            claseArticulo
            codigoArticulo
            codigoGrupo
            detalleExtra
            grupoArticulo {
              codigoGrupoArticulo
            }
            lote {
              codigoLote
            }
            nombreArticulo
            nota
            nroItem
            sinProductoServicio {
              descripcionProducto
              codigoActividad
            }
            tipoArticulo {
              descripcion
            }
            verificarStock
          }
          nroItem
          codigoArticulo
          nombreArticulo
          sinProductoServicio {
            codigoActividad
            codigoProducto
            descripcionProducto
          }
          tipoArticulo {
            codigo
            descripcion
          }
          detalleExtra
          articuloPrecio {
            cantidad
            articuloUnidadMedida {
              codigoUnidadMedida
              nombreUnidadMedida
              sinUnidadMedida {
                codigoClasificador
                descripcion
              }
              longitud
              ancho
              altura
              peso
              volumen
              state
              usucre
              createdAt
              usumod
              updatedAt
            }
            monedaPrecio {
              moneda {
                codigo
                descripcion
                sigla
                tipoCambio
                tipoCambioCompra
                usucre
                usumod
                createdAt
                updatedAt
              }
              precioBase
              precio
            }
            cantidadBase
            descuento
            factorAjuste
          }
          almacen {
            codigoAlmacen
            nombre
            ubicacion
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
            state
            usucre
            createdAt
            usumod
            updatedAt
          }
          lote {
            codigoLote
            descripcion
            atributo1
            atributo2
            fechaAdmision
            fechaFabricacion
            fechaVencimiento
            state
            usucre
            createdAt
            usumod
            updatedAt
          }
          nota
        }
        cliente {
          razonSocial
          codigoCliente
          tipoDocumentoIdentidad {
            codigoClasificador
            descripcion
          }
          numeroDocumento
          complemento
          nombres
          apellidos
          email
          telefono
        }
        metodoPago {
          codigoClasificador
          descripcion
        }
        numeroTarjeta
        montoTotal
        montoTotalBase
        fechaEntrega
        direccionEntrega
        detalleExtra
        tipo
        atributo1
        atributo2
        atributo3
        atributo4
        direccionEntrega
        fechaEntrega
        terminos
        productosEliminados {
          nota
          nombreArticulo
          nroItem
        }
        nota
        tipoDocumento
        refNroDocumento
        refDocumento
        fechaDocumento
        fechaEntrega
        fechaContable
        montoTotal
        state
        usucre
        createdAt
        usumod
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPrevPage
        totalDocs
        limit
        page
        totalPages
      }
    }
  }
`

/**
 * @description Obtiene el listado de pedidos desde la API GraphQL.
 * @param {PageInputProps} pageInfo Información de paginación y búsqueda.
 * @returns {Promise<RestPedido[]>} Lista de pedidos.
 */
export const obtenerListadoPedidos = async (
  pageInfo: PageInputProps,
  entidad: EntidadParamsInput,
): Promise<ApiPedidoResponse> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Establece el encabezado de autorización
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(LISTADO_PEDIDOS_QUERY, {
      ...pageInfo,
      entidad,
    })
    return data.restPedidoListado
  } catch (error: any) {
    console.error('Error al obtener el listado de pedidos:', error)
    throw new MyGraphQlError(error)
  }
}

import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

interface ArticuloInventarioComplementoListadoData {
  articuloInventarioComplementoListado: {
    _id: string
    codigoArticulo: string
    nombreArticulo: string
    descripcionArticulo: string
    verificarStock: boolean
    articuloVenta: boolean
    articuloCompra: boolean
    articuloInventario: boolean
    tipoArticulo: {
      codigo: number
      descripcion: string
    }
    claseArticulo: string
    sinProductoServicio: {
      codigoActividad: string
      codigoProducto: string
      descripcionProducto: string
    }
    actividadEconomica: {
      codigoCaeb: string
      descripcion: string
      tipoActividad: string
    }
    proveedor: {
      codigo: number
      nombre: string
    }
    imagen: {
      id: string
      variants: {
        thumbnail: string
        medium: string
        square: string
      }
    }
    grupoUnidadMedida: {
      codigoGrupo: number
      nombreGrupo: string
      unidadMedidaBase: {
        codigoUnidadMedida: number
      }
    }
    articuloPrecioBase: {
      articuloUnidadMedida: {
        codigoUnidadMedida: number
        nombreUnidadMedida: string
      }
      monedaPrimaria: {
        moneda: {
          codigo: number
          sigla: string
          descripcion: string
          tipoCambio: number
          tipoCambioCompra: number
        }
        precioBase: number
        precio: number
        manual: boolean
      }
    }
    inventario: {
      totalStock: number
      totalDisponible: number
      totalSolicitado: number
      totalComprometido: number
      sucursal: {
        codigo: number
      }
      detalle: {
        almacen: {
          codigoAlmacen: number
        }
        stock: number
        comprometido: number
        solicitado: number
        disponible: number
      }[]
    }
    listaComplemento: {
      id: string
      codigoArticulo: string
      nombreArticulo: string
    }[]
  }[]
}

const queryListado = gql`
  query LISTADO($cds: Int!, $entidad: EntidadParamsInput!, $query: String!) {
    articuloInventarioComplementoListado(cds: $cds, entidad: $entidad, query: $query) {
      ...ArticuloFields
    }
  }

  fragment ArticuloFields on Articulo {
    _id
    codigoArticulo
    nombreArticulo
    descripcionArticulo
    verificarStock
    articuloVenta
    articuloCompra
    articuloInventario
    tipoArticulo {
      codigo
      descripcion
    }
    claseArticulo
    sinProductoServicio {
      codigoActividad
      codigoProducto
      descripcionProducto
    }
    actividadEconomica {
      codigoCaeb
      descripcion
      tipoActividad
    }
    proveedor {
      codigo
      nombre
    }
    imagen {
      id
      variants {
        thumbnail
        medium
        square
      }
    }
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
          sigla
          descripcion
        }
        precioBase
        precio
        manual
      }
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
    listaComplemento {
      id
      codigoArticulo
      nombreArticulo
    }
  }
`

export const articuloInventarioComplementoListadoApi = async (
  entidad: { codigoSucursal: number; codigoPuntoVenta: number },
  query: string,
): Promise<ArticuloInventarioComplementoListadoData> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    const cds = parseInt(import.meta.env.ISI_DOCUMENTO_SECTOR.toString(), 10)

    client.setHeader('authorization', `Bearer ${token}`)

    const data: {
      articuloInventarioComplementoListado: ArticuloInventarioComplementoListadoData
    } = await client.request(queryListado, {
      cds,
      entidad,
      query,
    })
    return data?.articuloInventarioComplementoListado || []
  } catch (error: any) {
    const errorMessage =
      error.response?.errors?.[0]?.message ||
      'Ocurrió un error inesperado, por favor intente de nuevo'
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'Entendido',
    })
    console.error('Error en articuloInventarioComplementoListadoApi', error)
    throw new MyGraphQlError(error)
  }
}

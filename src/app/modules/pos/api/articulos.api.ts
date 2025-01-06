// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { PageInfoProps, PageInputProps } from '../../../interfaces'
import {
  SinActividadesEconomicasProps,
  SinProductoServicioProps,
  SinTipoDocumentoSectorProps,
  SinUnidadMedidaProps,
} from '../../../interfaces/sin.interface'
import { MonedaProps } from '../../base/moneda/interfaces/moneda'
import { ProveedorProps } from '../../proveedor/interfaces/proveedor.interface'
import { EntidadParamsInput } from '../../ventas/api/factura.listado.api'

/**
 * Respuesta de productos
 */
interface ApiProductoResponse {
  docs: Array<Articulo>
  pageInfo: PageInfoProps
}

export interface Articulo {
  _id: string
  actividadEconomica: SinActividadesEconomicasProps
  activo: boolean
  articuloCompra: boolean
  articuloInventario: boolean
  articuloPrecio: ArticuloPrecio
  articuloPrecioBase: ArticuloPrecio
  articuloVenta: boolean
  claseArticulo: string
  codigoArticulo: string
  codigoGrupoUnidadMedida: number
  createdAt: string
  descripcionArticulo: string
  gestionArticulo: string | null
  grupoArticulo: GrupoArticulo
  grupoUnidadMedida: GrupoUnidadMedida
  imagen: ImagenCloud
  inventario: Inventario[]
  nombreArticulo: string
  complemento: boolean
  proveedor: ProveedorProps
  sinProductoServicio: SinProductoServicioProps
  state: string
  tipoArticulo: TipoArticulo
  updatedAt: string
  usucre: string
  usumod: string
  verificarStock: boolean
}

export interface TipoArticulo {
  codigo: number
  createdAt: string
  descripcion: string
  grupoUnidadMedida: GrupoUnidadMedida
  state: string
  updatedAt: string
  usucre: string
  usumod: string
}

export interface GrupoArticulo {
  codigoGrupoArticulo: string
  nombreGrupoArticulo: string
}

export interface GrupoUnidadMedida {
  codigoGrupo: number
  createdAt: string
  definicion: {
    cantidadBase: number
    unidadMedida: ArticuloUnidadMedida
  }
  nombreGrupo: string
  state: string
  unidadMedidaBase: ArticuloUnidadMedida
  updatedAt: string
  usucre: string
  usumod: string
}
export interface Inventario {
  codigoArticulo: string
  createdAt: string
  detalle: {
    almacen: Almacen
    comprometido: number
    disponible: number
    lotes: {
      codigoLote: string
      comprometido: number
      disponible: number
      lote: Lote
      solicitado: number
      stock: number
    }
    orden: number
    solicitado: number
    stock: number
  }
  grupoUnidadMedida: GrupoUnidadMedida
  kardexPeriodo: {
    codigo: number
    createdAt: string
    descripcion: string
    documentoSector: SinTipoDocumentoSectorProps
    state: string
    updatedAt: string
    usucre: string
    usumod: string
  }
  nombreArticulo: string
  state: string
  sucursal: OrgFacturaSucursal
  totalComprometido: number
  totalDisponible: number
  totalSolicitado: number
  totalStock: number
  unidadMedida: ArticuloUnidadMedida
  unidadMedidaCompras: ArticuloUnidadMedida
  unidadMedidaInventario: ArticuloUnidadMedida
  updatedAt: string
  usucre: string
  usumod: string
}

export interface Lote {
  atributo1: string
  atributo2: string
  atributo3: string
  codigoLote: string
  createdAt: string
  descripcion: string
  fechaAdmision: string
  fechaFabricacion: string
  fechaVencimiento: string
  state: string
  sucursal: OrgFacturaSucursal
  updatedAt: string
  usucre: string
  usumod: string
}

export interface OrgFacturaSucursal {
  codigo: string
  departamento: string
  direccion: string
  municipio: string
  telefono: string
}

export interface Almacen {
  codigoAlmacen: string
  createdAt: string
  nombre: string
  state: string
  sucursal: OrgFacturaSucursal
  ubicacion: string
  updatedAt: string
  usucre: string
  usumod: string
}
export interface ArticuloUnidadMedida {
  altura: number
  ancho: number
  codigoUnidadMedida: string
  createdAt: string
  longitud: number
  nombreUnidadMedida: string
  peso: number
  sinUnidadMedida: SinUnidadMedidaProps
  state: string
  updatedAt: string
  usucre: string
  usumod: string
  volumen: number
}

export interface ArticuloDescuento {
  cantidad: ArticuloDescuentoCantidad
  fechaFinal: string
  fechaInicial: string
  porcentaje: number
}

export interface ArticuloDescuentoCantidad {
  nro: number
  porcentaje: number
}

export interface ImagenCloud {
  filename: string
  id: string
  variants: ImagenCloudVariant
}

export interface ImagenCloudVariant {
  medium: string
  public: string
  square: string
  thumbnail: string
}

export interface MonedaPrecio {
  manual: boolean
  moneda: MonedaProps
  precio: number
  precioBase: number
  precioComparacion: number
}

export interface ArticuloPrecio {
  articuloUnidadMedida: ArticuloUnidadMedida
  cantidadBase: number
  descuento: ArticuloDescuento
  factorAjuste: number
  imagen: ImagenCloud
  monedaAdicional1: MonedaPrecio
  monedaAdicional2: MonedaPrecio
  monedaAdicional3: MonedaPrecio
  monedaPrimaria: MonedaPrecio
  umCompra: Boolean
  umInventario: Boolean
  umVenta: Boolean
}

const fragmentArticuloFields = gql`
  fragment ArticuloFields on Articulo {
    _id
    codigoArticulo
    nombreArticulo
    complemento
    listaComplemento {
      id
      codigoArticulo
      nombreArticulo
    }
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
`

const queryREST_ARTICULOS = gql`
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
        ...ArticuloFields
      }
    }
  }
  ${fragmentArticuloFields}
`

const queryLISTADO_POR_INVENTARIO_ENTIDAD = gql`
  query LISTADO_POR_INVENTARIO_ENTIDAD($cds: Int!, $entidad: EntidadParamsInput!) {
    articuloEntidadInventarioListado(cds: $cds, entidad: $entidad) {
      ...ArticuloFields
    }
  }
  ${fragmentArticuloFields}
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

    const data: any = await client.request(queryREST_ARTICULOS, queryVariables)
    return data.articuloListado
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

/**
 * @description Consumo de la API para el listado por inventario de entidad
 * @param cds Código de CDS
 */
export const apiListadoPorInventarioEntidad = async (entidad: EntidadParamsInput) => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(queryLISTADO_POR_INVENTARIO_ENTIDAD, {
      cds: 1,
      entidad,
    })
    return data
  } catch (e: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error al obtener los artículos',
      text: e.message,
    })
    throw new MyGraphQlError(e)
  }
}

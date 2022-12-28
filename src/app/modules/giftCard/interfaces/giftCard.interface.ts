import { ImagenProps } from '../../../base/interfaces/base'
import { genRandomString } from '../../../utils/helper'
import { ProductoVarianteInventarioProps } from '../../productos/interfaces/producto.interface'
import { ProveedorProps } from '../../proveedor/interfaces/proveedor.interface'
import {
  SinActividadesProps,
  SinProductoServicioProps,
  SinUnidadMedidaProps,
} from '../../sin/interfaces/sin.interface'
import { TipoProductoProps } from '../../tipoProducto/interfaces/tipoProducto.interface'

export interface GiftCardVarianteProps {
  _id?: string
  codigoBarras: string
  codigoProducto: string
  createdAt: string
  id: string
  imagen: ImagenProps
  incluirCantidad: boolean
  inventario: any[]
  nombre: string
  precio: number
  sinProductoServicio: SinProductoServicioProps
  state: string
  titulo: string
  unidadMedida: SinUnidadMedidaProps
  updatedAt: string
  usucre: string
  usumod: string
  verificarStock: boolean
}

export interface GiftCardProps {
  _id: string
  actividadEconomica: SinActividadesProps
  createdAt: string
  descripcion: string
  descripcionHtml: string
  imagenDestacada: ImagenProps
  proveedor: ProveedorProps
  state: string
  tipoProducto: TipoProductoProps
  titulo: string
  totalVariantes: number
  updatedAt: string
  usucre: string
  usumod: string
  variantes: [GiftCardVarianteProps]
  varianteUnica: boolean
}

export interface GiftCardVarianteInputProps {
  id: string
  codigoProducto: string // identificador o codigo unico
  titulo: string // nombre propio
  codigoBarras: string | null
  precio: number
  incluirCantidad: boolean // Incluye cantidad por cada item producto
  verificarStock: boolean // Continuar venta aun si el stock ha terminado
  inventario: ProductoVarianteInventarioProps[]
}

export interface GiftCardInputProps {
  actividad: SinActividadesProps | null
  proveedor: ProveedorProps | null
  sinProductoServicio: SinProductoServicioProps | null
  codigo: string
  descripcion: string
  descripcionHtml: string
  tipoProducto: TipoProductoProps | null
  titulo: string
  variantes: GiftCardVarianteInputProps[]
}

/**
 * API Variante de producto
 */
export interface GiftCardVarianteApiInputProps {
  id: string
  codigoProducto: string
  codigoProductoSin: string
  titulo: string
  precio: number
  incluirCantidad: boolean
  verificarStock: boolean
  inventario: []
}

/**
 * API registro gift-card
 */
export interface GiftCardApiInputProps {
  titulo: string
  descripcion: string
  descripcionHtml: string
  codigoActividad: string
  tipoProductoId: string | null
  codigoProveedor: string | null
  variantes: GiftCardVarianteApiInputProps[]
}

/**
 * Valores iniciales para una variante
 */
export const GIFT_CARD_VARIANTE_INITIAL_VALUES: GiftCardVarianteInputProps = {
  id: genRandomString(10),
  codigoProducto: '',
  titulo: '',
  codigoBarras: null,
  precio: 0,
  incluirCantidad: false,
  verificarStock: false,
  inventario: [],
}
/**
 * valores iniciales para un nuevo producto
 */
export const GIFT_CARD_INITIAL_VALUES: GiftCardInputProps = {
  actividad: null,
  proveedor: null,
  codigo: '',
  descripcion: '',
  descripcionHtml: '<span></span>',
  sinProductoServicio: null,
  tipoProducto: null,
  titulo: '',
  variantes: [GIFT_CARD_VARIANTE_INITIAL_VALUES],
}

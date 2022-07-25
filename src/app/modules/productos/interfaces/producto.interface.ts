import {ImagenProps, TipoProductoProps} from "../../../base/interfaces/base";
import {
    SinActividadesPorDocumentoSector,
    SinProductoServicioProps,
    SinUnidadMedidaProps
} from "../../sin/interfaces/sin.interface";
import {InventarioProps} from "./inventario.interface";
import {SucursalProps} from "../../sucursal/interfaces/sucursal";
import {genRandomString} from "../../../utils/helper";
import {ProveedorProps} from "../../proveedor/interfaces/proveedor.interface";

export interface ProductoVarianteProps {
    codigoProducto: string // identificador o codigo unico
    producto?: ProductoProps
    titulo: string // nombre propio
    nombre: string // nombre producto + titulo
    disponibleParaVenta: boolean
    codigoBarras: string | null
    precio: number
    precioComparacion: number
    imagen?: ImagenProps
    inventario: Array<InventarioProps>
    peso: number
    unidadMedida: SinUnidadMedidaProps
}

export interface ProductoProps {
    _id: string,
    sinProductoServicio: SinProductoServicioProps
    titulo: string
    descripcion: string
    descripcionHtml: string
    tipoProducto: string | null
    totalVariantes: number
    seguimientoInventario: boolean
    imagenDestacada?: ImagenProps // url de la imagen
    varianteUnica: boolean // si solo tienen una sola variante
    incluirCantidad: boolean // si se tiene cantidad en inventario
    proveedor: string | null // nombre del proveedor si vale el caso
    variantes: ProductoVarianteProps[]
    inventario: Array<InventarioProps>
    usucre: string
    createdAt?: Date
    usumod?: string
    updatedAt?: Date
    state?: string
}

export interface ProductoVarianteInventarioProps {
    sucursal: SucursalProps,
    stock: number
}

export interface ProductoVarianteInputProps {
    id: string
    codigoProducto: string // identificador o codigo unico
    titulo: string // nombre propio
    nombre: string // nombre producto + titulo
    disponibleParaVenta: boolean
    codigoBarras: string | null
    precio: number
    precioComparacion?: number
    costo: number
    incluirCantidadInventario: boolean,
    habilitarStock: boolean, // Si se habilita, se introduce cantidad en stock
    inventario: ProductoVarianteInventarioProps[]
    peso?: number
    unidadMedida: SinUnidadMedidaProps | null
}

export interface OpcionesProductoProps {
    id: number,
    nombre: string
    valores: string[]
}

export interface ProductoInputProps {
    actividadEconomica: SinActividadesPorDocumentoSector | undefined,
    sinProductoServicio: SinProductoServicioProps | undefined,
    titulo: string,
    descripcion: string,
    descripcionHtml: string,
    varianteUnica: boolean
    incluirCantidad: boolean,
    variante: ProductoVarianteInputProps
    opcionesProducto: Array<OpcionesProductoProps>
    tipoProducto: TipoProductoProps | null,
    tipoProductoPersonalizado: string,
    variantes: ProductoVarianteInputProps[]
    proveedor: ProveedorProps | null
}

/**
 * Valores iniciales para una variante
 */
export const ProductoVarianteInitialValues = {
    id: genRandomString(5),
    codigoProducto: 'COD1',
    titulo: '',
    nombre: '',
    disponibleParaVenta: true,
    codigoBarras: '',
    precio: 350,
    precioComparacion: 0,
    costo: 300,
    incluirCantidadInventario: true,
    habilitarStock: true,
    inventario: [],
    unidadMedida: null,
}
/**
 * valores iniciales para un nuevo producto
 */
export const ProductoInitialValues: ProductoInputProps = {
    actividadEconomica: undefined,
    sinProductoServicio: undefined,
    titulo: 'Instalacion ISIPASS V1.1',
    descripcion: '',
    descripcionHtml: '<span></span>',
    varianteUnica: true,
    incluirCantidad: true,
    variante: ProductoVarianteInitialValues,
    opcionesProducto: [],
    tipoProducto: null,
    tipoProductoPersonalizado: '',
    variantes: [],
    proveedor: null
}


export interface ProductoVarianteApiProps {
    id: string
    codigoProducto: string
    titulo: string
    precio: number
    precioComparacion: number
    costo: number
    incluirCantidadInventario: boolean
    habilitarStock: boolean
    codigoUnidadMedida: number
    inventario: { codigoSucursal: number, stock: number | null }
}
/**
 * Interface que nos permite registrar el producto, se usa para las apis
 */
export interface ProductoInputApiProps {
    codigoActividad: string,
    codigoProductoSin: string,
    titulo: string,
    descripcion: string
    descripcionHtml: string
    opcionesProducto:OpcionesProductoProps[],
    codigoTipoProducto: string | null
    tipoProductoPersonalizado: string | null
    varianteUnica: boolean
    codigoProveedor: string | null
    variantes:ProductoVarianteApiProps[]
}

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
    id: string
    codigoProducto: string // identificador o codigo unico
    titulo: string // nombre propio
    nombre: string // nombre producto + titulo
    disponibleParaVenta: boolean
    codigoBarras: string | null
    precio: number
    costo: number
    precioComparacion: number
    incluirStock: boolean // Si se
    imagen?: ImagenProps
    inventario: Array<InventarioProps>
    peso: number
    unidadMedida: SinUnidadMedidaProps
}

interface ProductoDefinitionProps {
    _id: string,
    sinProductoServicio: SinProductoServicioProps
    titulo: string
    descripcion: string
    descripcionHtml: string
    tipoProducto: TipoProductoProps | null
    totalVariantes: number
    imagenDestacada?: ImagenProps // url de la imagen
    varianteUnica: boolean // si solo tienen una sola variante
    incluirCantidad: boolean // si se tiene cantidad en inventario
    verificarStock: boolean // continuar venta si el stock esta agodao
    proveedor: ProveedorProps | null // nombre del proveedor si vale el caso
    opcionesProducto: Array<OpcionesProductoProps>
    inventario: Array<InventarioProps>
    usucre: string
    createdAt?: Date
    usumod?: string
    updatedAt?: Date
    state?: string
}

export interface ProductoProps extends ProductoDefinitionProps {
    variantes: ProductoVarianteProps[]

}

export interface ProductosVariantesProps extends ProductoDefinitionProps {
    variantes: ProductoVarianteProps
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
    inventario: ProductoVarianteInventarioProps[]
    peso?: number
    unidadMedida: SinUnidadMedidaProps | null
}

// SE USA CUANDO SE QUIERE REGISTRAR UN PRODUCTO TEMPORAL
export interface ProductoVarianteInputTempProps extends ProductoVarianteInputProps{
    sinProductoServicio: SinProductoServicioProps
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
    verificarStock: boolean, // Continuar venta aun si el stock ha terminado
    variante: ProductoVarianteInputProps
    opcionesProducto: Array<OpcionesProductoProps>
    tipoProducto: TipoProductoProps | null,
    tipoProductoPersonalizado: string | null,
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
    inventario: [],
    unidadMedida: null,
}
/**
 * valores iniciales para un nuevo producto
 */
export const ProductoInitialValues: ProductoInputProps = {
    actividadEconomica: undefined,
    sinProductoServicio: undefined,
    titulo: 'Instalación ISIPASS',
    descripcion: '',
    descripcionHtml: '<span></span>',
    varianteUnica: true,
    incluirCantidad: true,
    verificarStock: true,
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
    codigoUnidadMedida: number
    inventario: { codigoSucursal: number, stock: number }
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
    opcionesProducto: OpcionesProductoProps[],
    codigoTipoProducto: string | null
    tipoProductoPersonalizado: string | null
    varianteUnica: boolean
    incluirCantidad: boolean
    codigoProveedor: string | null
    variantes: ProductoVarianteApiProps[]
}

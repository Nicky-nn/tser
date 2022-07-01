import {ImagenProps} from "../../../base/interfaces/base";
import {SinProductoServicioProps, SinUnidadMedidaProps} from "../../sin/interfaces/sin.interface";
import {InventarioProps} from "./inventario.interface";

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
    proveedor: string | null // nombre del proveedor si vale el caso
    variantes: ProductoVarianteProps[]
    usucre: string
    createdAt?: Date
    usumod?: string
    updatedAt?: Date
    estado?: string
}

export interface ProductoVarianteInputProps {
    codigoProducto: string // identificador o codigo unico
    titulo: string // nombre propio
    nombre: string // nombre producto + titulo
    disponibleParaVenta: boolean
    codigoBarras: string | null
    precio: number
    precioComparacion: number
    costo: number
    inventario: {
        codigoSucursal: number | undefined,
        stock: number | undefined
    }
    peso: number
    codigoUnidadMedida: number
}

export interface ProductoInputProps {
    codigoProductoSin: string | null,
    titulo: string,
    descripcion: string,
    descripcionHtml: string,
    varianteUnica: boolean
    varianteDefault: {
        codigoProducto: string | undefined
        titulo: string,
        disponibleParaVenta: boolean,
        codigoBarras?: string,
        precio: number | undefined,
        precioComparacion: number | undefined
        costo: number | undefined
        cantidadVendible: number | undefined,
        codigoUnidadMedida: number | undefined,
        inventario: {
            codigoSucursal: number | undefined,
            stock: number | undefined
        }
    }
    opcionesProducto: Array<{
        id: number,
        nombre: string
        valores: [String] | []
    }>
    variantes: ProductoVarianteInputProps[]
}

export const ProductoInitialValues: ProductoInputProps = {
    codigoProductoSin: null,
    titulo: '',
    descripcion: '',
    descripcionHtml: '<span></span>',
    varianteUnica: false,
    varianteDefault: {
        codigoProducto: undefined,
        titulo: '',
        disponibleParaVenta: true,
        precio: undefined,
        precioComparacion: undefined,
        costo: undefined,
        cantidadVendible: 100,
        codigoUnidadMedida: undefined,
        inventario: {
            codigoSucursal: undefined,
            stock: undefined
        }
    },
    opcionesProducto: [],
    variantes: []
}

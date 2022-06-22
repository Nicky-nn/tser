import {SucursalProps} from "../../../interfaces";

export interface ImagenProps {
    altText: string
    url: string
}

export interface UnidadMedidaProps {
    codigoClasificador: number
    descripcion: string
}

export interface SinProductoServicioProps {
    codigoActividad: string
    codigoProducto: string
    descripcionProducto: string
}

// El rango de precios del producto con precios formateados como decimales.
export interface ProductoPrecioRangoProps {
    precioVarianteMaximo: number
    precioVarianteMinimo: number
}

export interface OpcionesVarianteProps {
    nombre: string
    valor: string
}

export interface ItemInventarioProp {
    sucursal: SucursalProps
    costo: number
    stock: number
}
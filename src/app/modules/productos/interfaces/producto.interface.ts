export interface ImagenProps {
    altText: string
    url: string
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
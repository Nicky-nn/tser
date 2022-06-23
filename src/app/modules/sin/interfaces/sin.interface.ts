export interface SinUnidadMedidaProps {
    codigoClasificador: number
    descripcion: string
}
export interface SinTipoDocumentoSectorProps {
    codigoClasificador: number
    descripcion: string
}
export interface SinTipoMetodoPagoProps {
    codigoClasificador: number
    descripcion: string
}
export interface SinMotivoAnulacionProps {
    codigoClasificador: number
    descripcion: string
}

export interface SinTipoMonedaProps {
    codigoClasificador: number
    descripcion: string
}
export interface SinTipoPuntoVentaProps {
    codigoClasificador: number
    descripcion: string
}
export interface SinTipoEmisionProps {
    codigoClasificador: number
    descripcion: string
}
export interface SinTipoFacturaProps {
    codigoClasificador: number
    descripcion: string
}
export interface SinActividadesProps {
    codigoCaeb: string
    descripcion: string
    tipoActividad: string
}
export interface SinProductoServicioProps {
    codigoActividad: string
    codigoProducto: string
    descripcionProducto: string
}

export interface MontoProps {
    monto: number
    moneda: SinTipoMonedaProps
    tipoCambio: number
}

export interface SinCufdProps {
    codigo: string,
    codigoControl: string,
    direccion: string,
    fechaInicial: string,
    fechaVigencia: string
}

export interface SinCuisProps {
    codigo: string
    fechaVigencia: string
}

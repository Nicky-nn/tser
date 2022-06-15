export interface SinUnidadMedidaProps {
    codigoClasificador: number
    descripcion: string
}

export interface SinTipoMonedaProps {
    codigoClasificador: number
    descripcion: string
}

export interface MontoProps {
    monto: number
    moneda: SinTipoMonedaProps
    tipoCambio: number
}

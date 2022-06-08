import {ClienteProps} from "../../../base/api/cliente.api";

export interface FacturaDetalleProps {
    cantidad: number
    codigoProducto: string
    codigoProductoSin: string
    descripcion: string
    montoDescuento: number
    numeroImei: string
    numeroSerie: string
    precioUnitario: number
    unidadMedida: number
}

export interface FacturaInputProps {
    actividadEconomica: string
    tipoCliente: 'N' | '99002' | '99003'
    cliente: ClienteProps,
    codigoCliente: string
    codigoMetodoPago: number
    codigoMoneda: number
    descuentoAdicional: number
    detalle: FacturaDetalleProps[]
    detalleExtra?: string | null
    emailCliente?: string | null
    montoGiftCard?: number | null
    numeroTarjeta?: string | null
    tipoCambio: number | null
}

/**
 * Valores iniciales del formulario
 */
export const FacturaInitialValues: FacturaInputProps = {
    actividadEconomica: '620000',
    tipoCliente: 'N',
    cliente: {} as ClienteProps,
    codigoCliente: '',
    codigoMetodoPago: 1,
    codigoMoneda: 1,
    descuentoAdicional: 0,
    detalle: [] as FacturaDetalleProps[],
    detalleExtra: null,
    emailCliente: null,
    montoGiftCard: 0,
    numeroTarjeta: null,
    tipoCambio: 1
}
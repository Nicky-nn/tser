import {ClienteProps} from "../../../base/api/cliente.api";
import {ProductoVarianteProps} from "../../productos/api/producto.api";

export interface FacturaDetalleProps extends ProductoVarianteProps{
    inputCantidad: number
    inputPrecio: number
    inputDescuento: number
    inputMotivoDescuento: number
    detalleExtra: string
    subtotal: number
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
    montoPagar: number
    inputMontoPagar: number
    inputVuelto: number
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
    detalleExtra: '',
    emailCliente: null,
    montoGiftCard: 0,
    numeroTarjeta: null,
    tipoCambio: 1,
    montoPagar: 0,
    inputMontoPagar: 0,
    inputVuelto: 0
}
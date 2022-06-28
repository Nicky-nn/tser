import {ClienteProps} from "../../../base/api/cliente.api";
import {FacturaDetalleProps, FacturaInputProps} from "../../ventas/interfaces/factura";

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
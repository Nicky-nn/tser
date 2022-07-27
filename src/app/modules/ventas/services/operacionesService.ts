import {FacturaInputProps} from "../interfaces/factura";
import {genReplaceEmpty} from "../../../utils/helper";

export const montoPagarService = (factura: FacturaInputProps): number => {
    if(factura.detalle.length > 0) {
        const subTotal: number = factura.detalle.reduce((acc, cur) => acc + (cur.cantidad * cur.precioUnitario) - cur.montoDescuento, 0) || 0;
        return subTotal - factura.descuentoAdicional - genReplaceEmpty(factura.montoGiftCard, 0)
    }
    return 0
}

export const montoSubTotal = (factura: FacturaInputProps): number => {
    if(factura.detalle.length > 0) {
        return  factura.detalle.reduce((acc, cur) => acc + (cur.cantidad * cur.precioUnitario) - cur.montoDescuento, 0) || 0;
    }
    return 0
}

export const montoInputVuelto = (factura: FacturaInputProps): number => {
    return factura.inputMontoPagar - factura.montoPagar
}
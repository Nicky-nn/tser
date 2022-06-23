import {FacturaInputProps} from "../interfaces/factura";

export const composeFactura = (fcv: FacturaInputProps): any => {
    const input = {
        codigoCliente: fcv.cliente.codigoCliente,
        actividadEconomica: fcv.actividadEconomica,
        codigoMetodoPago: fcv.codigoMetodoPago,
        descuentoAdicional: fcv.descuentoAdicional,
        detalleExtra: fcv.detalleExtra,
        emailCliente: fcv.cliente.email,
        detalle: fcv.detalle.map(item => ({
            codigoProductoSin: item.producto?.sinProductoServicio.codigoProducto,
            codigoProducto: item.codigoProducto,
            descripcion: item.nombre,
            cantidad: item.inputCantidad,
            unidadMedida: parseInt(item.unidadMedida.codigoClasificador.toString()),
            precioUnitario: item.inputPrecio,
            montoDescuento: item.inputDescuento
        }))
    }
    console.log('INPUT', input)
    return input
}
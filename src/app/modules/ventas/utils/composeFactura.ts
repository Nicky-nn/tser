import {FacturaInputProps} from "../interfaces/factura";

export const composeFactura = (fcv: FacturaInputProps) => {
    const input = {
        codigoCliente: fcv.cliente.codigoCliente,
        actividadEconomica: fcv.actividadEconomica,
        codigoMetodoPago: fcv.codigoMetodoPago,
        descuentoAdicional: fcv.descuentoAdicional,
        numeroTarjeta: fcv.numeroTarjeta,
        detalleExtra: fcv.detalleExtra,
        emailCliente: fcv.cliente.email,
        detalle: fcv.detalle.map(item => ({
            codigoProductoSin: item.producto?.sinProductoServicio.codigoProducto,
            codigoProducto: item.codigoProducto,
            descripcion: item.nombre,
            cantidad: item.inputCantidad,
            unidadMedida: item.unidadMedida.codigoClasificador,
            precioUnitario: item.inputPrecio,
            montoDescuento: item.inputDescuento
        }))
    }
    console.log(input)
    return input
}
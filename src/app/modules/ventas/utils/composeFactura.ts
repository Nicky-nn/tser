import { array, number, object, setLocale, string } from 'yup';
import { es } from 'yup-locales';

import { FacturaInputProps } from '../interfaces/factura';

export const composeFactura = (fcv: FacturaInputProps): any => {
  const input = {
    codigoCliente: fcv.cliente!.codigoCliente,
    actividadEconomica: fcv.actividadEconomica.codigoCaeb,
    codigoMetodoPago: parseInt(fcv.codigoMetodoPago.toString()),
    descuentoAdicional: fcv.descuentoAdicional,
    detalleExtra: fcv.detalleExtra,
    emailCliente: fcv.emailCliente,
    detalle: fcv.detalle.map((item) => ({
      codigoProductoSin: item.codigoProductoSin,
      codigoProducto: item.codigoProducto,
      descripcion: [item.nombre, item.detalleExtra || ''].join(' '),
      cantidad: item.cantidad,
      unidadMedida: parseInt(item.unidadMedida.codigoClasificador.toString()),
      precioUnitario: item.precioUnitario,
      montoDescuento: item.montoDescuento,
    })),
  };
  if (fcv.numeroTarjeta) {
    return { ...input, numeroTarjeta: fcv.numeroTarjeta };
  }
  return input;
};
export const composeFacturaValidator = async (fcv: any): Promise<boolean> => {
  setLocale(es);
  const schema = object({
    codigoCliente: string()
      .min(1)
      .max(100)
      .required('Debe seleccionar los datos del cliente'),
    codigoMetodoPago: number().integer().min(1).max(308).required(),
    numeroTarjeta: string().max(16),
    montoGiftCard: number().min(0).nullable(),
    codigoMoneda: number().integer().min(1).max(153),
    tipoCambio: number().min(0),
    descuentoAdicional: number().min(0).required(),
    actividadEconomica: string().required(),
    detalle: array()
      .of(
        object({
          codigoProductoSin: number().integer().min(1).max(99999999).required(),
          codigoProducto: string().min(1).max(50).required(),
          descripcion: string().min(1).max(500).required(),
          cantidad: number().min(0).required(),
          unidadMedida: number().integer().min(1).required(),
          precioUnitario: number().min(0).required(),
          montoDescuento: number().min(0),
          numeroSerie: string().min(0).max(1500),
          numeroImei: string().min(0).max(1500),
        }),
      )
      .min(1, 'Debe seleccionar al menos 1 productos / servicio para el detalle'),
  });
  await schema.validate(fcv);
  return true;
};

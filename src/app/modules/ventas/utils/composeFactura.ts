import DOMPurify from 'dompurify'
import { array, number, object, setLocale, string } from 'yup'
import { es } from 'yup-locales'

import { genReplaceEmpty } from '../../../utils/helper'
import { genRound } from '../../../utils/utils'
import { FacturaInputProps } from '../interfaces/factura'

const calculoMonedaBs = (monto: number, tipoCambioBs: number): number => {
  try {
    return genRound(monto * tipoCambioBs)
  } catch (e) {
    return monto
  }
}

export const composeFactura = (fcv: FacturaInputProps): any => {
  const detalleExtra = DOMPurify.sanitize(genReplaceEmpty(fcv.detalleExtra, ''), {
    FORBID_ATTR: ['style'],
  }).replace(/\n\s+|\n/g, '')

  const input = {
    codigoCliente: fcv.cliente!.codigoCliente,
    actividadEconomica: fcv.actividadEconomica?.codigoActividad,
    codigoMetodoPago: fcv.codigoMetodoPago.codigoClasificador,
    descuentoAdicional: calculoMonedaBs(fcv.descuentoAdicional, fcv.tipoCambio),
    detalleExtra,
    emailCliente: fcv.emailCliente,
    codigoMoneda: fcv.moneda!.codigo,
    tipoCambio: fcv.moneda!.tipoCambio,
    codigoExcepcion: fcv.codigoExcepcion ? 1 : 0,
    detalle: fcv.detalle.map((item) => ({
      codigoActividad: item.sinProductoServicio.codigoActividad,
      codigoProductoSin: item.codigoProductoSin,
      codigoProducto: item.codigoProducto,
      descripcion: item.nombre,
      cantidad: item.cantidad,
      unidadMedida: parseInt(item.unidadMedida.codigoClasificador.toString()),
      precioUnitario: calculoMonedaBs(
        genReplaceEmpty(item.precioUnitario, 0),
        fcv.tipoCambio,
      ),
      montoDescuento: calculoMonedaBs(
        genReplaceEmpty(item.montoDescuento, 0),
        fcv.tipoCambio,
      ),
      detalleExtra: genReplaceEmpty(item.detalleExtra, ''),
    })),
  }
  if (fcv.numeroTarjeta) {
    return { ...input, numeroTarjeta: fcv.numeroTarjeta }
  }
  return input
}

export const composeFacturaValidator = async (fcv: any): Promise<boolean> => {
  setLocale(es)
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
          cantidad: number().positive().required(),
          unidadMedida: number().integer().min(1).required(),
          precioUnitario: number().positive().required(),
          montoDescuento: number().min(0),
          numeroSerie: string().min(0).max(1500),
          numeroImei: string().min(0).max(1500),
        }),
      )
      .min(1, 'Debe seleccionar al menos 1 productos / servicio para el detalle'),
  })
  await schema.validate(fcv)
  return true
}

import dayjs from 'dayjs'

import {
  GIFT_CARD_ESTADO_VALUES,
  GiftCardApiInputProps,
  GiftCardInputProps,
  GiftCardProps,
  GiftCardVarianteApiInputProps,
  GiftCardVarianteInputProps,
} from '../interfaces/giftCard.interface'
import { genRandomString } from '../../../utils/helper'
import { parse } from 'date-fns'

/**
 * Componemos el producto para su posterior guardado
 * @param prod
 */
export const giftCardComposeService = (
  prod: GiftCardInputProps,
): GiftCardApiInputProps => {
  const variantes: GiftCardVarianteApiInputProps[] = []
  // MULTIPLES VARIANTES
  prod.variantes.forEach((item) => {
    variantes.push({
      codigoProducto: item.codigoProducto,
      codigoProductoSin: prod.sinProductoServicio?.codigoProducto!,
      titulo: `${item.titulo}`,
      precio: item.precio,
      incluirCantidad: item.incluirCantidad,
      verificarStock: false,
      inventario: item.inventario.map((ii) => ({
        codigoSucursal: ii.sucursal.codigo,
        stock: item.incluirCantidad ? ii.stock : 0,
      })),
    })
  })

  return {
    titulo: prod.titulo,
    descripcion: prod.descripcion,
    descripcionHtml: prod.descripcionHtml,
    codigoActividad: prod.actividad?.codigoCaeb!,
    tipoProductoId: prod.tipoProducto?._id || null,
    codigoProveedor: prod.proveedor?.codigo || null,
    disponibilidad: dayjs(prod.fechaInicio).format('DD/MM/YYYY HH:mm:ss').toString(),
    activo: prod.estado.key === 1,
    variantes: variantes,
  }
}

/**
 * Componemos el producto para su posterior guardado
 * @param input
 */
export const giftCardDecomposeService = (input: GiftCardProps): GiftCardInputProps => {
  const variantes: GiftCardVarianteInputProps[] = []
  // MULTIPLES VARIANTES
  input.variantes.forEach((item) => {
    variantes.push({
      id: genRandomString(),
      codigoProducto: item.codigoProducto,
      titulo: item.titulo,
      codigoBarras: item.codigoBarras || null,
      precio: item.precio,
      incluirCantidad: item.incluirCantidad,
      verificarStock: item.verificarStock,
      inventario: item.inventario,
    })
  })

  return {
    titulo: input.titulo,
    descripcion: input.descripcion,
    descripcionHtml: input.descripcionHtml,
    actividad: input.actividadEconomica,
    proveedor: input.proveedor || null,
    sinProductoServicio: input.variantes[0].sinProductoServicio,
    codigo: '',
    tipoProducto: input.tipoProducto,
    variante: variantes[0],
    variantes: variantes,
    fechaInicio: parse(input.disponibilidad, 'dd/MM/yyyy HH:mm:ss', new Date()),
    action: 'UPDATE',
    estado: GIFT_CARD_ESTADO_VALUES.find((k) => k.key === (input.activo ? 1 : 0))!,
  }
}

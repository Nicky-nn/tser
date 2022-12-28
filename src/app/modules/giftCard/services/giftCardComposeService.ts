import {
  GiftCardApiInputProps,
  GiftCardInputProps,
  GiftCardProps,
  GiftCardVarianteApiInputProps,
  GiftCardVarianteInputProps,
} from '../interfaces/giftCard.interface'

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
      id: item.id,
      codigoProducto: item.codigoProducto,
      codigoProductoSin: prod.sinProductoServicio?.codigoProducto!,
      titulo: `${prod.titulo} ${item.titulo}`,
      precio: item.precio,
      incluirCantidad: false,
      verificarStock: false,
      inventario: [],
    })
  })

  return {
    titulo: prod.titulo,
    descripcion: prod.descripcion,
    descripcionHtml: prod.descripcionHtml,
    codigoActividad: prod.actividad?.codigoCaeb!,
    tipoProductoId: prod.tipoProducto?._id || null,
    codigoProveedor: prod.proveedor?.codigo || null,
    variantes: variantes,
  }
}

/**
 * Descomponemos la gift card para autorrellenar el formulario
 * @param prod
 */
export const giftCardComposeInputService = (prod: GiftCardProps): GiftCardInputProps => {
  const variantes: GiftCardVarianteInputProps[] = []
  // MULTIPLES VARIANTES
  prod.variantes.forEach((item) => {
    variantes.push({
      id: item.id,
      codigoProducto: item.codigoProducto,
      titulo: item.titulo,
      codigoBarras: null,
      precio: item.precio,
      incluirCantidad: item.incluirCantidad,
      verificarStock: item.verificarStock,
      inventario: item.inventario,
    })
  })

  return {
    actividad: prod.actividadEconomica,
    proveedor: prod.proveedor || null,
    sinProductoServicio: prod.variantes[0].sinProductoServicio,
    codigo: 'NAV',
    descripcion: prod.descripcion,
    descripcionHtml: prod.descripcionHtml,
    tipoProducto: prod.tipoProducto || null,
    titulo: prod.titulo,
    variantes: variantes,
  }
}

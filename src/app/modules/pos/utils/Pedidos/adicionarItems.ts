import { PuntoVentaProps } from '../../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../../interfaces/sucursal'
import { swalException } from '../../../../utils/swal'
import { adicionarItems } from '../../api/UDPedido.api'

export const adicionarItemPedido = async (
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  nroPedido: number,
  dataDelete: any,
  data: any,
  onSuccess?: () => void,
) => {
  const entidad = {
    codigoSucursal: sucursal.codigo,
    codigoPuntoVenta: puntoVenta.codigo,
  }

  const codigoMoneda = 1

  // Filtrar los productos nuevos que no provienen de la base de datos
  const newProducts = data.filter(
    (producto: { fromDatabase: any }) => !producto.fromDatabase,
  )

  // Filtrar los productos que no están en la lista de eliminados
  const filteredDataToDelete = dataDelete.filter(
    (producto: { fromDatabase: any }) => !producto.fromDatabase,
  )

  // Construir el objeto productos según los productos filtrados
  const productos = newProducts
    .filter(
      (producto: { nroItem: any }) =>
        !filteredDataToDelete.some(
          (deletedProducto: { nroItem: any }) =>
            deletedProducto.nroItem === producto.nroItem,
        ),
    )
    .map(
      (producto: {
        listaComplemento: any[]
        codigoArticulo: any
        codigoArticuloUnidadMedida: any
        quantity: any
        price: any
        discount: any
        extraDetalle: any
        codigoAlmacen: any
        extraDescription: any
      }) => ({
        codigoArticulo: producto.codigoArticulo,
        articuloPrecio: {
          codigoArticuloUnidadMedida: producto.codigoArticuloUnidadMedida,
          cantidad: producto.quantity,
          precio: producto.price,
          descuento: producto.discount || 0,
          impuesto: 0, // 🔹 Ajusta esto si es necesario
        },
        complementos: producto.listaComplemento?.length
          ? producto.listaComplemento.map((complemento: any) => ({
              articuloPrecio: {
                cantidad: producto.quantity, // 🔹 La cantidad del complemento = cantidad del producto
                codigoArticuloUnidadMedida:
                  complemento?.articuloPrecioBase?.articuloUnidadMedida
                    ?.codigoUnidadMedida || null,
                descuento: 0,
                impuesto: 0,
                precio: 0,
              },
              codigoAlmacen:
                complemento?.inventario?.[0]?.detalle?.[0]?.almacen?.codigoAlmacen ||
                null,
              codigoArticulo: complemento?.codigoArticulo || null,
              codigoLote:
                complemento?.inventario?.[0]?.detalle?.[0]?.lotes?.[0]?.codigoLote ||
                null,
              detalleExtra: complemento?.detalleExtra || '',
              nota: '',
            }))
          : [], // 🔹 Array vacío si no hay complementos
        detalleExtra: producto.extraDetalle || '',
        codigoAlmacen: producto.codigoAlmacen || '', // 🔹 Ajusta esto si es necesario
        nota: producto.extraDescription || '',
      }),
    )

  try {
    const response = await adicionarItems(nroPedido, entidad, productos, codigoMoneda)
    if (onSuccess) onSuccess()
    return response
  } catch (error) {
    console.error('error', error)
    swalException(error)
    return false
  }
}

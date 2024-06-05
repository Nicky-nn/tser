import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../../interfaces/sucursal'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { restPedidoExpressRegistroApi } from '../../api/registarPedido.api'

export const restPedidoExpressRegistro = async (
  data: any,
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  mesa: string,
  onSuccess?: () => void,
) => {
  if (!data || data.length === 0) {
    toast.error('No hay productos para registrar')
    return false
  }

  if (!mesa) {
    toast.error('Debe seleccionar una mesa')
    return false
  }

  // Construir la entidad y el input
  const entidad = {
    codigoSucursal: sucursal.codigo, // Suponiendo que tienes el código de la sucursal
    codigoPuntoVenta: puntoVenta.codigo, // Suponiendo que tienes el código del punto de venta
  }

  const input = {
    mesa: { nombre: mesa, nroComensales: 1 }, // Suponiendo que 'mesa' es el nombre de la mesa
    productos: data.map((producto: any) => ({
      codigoArticulo: producto.codigoArticulo,
      articuloPrecio: {
        cantidad: producto.quantity,
        codigoArticuloUnidadMedida: producto.codigoArticuloUnidadMedida,
        precio: producto.price,
        descuento: producto.discount,
        impuesto: 0,
      },
      detalleExtra: producto.extraDetalle || '',
      codigoAlmacen: producto.codigoAlmacen,
      nota: producto.extraDescription,
    })),
    codigoMoneda: 1, // Suponiendo que el código de moneda es fijo
    tipoCambio: 1, // Suponiendo que el tipo de cambio es fijo
  }

  try {
    const confirmResp = await swalAsyncConfirmDialog({
      text: '¿Confirma que desea registrar el pedido?',
      preConfirm: async () => {
        // Llamar a la función que registra el pedido
        const response = await restPedidoExpressRegistroApi(entidad, input)
        return response
      },
    })

    if (confirmResp.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Pedido registrado',
        text: `El pedido fue registrado con éxito`,
      })
      if (onSuccess) onSuccess()
      return confirmResp.value
    }
  } catch (error) {
    console.error('error', error)
    swalException(error)
  }

  return false
}

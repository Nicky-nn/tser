import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../../interfaces/sucursal'
import { swalException } from '../../../../utils/swal'
import { restPedidoEliminarApi } from '../../api/pedidoEliminar.api'

export const eliminarPedidoTodo = async (
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  nroPedido: number,
  onSuccess?: () => void,
) => {
  // Construir la entidad
  const entidad = {
    codigoSucursal: sucursal.codigo, // Suponiendo que tienes el código de la sucursal
    codigoPuntoVenta: puntoVenta.codigo, // Suponiendo que tienes el código del punto de venta
  }

  try {
    const { value: confirmResp } = await Swal.fire({
      title: '¿Confirma que desea eliminar todo el pedido?',
      html:
        '<input type="checkbox" id="restablecerStock" />' +
        '<label for="restablecerStock"> Restablecer stock</label>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const restablecerStock = (
          document.getElementById('restablecerStock') as HTMLInputElement
        ).checked
        return { restablecerStock }
      },
    })

    if (confirmResp) {
      const response = await restPedidoEliminarApi(
        entidad,
        nroPedido,
        confirmResp.restablecerStock,
      )
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: `El pedido ${nroPedido} ha sido eliminado`,
      })
      if (onSuccess) onSuccess()
      return response
    }
  } catch (error) {
    console.error('error', error)
    swalException(error)
  }

  return false
}

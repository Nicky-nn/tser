import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../../interfaces/sucursal'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { eliminarItem } from '../../api/UDPedido.api'

export const eliminarPedido = async (
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  nroPedido: number,
  data: any,
  onSuccess?: () => void,
) => {
  // Construir la entidad y el input
  const entidad = {
    codigoSucursal: sucursal.codigo, // Suponiendo que tienes el código de la sucursal
    codigoPuntoVenta: puntoVenta.codigo, // Suponiendo que tienes el código del punto de venta
  }

  const input = data
    .filter((item: any) => item.fromDatabase)
    .map((item: any) => ({ nroItem: item.nroItem }))

  try {
    const confirmResp = await swalAsyncConfirmDialog({
      text: '¿Confirma que desea eliminar Item seleccionado?',
      preConfirm: async () => {
        // Llamar a la función que registra el pedido
        const response = await eliminarItem(nroPedido, entidad, input)
        return response
      },
    })

    if (confirmResp.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Item eliminado',
        text: `El item fue eliminado correctamente`,
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

import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../interfaces/sucursal'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { restPedidoFinalizarApi } from '../api/finalizarPedido.api'

export const finalizarPedido = async (
  data: any,
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  numeroPedido: number = 0 | 0,
  descuentoAdicional: number = 0,
  onSuccess?: () => void,
) => {
  if (numeroPedido === undefined || numeroPedido === 0) {
    toast.error('No se seleccionó un número de pedido')
    return false
  }
  if (data.cliente === null || data.cliente === undefined) {
    toast.error('No hay cliente seleccionado')
    return false
  }
  if (data.metodoPago === null || data.metodoPago === undefined) {
    toast.error('No hay método de pago seleccionado')
    return false
  }

  const entidad = {
    codigoSucursal: sucursal.codigo,
    codigoPuntoVenta: puntoVenta.codigo,
  }
  const cliente = {
    codigoCliente: data.cliente.codigoCliente,
    email: data.cliente.email,
  }

  let codigoMetodoPago: number
  if (typeof data.metodoPago === 'number') {
    codigoMetodoPago = data.metodoPago
  } else if (typeof data.metodoPago === 'object' && data.metodoPago.codigoClasificador) {
    codigoMetodoPago = data.metodoPago.codigoClasificador
  } else {
    toast.error('Método de pago inválido')
    return false
  }
  const input = {
    codigoMetodoPago,
    descuentoAdicional: descuentoAdicional,
    numeroTarjeta: codigoMetodoPago === 2 ? data.numeroTarjeta : null, // Aquí se agrega la condición
    montoGiftCard: 0,
    codigoMoneda: 1,
    otrosCostos: 0,
    descripcionOtrosCostos: null,
    montoTotal: 0,
  }

  try {
    const confirmResp = await swalAsyncConfirmDialog({
      title: 'Finalizar Pedido',
      text: '¿Está seguro de finalizar el pedido?, esta acción marcará el pedido como finalizado y no podrá ser modificado',
      preConfirm: async () => {
        const response = await restPedidoFinalizarApi(
          entidad,
          cliente,
          numeroPedido,
          input,
        )
        return response
      },
    })
    if (confirmResp.isConfirmed) {
      Swal.fire({
        title: 'Pedido finalizado',
        text: 'El pedido ha sido finalizado con éxito',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      })
      if (onSuccess) {
        onSuccess()
        return confirmResp.value
      }
    }
  } catch (error) {
    console.error('Error al finalizar pedido', error)
    swalException(error)
  }
  return false
}

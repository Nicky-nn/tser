import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../interfaces/sucursal'
import { swalException } from '../../../utils/swal'
import { restPedidoFacturaApi } from '../api/facturarPedido.api'

export const facturarPedido = async (
  data: any,
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  numeroPedido: number = 0,
  usuario: string | null,
  onSuccess?: () => void,
) => {
  if (!numeroPedido) {
    toast.error('No se seleccionó un número de pedido')
    return false
  }
  if (!data?.cliente) {
    toast.error('No hay cliente seleccionado')
    return false
  }

  const entidad = {
    codigoSucursal: sucursal.codigo,
    codigoPuntoVenta: puntoVenta.codigo,
  }
  const cliente = {
    codigoCliente: data.cliente.codigoCliente || data.numeroDocumento,
    email: data.emailCliente || data.cliente.email,
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
    codigoExcepcion:
      typeof data.codigoExcepcion === 'boolean'
        ? data.codigoExcepcion
          ? 1
          : 0
        : data.codigoExcepcion || 0,
    codigoMetodoPago,
    numeroTarjeta: codigoMetodoPago === 2 ? data.numeroTarjeta : null, // Aquí se agrega la condición
    codigoMoneda: 1,
    tipoCambio: 1,
    detalleExtra: null,
    usuario,
  }

  try {
    // Mostrar un mensaje de confirmación antes de emitir la factura
    const confirmResp = await Swal.fire({
      title: '¿Desea emitir la factura?',
      text: 'Una vez emitida, la factura no podrá ser modificada, y el pedido se marcará como finalizado',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    })

    // Si el usuario cancela, salir de la función
    if (!confirmResp.isConfirmed) {
      return false
    }

    // Mostrar un mensaje de "Cargando..."
    Swal.fire({
      title: 'Cargando...',
      text: 'Emisión de factura en proceso',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const response = await restPedidoFacturaApi(numeroPedido, cliente, entidad, input)

    // Si se recibe una respuesta, ocultar el mensaje de "Cargando..."
    Swal.close()

    if (response) {
      if (onSuccess) {
        onSuccess()
      }
      return response
    } else {
      toast.error('Error al Emitir Factura')
      return false
    }
  } catch (error) {
    console.error('Error en facturarPedido', error)
    // Si ocurre un error, ocultar el mensaje de "Cargando..." y mostrar el error
    Swal.close()
    swalException(error)
    return false
  }
}

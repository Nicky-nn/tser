import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../interfaces/sucursal'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiClienteRegistro } from '../../clientes/api/clienteRegistro.api'
import { restPedidoFinalizarApi } from '../api/finalizarPedido.api'

// Función para validar el formato del email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const finalizarPedido = async (
  data: any,
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  numeroPedido: number = 0,
  descuentoAdicional: number = 0,
  onSuccess?: () => void,
  isCreatingNewClient: boolean = false,
) => {
  try {
    // Crear cliente si es necesario
    if (isCreatingNewClient) {
      if (!data.sinTipoDocumento) {
        toast.error('No hay tipo de documento seleccionado')
        return false
      }

      if (!data.numeroDocumento || isNaN(data.numeroDocumento)) {
        toast.error('No hay número de documento')
        return false
      }
      if (!data.emailCliente || !isValidEmail(data.emailCliente)) {
        toast.error('El email del cliente no es válido')
        return false
      }

      if (!data.razonSocial) {
        toast.error('No hay razón social')
        return false
      }

      const confirmResp = await swalAsyncConfirmDialog({
        title: 'Cliente no encontrado',
        text: '¿Desea crear un nuevo cliente con los datos ingresados?',
        preConfirm: async () => {
          const input = {
            nombres: data.cliente.nombres,
            apellidos: data.cliente.apellidos,
            codigoTipoDocumentoIdentidad: Number(
              data.sinTipoDocumento?.codigoClasificador!,
            ),
            numeroDocumento: data.numeroDocumento,
            complemento: data.complemento,
            email: data.emailCliente,
            razonSocial: data.razonSocial,
            telefono: data.telefono,
            codigoExcepcion: 1,
          }
          try {
            const response = await apiClienteRegistro(input)
            return response
          } catch (error) {
            Swal.fire({
              title: 'Error',
              text: 'Error al crear el cliente',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500,
            })
            throw error
          }
        },
      })

      if (confirmResp.isConfirmed) {
        Swal.fire({
          title: 'Cliente creado',
          text: 'El cliente ha sido creado con éxito',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        })
      }
    }

    // Continuar con la finalización del pedido solo si se creó el cliente o si no es necesario crear uno nuevo
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
      codigoCliente: data.cliente.codigoCliente || data.numeroDocumento,
      email: data.emailCliente || data.cliente.email,
    }

    let codigoMetodoPago: number
    if (typeof data.metodoPago === 'number') {
      codigoMetodoPago = data.metodoPago
    } else if (
      typeof data.metodoPago === 'object' &&
      data.metodoPago.codigoClasificador
    ) {
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

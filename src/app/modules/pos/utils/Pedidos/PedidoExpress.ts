import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../../interfaces/sucursal'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { ClienteProps } from '../../../clientes/interfaces/cliente'
import { restPedidoExpressRegistroApi } from '../../api/registarPedido.api'

export interface ClienteOperacionInput {
  codigoCliente: string
  email: string
}

export const restPedidoExpressRegistro = async (
  data: any,
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  mesa: string,
  onSuccess?: () => void,
  tipoPedido?: string | null,
  cliente?: ClienteProps | null,
  dataDelivery?: any,
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
    codigoSucursal: sucursal.codigo,
    codigoPuntoVenta: puntoVenta.codigo,
  }
  const dataCliente = {
    codigoCliente: cliente?.codigoCliente || '',
    email: cliente?.email || '',
  } as ClienteOperacionInput

  const input: any = {
    tipo: tipoPedido,
    mesa: { nombre: mesa, nroComensales: 1 },
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
    codigoMoneda: 1,
    tipoCambio: 1,
  }

  // Añadir atributos de delivery solo si el tipo de pedido es "DELIVERY"
  if (tipoPedido === 'DELIVERY' && dataDelivery) {
    input.atributo1 = dataDelivery.atributo1 || ''
    input.atributo2 = dataDelivery.atributo2 || ''
    input.atributo3 = dataDelivery.atributo3 || ''
    input.atributo4 = dataDelivery.atributo4 || ''
    input.direccionEntrega = dataDelivery.direccionEntrega || ''
    input.fechaEntrega = dataDelivery.fechaEntrega || ''
    input.terminos = dataDelivery.terminos || ''
  }

  try {
    const confirmResp = await swalAsyncConfirmDialog({
      text: '¿Confirma que desea registrar el pedido?',
      preConfirm: async () => {
        // Llamar a la función que registra el pedido
        const response = await restPedidoExpressRegistroApi(entidad, dataCliente, input)
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

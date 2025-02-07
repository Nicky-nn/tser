import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../../interfaces/sucursal'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiClienteRegistro } from '../../../clientes/api/clienteRegistro.api'
import { ClienteProps } from '../../../clientes/interfaces/cliente'
import { restPedidoExpressRegistroApi } from '../../api/registarPedido.api'

export interface ClienteOperacionInput {
  codigoCliente: string
  email: string
}

// Función para validar el formato del email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const restPedidoExpressRegistro = async (
  cart: any,
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  mesa: string,
  onSuccess?: () => void,
  tipoPedido?: string | null,
  cliente?: ClienteProps | null,
  data?: any,
  isCreatingNewClient: boolean = false,
  messages?: {
    successTitle?: string
    successText?: string
    successConfirm?: string
  }, // Nuevo argumento opcional
) => {
  if (!cart || cart.length === 0) {
    toast.error('No hay productos para registrar')
    return false
  }

  if (!mesa) {
    toast.error('Debe seleccionar una mesa')
    return false
  }

  // Crear cliente si es necesario
  if (isCreatingNewClient) {
    if (!data?.sinTipoDocumento) {
      toast.error('No hay tipo de documento seleccionado')
      return false
    }

    if (!data?.numeroDocumento || isNaN(Number(data.numeroDocumento))) {
      toast.error('No hay número de documento')
      return false
    }

    if (!data?.emailCliente || !isValidEmail(data.emailCliente)) {
      toast.error('El email del cliente no es válido')
      return false
    }

    if (!data?.razonSocial) {
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
      // Actualizar el objeto cliente con los datos del nuevo cliente creado
      cliente = confirmResp.value
    } else {
      return false // Si el usuario cancela la creación del cliente, detener el proceso
    }
  }

  // Construir la entidad y el input
  const entidad = {
    codigoSucursal: sucursal.codigo,
    codigoPuntoVenta: puntoVenta.codigo,
  }

  const dataCliente = {
    codigoCliente: cliente?.codigoCliente || '',
    email: data.emailCliente || '',
    razonSocial: data.razonSocial || '',
    telefono: data.telefono || '',
  } as ClienteOperacionInput

  const input: any = {
    tipo: tipoPedido,
    mesa: { nombre: mesa, nroComensales: 1 },
    productos: cart.map((producto: any) => ({
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
      nota: producto.extraDescription || '',
      complementos: producto.listaComplemento?.length
        ? producto.listaComplemento.map((complemento: any) => ({
            articuloPrecio: {
              cantidad: producto.quantity, // 🔹 Ahora la cantidad del complemento es igual a la del producto
              codigoArticuloUnidadMedida:
                complemento?.articuloPrecioBase?.articuloUnidadMedida
                  ?.codigoUnidadMedida || null,
              descuento: 0,
              impuesto: 0,
              precio: 0,
            },
            codigoAlmacen:
              complemento?.inventario?.[0]?.detalle?.[0]?.almacen?.codigoAlmacen || null,
            codigoArticulo: complemento?.codigoArticulo || null,
            codigoLote:
              complemento?.inventario?.[0]?.detalle?.[0]?.lotes?.[0]?.codigoLote || null,
            detalleExtra: complemento?.detalleExtra || '',
            nota: '',
          }))
        : [], // 🔹 Si no hay complementos, el array queda vacío
    })),
    codigoMoneda: 1,
    tipoCambio: 1,
    nota: data?.notasGenerales || '',
  }

  // Añadir atributos de delivery solo si el tipo de pedido es "DELIVERY"
  if (tipoPedido === 'DELIVERY' && data) {
    input.atributo1 = data.atributo1 || ''
    input.atributo2 = data.atributo2 || ''
    input.atributo3 = data.atributo3 || ''
    input.atributo4 = data.atributo4 || ''
    input.direccionEntrega = data.direccionEntrega || ''
    input.fechaEntrega = data.fechaEntrega || ''
    input.terminos = data.terminos || ''
  }

  try {
    const confirmResp = await swalAsyncConfirmDialog({
      text: messages?.successConfirm || '¿Confirma que desea registrar el pedido?',
      preConfirm: async () => {
        // Llamar a la función que registra el pedido
        const response = await restPedidoExpressRegistroApi(entidad, dataCliente, input)
        return response
      },
    })

    if (confirmResp.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: messages?.successTitle || 'Pedido registrado.',
        text: messages?.successText || 'El pedido fue registrado con éxito.',
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

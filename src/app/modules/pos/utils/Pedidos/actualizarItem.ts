import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../../interfaces/sucursal'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiClienteRegistro } from '../../../clientes/api/clienteRegistro.api'
import { actualizarItem, InputPedidoActualizar } from '../../api/UDPedido.api'

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const actualizarItemPedido = async (
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  nroPedido: number,
  dataDelete: any,
  data: any,
  onSuccess?: () => void,
  cliente?: any,
  isCreatingNewClient: boolean = false,
  getClientData?: any,
) => {
  if (isCreatingNewClient) {
    if (!getClientData?.sinTipoDocumento) {
      toast.error('No hay tipo de documento seleccionado')
      return false
    }

    if (!getClientData?.numeroDocumento || isNaN(Number(getClientData.numeroDocumento))) {
      toast.error('No hay número de documento')
      return false
    }

    if (!getClientData?.emailCliente || !isValidEmail(getClientData.emailCliente)) {
      toast.error('El email del cliente no es válido')
      return false
    }

    if (!getClientData?.razonSocial) {
      toast.error('No hay razón social')
      return false
    }

    const confirmResp = await swalAsyncConfirmDialog({
      title: 'Cliente no encontrado',
      text: '¿Desea crear un nuevo cliente con los datos ingresados?',
      preConfirm: async () => {
        const input = {
          nombres: getClientData.cliente.nombres,
          apellidos: getClientData.cliente.apellidos,
          codigoTipoDocumentoIdentidad: Number(
            getClientData.sinTipoDocumento?.codigoClasificador!,
          ),
          numeroDocumento: getClientData.numeroDocumento,
          complemento: getClientData.complemento,
          email: getClientData.emailCliente,
          razonSocial: getClientData.razonSocial,
          telefono: getClientData.telefono,
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

  const entidad = {
    codigoSucursal: sucursal.codigo,
    codigoPuntoVenta: puntoVenta.codigo,
  }
  const codigoMoneda = 1

  // Filtrar los productos que cumplen con las condiciones requeridas
  const filteredData = data.filter(
    (producto: { fromDatabase: any }) => producto.fromDatabase,
  )

  // Filtrar los productos que no están en la lista de eliminados
  const filteredDataToDelete = dataDelete.filter(
    (producto: { fromDatabase: any }) => producto.fromDatabase,
  )

  // Construir el objeto productos según los productos filtrados
  const productos = filteredData
    .filter(
      (producto: { nroItem: any }) =>
        !filteredDataToDelete.some(
          (deletedProducto: { nroItem: any }) =>
            deletedProducto.nroItem === producto.nroItem,
        ),
    )
    .map(
      (producto: {
        nroItem: any
        quantity: any
        extraDetalle: any
        extraDescription: any
      }) => ({
        nroItem: producto.nroItem,
        cantidad: producto.quantity,
        detalleExtra: producto.extraDetalle || '',
        nota: producto.extraDescription || '',
      }),
    )

  // Extraer solo los campos necesarios de cliente
  const clienteActualizado = {
    codigoCliente: cliente?.codigoCliente || '',
    email: cliente?.email || '',
    razonSocial: cliente?.razonSocial || '',
    telefono: cliente?.telefono || '',
  }

  const input = {
    nota: getClientData.notasGenerales,
    tipo: getClientData.tipoPedido,
    atributo1: getClientData.atributo1,
    atributo2: getClientData.atributo2,
    atributo3: getClientData.atributo3,
    direccionEntrega: getClientData.direccionEntrega,
    fechaEntrega: getClientData.fechaEntrega,
  } as InputPedidoActualizar

  // Llamar a la función que registra el pedido
  try {
    Swal.fire({
      title: 'Cargando...',
      text: 'Actualizando pedido...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const response = await actualizarItem(
      nroPedido,
      entidad,
      productos,
      codigoMoneda,
      clienteActualizado, // Enviar el cliente con los campos requeridos
      input,
    )

    Swal.fire({
      icon: 'success',
      title: 'Pedido actualizado',
      text: `El pedido fue actualizado correctamente`,
    })
    if (onSuccess) onSuccess()
    return response
  } catch (error) {
    console.error('error', error)
    swalException(error)
    return false
  }
}

import Swal from 'sweetalert2'

import { PuntoVentaProps } from '../../../../interfaces/puntoVenta'
import { SucursalProps } from '../../../../interfaces/sucursal'
import { swalException } from '../../../../utils/swal'
import { actualizarItem } from '../../api/UDPedido.api'

export const actualizarItemPedido = async (
  puntoVenta: PuntoVentaProps,
  sucursal: SucursalProps,
  nroPedido: number,
  dataDelete: any,
  data: any,
  onSuccess?: () => void,
  cliente?: any,
) => {
  const entidad = {
    codigoSucursal: sucursal.codigo,
    codigoPuntoVenta: puntoVenta.codigo,
  }

  const codigoMoneda = 1
  console.log('cliente', cliente)

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

import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { ClienteOperacionInput } from '../utils/Pedidos/PedidoExpress'

interface EntidadInput {
  codigoSucursal: number
  codigoPuntoVenta: number
}

interface PedidoExpressRegistroData {
  numeroPedido: string
  numeroOrden: string
  sucursal: { codigo: number }
  puntoVenta: { codigo: number }
}

interface PedidoExpressRegistroInput {
  mesa: { nombre: string; nroComensales: number }
  productos: Array<{
    tipo: string
    cantidad: number
    codigoArticulo: string
    articuloPrecio: {
      codigoArticuloUnidadMedida: string
      codigoMoneda: number
      precio: number
      descuento: number
    }
    codigoAlmacen: string
    nota: string
  }>
  codigoMoneda: number
  tipoCambio: number
}

const mutationRegistro = gql`
  mutation REGISTRO(
    $entidad: EntidadParamsInput!
    $cliente: ClienteOperacionInput
    $input: RestPedidoExpressInput!
  ) {
    restPedidoExpressRegistro(entidad: $entidad, cliente: $cliente, input: $input) {
      numeroPedido
      numeroOrden
      mesa {
        nombre
      }
      state
      sucursal {
        codigo
      }
      puntoVenta {
        codigo
      }
      cliente {
        email
        nombres
        codigoCliente
      }
    }
  }
`

/**
 * @description Api para registro de un pedido express
 * @param entidad
 * @param input
 */
export const restPedidoExpressRegistroApi = async (
  entidad: EntidadInput,
  cliente: ClienteOperacionInput | null,
  input: PedidoExpressRegistroInput,
): Promise<PedidoExpressRegistroData> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const variables = { entidad, cliente, input }
    const data: PedidoExpressRegistroData = await client.request(
      mutationRegistro,
      variables,
    )
    return data
  } catch (error: any) {
    // Extraer el mensaje de error del objeto de error
    const errorMessage =
      error.response?.errors?.[0]?.message || 'Ocurrió un error inesperado'
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'Entendido',
    })
    console.error('Error en restPedidoExpressRegistroApi', error)
    throw new MyGraphQlError(error)
  }
}

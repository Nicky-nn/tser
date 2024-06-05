import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

interface EntidadInput {
  codigoSucursal: number
  codigoPuntoVenta: number
}

interface ClienteInput {
  codigoCliente: string
  email: string
}

interface PedidoFinalizarInput {
  codigoMetodoPago: number
  numeroTarjeta: string | null
  montoGiftCard: number
  codigoMoneda: number
  descuentoAdicional: number
  otrosCostos: number
  descripcionOtrosCostos: string | null
  montoTotal: number
}

interface PedidoFinalizarData {
  state: string
}

const mutationFinalizarPedido = gql`
  mutation FINALIZAR_PEDIDO(
    $entidad: EntidadParamsInput!
    $cliente: ClienteOperacionInput!
    $numeroPedido: Int!
    $input: RestPedidoFinalizarInput!
  ) {
    restPedidoFinalizar(
      entidad: $entidad
      cliente: $cliente
      numeroPedido: $numeroPedido
      input: $input
    ) {
      state
      mesa {
        nombre
      }
      numeroPedido
      productos {
        nroItem
        codigoArticulo
        nombreArticulo
        nota
      }
    }
  }
`

/**
 * @description Api para finalizar un pedido
 * @param entidad
 * @param cliente
 * @param numeroPedido
 * @param input
 */
export const restPedidoFinalizarApi = async (
  entidad: EntidadInput,
  cliente: ClienteInput,
  numeroPedido: number,
  input: PedidoFinalizarInput,
): Promise<PedidoFinalizarData> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const variables = { entidad, cliente, numeroPedido, input }
    const data: PedidoFinalizarData = await client.request(
      mutationFinalizarPedido,
      variables,
    )
    return data
  } catch (error: any) {
    // Extraer el mensaje de error del objeto de error
    const errorMessage =
      error.response?.errors?.[0]?.message ||
      'Ocurrió un error inesperado, por favor intente de nuevo'
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'Entendido',
    })
    console.error('Error en restPedidoFinalizarApi', error)
    throw new MyGraphQlError(error)
  }
}

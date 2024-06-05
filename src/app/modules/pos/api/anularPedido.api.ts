import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

interface EntidadInput {
  codigoSucursal: number
  codigoPuntoVenta: number
}

interface PedidoAnularInput {
  nroItem: number
  restablecerStock: boolean
}

interface PedidoAnularData {
  state: string
  numeroPedido: number
  numeroOrden: number
  productos: {
    nroItem: number
    codigoArticulo: string
  }[]
}

const mutationAnularPedido = gql`
  mutation ANULAR_PEDIDO(
    $entidad: EntidadParamsInput!
    $numeroPedido: Int!
    $restablecerStock: Boolean!
    $descripcionMotivo: String!
    $input: [RestPedidoEliminarItemInput]
  ) {
    restPedidoAnular(
      entidad: $entidad
      numeroPedido: $numeroPedido
      restablecerStock: $restablecerStock
      descripcionMotivo: $descripcionMotivo
      input: $input
    ) {
      state
      numeroPedido
      numeroOrden
      productos {
        nroItem
        codigoArticulo
      }
    }
  }
`

/**
 * @description Api para anular un pedido
 * @param entidad
 * @param numeroPedido
 * @param restablecerStock
 * @param descripcionMotivo
 * @param input
 */
export const restPedidoAnularApi = async (
  entidad: EntidadInput,
  numeroPedido: number,
  restablecerStock: boolean,
  descripcionMotivo: string,
  input: PedidoAnularInput[],
): Promise<PedidoAnularData> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const variables = {
      entidad,
      numeroPedido,
      restablecerStock,
      descripcionMotivo,
      input,
    }
    const data: PedidoAnularData = await client.request(mutationAnularPedido, variables)
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
    console.error('Error en restPedidoAnularApi', error)
    throw new MyGraphQlError(error)
  }
}

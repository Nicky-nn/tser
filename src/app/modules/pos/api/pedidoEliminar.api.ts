import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

interface EntidadInput {
  codigoSucursal: number
  codigoPuntoVenta: number
}

interface PedidoEliminarData {
  state: boolean
}

const mutationEliminarPedido = gql`
  mutation ELIMINAR_PEDIDO(
    $entidad: EntidadParamsInput!
    $numeroPedido: Int!
    $restablecerStock: Boolean!
  ) {
    restPedidoEliminar(
      entidad: $entidad
      numeroPedido: $numeroPedido
      restablecerStock: $restablecerStock
    )
  }
`

/**
 * @description Api para eliminar un pedido
 * @param entidad
 * @param numeroPedido
 * @param restablecerStock
 */
export const restPedidoEliminarApi = async (
  entidad: EntidadInput,
  numeroPedido: number,
  restablecerStock: boolean,
): Promise<PedidoEliminarData> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const variables = { entidad, numeroPedido, restablecerStock }
    const data: PedidoEliminarData = await client.request(
      mutationEliminarPedido,
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
    console.error('Error en restPedidoEliminarApi', error)
    throw new MyGraphQlError(error)
  }
}

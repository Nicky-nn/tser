import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

// Definición de las interfaces
interface EntidadInput {
  codigoSucursal: number
  codigoPuntoVenta: number
}

interface ProductoInput {
  codigoArticulo: string
  articuloPrecio: {
    codigoArticuloUnidadMedida: string
    cantidad: number
    precio: number
    descuento: number
    impuesto: number
  }
  codigoAlmacen: string
  nota: string
}

interface MutationResponse {
  state?: string
  numeroPedido?: number
  productos?: {
    nroItem: number
  }[]
}

// Definición de las mutaciones GraphQL
const mutationAdicionarItems = gql`
  mutation ADICIONAR_ITEMS(
    $numeroPedido: Int!
    $entidad: EntidadParamsInput!
    $productos: [ArticuloOperacionInput]!
    $codigoMoneda: Int!
  ) {
    restPedidoAdicionarItem(
      numeroPedido: $numeroPedido
      entidad: $entidad
      productos: $productos
      codigoMoneda: $codigoMoneda
    ) {
      state
      mesa {
        nombre
      }
      numeroPedido
      numeroOrden
      productos {
        nroItem
      }
    }
  }
`

const mutationActualizarItem = gql`
  mutation ACTUALIZAR_ITEM(
    $numeroPedido: Int!
    $entidad: EntidadParamsInput!
    $codigoMoneda: Int!
    $productos: [RestPedidoActualizarItemInput]!
  ) {
    restPedidoActualizarItem(
      numeroPedido: $numeroPedido
      entidad: $entidad
      codigoMoneda: $codigoMoneda
      productos: $productos
    ) {
      numeroPedido
      numeroOrden
      state
      mesa {
        nombre
      }
      productos {
        nroItem
        codigoArticulo
        nombreArticulo
        nota
      }
    }
  }
`

const mutationEliminarItem = gql`
  mutation ELIMINAR_ITEM(
    $entidad: EntidadParamsInput!
    $numeroPedido: Int!
    $input: [RestPedidoEliminarItemInput]!
  ) {
    restPedidoEliminarItem(
      entidad: $entidad
      numeroPedido: $numeroPedido
      input: $input
    ) {
      state
      mesa {
        nombre
      }
      numeroPedido
      numeroOrden
      productos {
        nroItem
      }
      productosEliminados {
        nota
        nombreArticulo
        nroItem
      }
    }
  }
`

// Funciones para realizar las mutaciones
export const adicionarItems = async (
  numeroPedido: number,
  entidad: EntidadInput,
  productos: ProductoInput[],
  codigoMoneda: number,
): Promise<MutationResponse> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const variables = { numeroPedido, entidad, productos, codigoMoneda }
    const data: MutationResponse = await client.request(mutationAdicionarItems, variables)
    return data
  } catch (error: any) {
    handleGraphQLError(error)
    throw error
  }
}

export const actualizarItem = async (
  numeroPedido: number,
  entidad: EntidadInput,
  productos: ProductoInput[],
  codigoMoneda: number,
): Promise<MutationResponse> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const variables = { numeroPedido, entidad, productos, codigoMoneda }
    const data: MutationResponse = await client.request(mutationActualizarItem, variables)
    return data
  } catch (error: any) {
    handleGraphQLError(error)
    throw error
  }
}

export const eliminarItem = async (
  numeroPedido: number,
  entidad: EntidadInput,
  nroItem: number,
): Promise<MutationResponse> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const input = nroItem
    const variables = { entidad, numeroPedido, input }
    const data: MutationResponse = await client.request(mutationEliminarItem, variables)
    return data
  } catch (error: any) {
    handleGraphQLError(error)
    throw error
  }
}

// Función para manejar errores GraphQL
const handleGraphQLError = async (error: any): Promise<void> => {
  const errorMessage =
    error.response?.errors?.[0]?.message ||
    'Ocurrió un error inesperado, por favor intente de nuevo'
  await Swal.fire({
    icon: 'error',
    title: 'Error',
    text: errorMessage,
    confirmButtonText: 'Entendido',
  })
  console.error('Error:', error)
  throw new MyGraphQlError(error)
}

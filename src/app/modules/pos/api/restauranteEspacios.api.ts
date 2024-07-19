import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { PuntoVentaProps } from '../../puntoVenta/interfaces/puntoVenta'
import { SucursalProps } from '../../sucursal/interfaces/sucursal'

/**
 * Respuesta de espacios
 */
export interface ApiEspacioResponse {
  restEspacioPorEntidad: {
    _id: string
    atributo1: string
    atributo2: string
    atributo3: string
    atributo4: string
    createdAt: string
    descripcion: string
    nroMesas: number
    puntoVenta: PuntoVentaProps
    state: string
    sucursal: SucursalProps
    updatedAt: string
    usucre: string
    usumod: string
  }[]
}

export interface ApiEspacioRegistroResponse {
  restEspacioRegistro: ApiEspacioResponse['restEspacioPorEntidad'][0]
}

export interface ApiEspacioActualizarResponse {
  restEspacioActualizar: ApiEspacioResponse['restEspacioPorEntidad'][0]
}

export interface ApiEspacioEliminarResponse {
  restEspacioEliminar: boolean
}

const espacioFragment = gql`
  fragment RestEspacio on RestEspacio {
    _id
    atributo1
    atributo2
    atributo3
    atributo4
    createdAt
    descripcion
    nroMesas
    puntoVenta {
      codigo
      nombre
      descripcion
    }
    state
    sucursal {
      codigo
      direccion
      telefono
    }
    updatedAt
    usucre
    usumod
  }
`

const queryListado = gql`
  query REST_ESPACIO_ENTIDAD($entidad: EntidadParamsInput!) {
    restEspacioPorEntidad(entidad: $entidad) {
      ...RestEspacio
    }
  }
  ${espacioFragment}
`

const mutationRegistro = gql`
  mutation REST_ESPACIO_REGISTRO(
    $entidad: EntidadParamsInput!
    $input: RestEspacioInput!
  ) {
    restEspacioRegistro(entidad: $entidad, input: $input) {
      ...RestEspacio
    }
  }
  ${espacioFragment}
`

const mutationActualizar = gql`
  mutation REST_ESPACIO_ACTUALIZAR($id: ID!, $input: RestEspacioActualizarInput!) {
    restEspacioActualizar(id: $id, input: $input) {
      ...RestEspacio
    }
  }
  ${espacioFragment}
`

const mutationEliminar = gql`
  mutation REST_ESPACIO_ELIMINAR($id: ID!) {
    restEspacioEliminar(id: $id)
  }
`

const getClient = () => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  client.setHeader('authorization', `Bearer ${token}`)
  return client
}

/**
 * @description Consumo de la API para el listado de espacios por entidad
 * @param entidad Información de la entidad
 */
export const apiListadoEspacios = async (entidad: {
  codigoSucursal: number
  codigoPuntoVenta: number
}): Promise<ApiEspacioResponse> => {
  try {
    const client = getClient()
    const data: ApiEspacioResponse = await client.request(queryListado, { entidad })
    return data
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

/**
 * @description Consumo de la API para registrar un nuevo espacio
 * @param entidad Información de la entidad
 * @param input Datos del nuevo espacio
 */
export const apiRegistroEspacio = async (
  entidad: { codigoSucursal: number; codigoPuntoVenta: number },
  input: { descripcion: string; nroMesas: number },
): Promise<ApiEspacioRegistroResponse> => {
  try {
    const client = getClient()
    const data: ApiEspacioRegistroResponse = await client.request(mutationRegistro, {
      entidad,
      input,
    })
    return data
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

/**
 * @description Consumo de la API para actualizar un espacio existente
 * @param id ID del espacio a actualizar
 * @param input Nuevos datos del espacio
 */
export const apiActualizarEspacio = async (
  id: string,
  input: { descripcion: string; nroMesas: number },
): Promise<ApiEspacioActualizarResponse> => {
  try {
    const client = getClient()
    const data: ApiEspacioActualizarResponse = await client.request(mutationActualizar, {
      id,
      input,
    })
    return data
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

/**
 * @description Consumo de la API para eliminar un espacio
 * @param id ID del espacio a eliminar
 */
export const apiEliminarEspacio = async (
  id: string,
): Promise<ApiEspacioEliminarResponse> => {
  try {
    const client = getClient()
    const data: ApiEspacioEliminarResponse = await client.request(mutationEliminar, {
      id,
    })
    return data
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

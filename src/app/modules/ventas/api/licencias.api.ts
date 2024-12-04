// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

export interface LicenciaProducto {
  _id: string
  tipoProducto: string
  codigoActivacion: string
  maximoConexiones: number
  fechaVencimiento: string
  state: string
  usucre: string
  usumod: string
  createdAt: string
  updatedAt: string
}

// Fragmento único
const fieldsFragment = gql`
  fragment fields on LicenciaProducto {
    _id
    tipoProducto
    codigoActivacion
    maximoConexiones
    fechaVencimiento
    state
    usucre
    usumod
    createdAt
    updatedAt
  }
`

// Consultas GraphQL
const listadoProductosQuery = gql`
  query LISTADO {
    licenciaProductoListado {
      ...fields
    }
  }
  ${fieldsFragment}
`

const filtroPorCodigoQuery = gql`
  query FILTRO_POR_CODIGO($tipoProducto: String!) {
    licenciaProductoPorTipo(tipoProducto: $tipoProducto) {
      ...fields
    }
  }
  ${fieldsFragment}
`

/**
 * @description Listado completo de productos
 */
export const apiListadoProductos = async (): Promise<LicenciaProducto[]> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(listadoProductosQuery)
    return data.licenciaProductoListado
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

/**
 * @description Filtro de productos por tipo (ej. "WHATSAPP", "IMPRESION")
 * @param tipoProducto Tipo de producto a filtrar
 */
export const apiFiltroPorTipo = async (
  tipoProducto: string,
): Promise<LicenciaProducto[]> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(filtroPorCodigoQuery, { tipoProducto })
    return data.licenciaProductoPorTipo
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

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

const query = gql`
  query REST_ESPACIO_ENTIDAD($entidad: EntidadParamsInput!) {
    restEspacioPorEntidad(entidad: $entidad) {
      ...RestEspacio
    }
  }

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

/**
 * @description Consumo de la API para el listado de espacios por entidad
 * @param entidad Información de la entidad
 */
export const apiListadoEspacios = async (entidad: {
  codigoSucursal: number
  codigoPuntoVenta: number
}): Promise<ApiEspacioResponse> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Establecer un encabezado único
    client.setHeader('authorization', `Bearer ${token}`)

    const queryVariables = { entidad }

    const data: any = await client.request(query, queryVariables)
    return data
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

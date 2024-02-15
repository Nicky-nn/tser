// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { ProveedorInputProp, ProveedorProps } from '../interfaces/proveedor.interface'

const gqlQuery = gql`
  mutation PROVEEDOR_REGISTRO($input: ProveedorInput!) {
    proveedorRegistro(input: $input) {
      codigo
      nombre
      direccion
      ciudad
      contacto
      correo
      telefono
      state
      createdAt
      updatedAt
      usucre
      usumod
    }
  }
`

/**
 * Registro de proveedores
 * @param input
 */
export const apiProveedorRegistro = async (
  input: ProveedorInputProp,
): Promise<ProveedorProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, { input })
    return data.proveedorRegistro
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

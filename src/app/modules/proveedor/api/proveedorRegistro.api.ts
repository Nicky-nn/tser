// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { AccessToken } from '../../../base/models/paramsModel';
import { ProveedorInputProp, ProveedorProps } from '../interfaces/proveedor.interface';

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
`;

export const apiProveedorRegistro = async (
  input: ProveedorInputProp,
): Promise<ProveedorProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);
  const data: any = await client.request(gqlQuery, { input });
  return data.proveedorRegistro;
};

// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { AccessToken } from '../../../base/models/paramsModel';

const query = gql`
  mutation CLIENTES_ELIMINAR($codigosCliente: [String]!) {
    clientesEliminar(codigosCliente: $codigosCliente)
  }
`;

export const apiClientesEliminar = async (codigosCliente: string[]): Promise<boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);

  const data: any = await client.request(query, { codigosCliente });
  return data.clientesEliminar;
};

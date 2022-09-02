// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { AccessToken } from '../../../base/models/paramsModel';
import { ProductoInputApiProps, ProductoProps } from '../interfaces/producto.interface';

const gqlQuery = gql`
  mutation PRODUCTOS_REGISTRO($input: FcvProductoInput!) {
    fcvProductoRegistro(input: $input) {
      _id
    }
  }
`;

export const apiProductoRegistro = async (
  input: ProductoInputApiProps,
): Promise<ProductoProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);
  const data: any = await client.request(gqlQuery, { input });
  return data.fcvProductoRegistro;
};

// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { AccessToken } from '../../../base/models/paramsModel';
import { UsuarioCambiarPasswordInputProps } from '../interfaces/cuenta.interface';

const gqlQuery = gql`
  mutation CAMBIAR_PASSWORD($password: String!, $nuevoPassword: String!) {
    usuarioCambiarPassword(password: $password, nuevoPassword: $nuevoPassword)
  }
`;

export const apiUsuarioCambiarPassword = async (
  input: UsuarioCambiarPasswordInputProps,
): Promise<Boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);

  const data: any = await client.request(gqlQuery, {
    password: input.password,
    nuevoPassword: input.nuevoPassword,
  });
  return data.usuarioCambiarPassword;
};

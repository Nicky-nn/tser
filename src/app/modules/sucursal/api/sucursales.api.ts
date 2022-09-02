// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { AccessToken } from '../../../base/models/paramsModel';
import { SucursalProps } from '../interfaces/sucursal';

const query = gql`
  query SUCURSALES {
    orgSucursales {
      codigo
      direccion
      telefono
      departamento {
        codigo
        codigoPais
        departamento
      }
      municipio
    }
  }
`;

export const apiSucursales = async (): Promise<SucursalProps[]> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);

  const data: any = await client.request(query);
  return data.orgSucursales;
};

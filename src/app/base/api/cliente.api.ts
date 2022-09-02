// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { ClienteProps } from '../../modules/clientes/interfaces/cliente';
import { AccessToken } from '../models/paramsModel';

export interface SinTipoDocumentoIdentidad {
  codigoClasificador: string;
  descripcion: string;
}

const clientesListadoQuery = gql`
  query CLIENTES_LISTADO {
    clientesAll(limit: 10000) {
      docs {
        _id
        apellidos
        codigoCliente
        complemento
        email
        nombres
        numeroDocumento
        razonSocial
        tipoDocumentoIdentidad {
          codigoClasificador
          descripcion
        }
        state
      }
    }
  }
`;

export const fetchClientesList = async (): Promise<ClienteProps[]> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);

  const data: any = await client.request(clientesListadoQuery);
  return data.clientesAll.docs || [];
};

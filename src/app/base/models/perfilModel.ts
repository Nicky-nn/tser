// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { PerfilProps } from './loginModel';
import { AccessToken } from './paramsModel';

const query = gql`
  {
    perfil {
      nombres
      apellidos
      avatar
      cargo
      ci
      correo
      rol
      sigla
      dominio
      tipo
      vigente
      sucursal {
        codigo
        direccion
        telefono
        departamento {
          codigo
          codigoPais
          sigla
          departamento
        }
        direccion
      }
      puntoVenta {
        codigo
        descripcion
        nombre
        tipoPuntoVenta {
          codigoClasificador
          descripcion
        }
      }
      actividadEconomica {
        codigoCaeb
        descripcion
        tipoActividad
      }
      moneda {
        codigo
        descripcion
        sigla
      }
      monedaTienda {
        codigo
        descripcion
        sigla
      }
    }
  }
`;

export const perfilModel = async (): Promise<PerfilProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);
  const data: any = await client.request(query);
  return data.perfil;
};

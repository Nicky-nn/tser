// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { MyGraphQlError } from '../services/GraphqlError'
import { PerfilProps } from './loginModel'
import { AccessToken } from './paramsModel'

const query = gql`
  {
    perfil {
      miEmpresa {
        tienda
        razonSocial
        codigoModalidad
        codigoAmbiente
        fechaValidezToken
      }
      usuario
      razonSocial
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
`

export const perfilModel = async (): Promise<PerfilProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(query)
    return data.perfil
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

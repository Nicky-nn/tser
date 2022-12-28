// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { PuntoVentaProps } from '../../modules/puntoVenta/interfaces/puntoVenta'
import { SinActividadesProps } from '../../modules/sin/interfaces/sin.interface'
import { SucursalProps } from '../../modules/sucursal/interfaces/sucursal'
import { MonedaParamsProps } from '../interfaces/base'

export interface PerfilProps {
  nombres: string
  apellidos: string
  avatar: string
  cargo: string
  ci: string
  correo: string
  rol: string
  sigla: string
  dominio: string[]
  tipo: 'SA' | 'ADMIN' | 'GUEST' | 'USER'
  vigente: string
  sucursal: SucursalProps
  puntoVenta: PuntoVentaProps
  actividadEconomica: SinActividadesProps
  moneda: MonedaParamsProps
  monedaTienda: MonedaParamsProps
  razonSocial: string
  miEmpresa: {
    razonSocial: string
    codigoModalidad: number
    codigoAmbiente: number
    fechaValidezToken: string
    tienda: string
  }
}

export interface UserProps {
  token: string
  refreshToken: string
  perfil: PerfilProps
}

const mutation = gql`
  mutation Login($shop: String!, $email: String!, $password: String!) {
    login(shop: $shop, email: $email, password: $password) {
      token
      refreshToken
      perfil {
        miEmpresa {
          tienda
          razonSocial
          codigoModalidad
          codigoAmbiente
          fechaValidezToken
        }
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
  }
`

export const loginModel = async (
  shop: string,
  email: string,
  password: string,
): Promise<UserProps> => {
  const variables = { shop, email, password }
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  // Set a single header
  // client.setHeader('authorization', 'Bearer MY_TOKEN')
  const data: any = await client.request(mutation, variables)
  return data.login
}

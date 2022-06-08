// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";

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
    sucursal: {
        codigo: number
        direccion: string
        telefono: string
        actividadEconomica: {
            codigoCaeb: string
            descripcion: string
            tipoActividad: string
        }[]
    }
    puntoVenta: {
        codigo: number
        tipoPuntoVenta: {
            codigoClasificador: number
            descripcion: string
        }
        nombre: string
        descripcion: string
    }
}

export interface UserProps {
    token: string
    refreshToken: string
    perfil: PerfilProps
}

const mutation = gql`
    mutation Login($shop: String!, $email: String!, $password: String!) {
        login(
            shop: $shop
            email: $email
            password: $password
        ) {
            token
            refreshToken
            perfil {
                nombres
                apellidos
                avatar
                cargo
                ci
                correo
                dominio
                rol
                sigla
                tipo
                sucursal {
                    actividadEconomica {
                        codigoCaeb
                        descripcion
                        tipoActividad
                    }
                    codigo
                    direccion
                    telefono
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
                vigente
            }
        }
    }
`

export const loginModel = async (shop: string, email: string, password: string): Promise<UserProps> => {
    const variables = {shop, email, password};
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)

    // Set a single header
    // client.setHeader('authorization', 'Bearer MY_TOKEN')

    const data: any = await client.request(mutation, variables)
    return data.login;

}
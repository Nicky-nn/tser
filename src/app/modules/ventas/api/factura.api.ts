// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {ClasificadorProps, SinActividadesProps} from "../../../interfaces";
import {AccessToken} from "../../../base/models/paramsModel";

export interface FacturaProps {
    sinTipoMetodoPago: ClasificadorProps[],
    sinUnidadMedida: ClasificadorProps[],
    sinActividades: SinActividadesProps[],
}


const query = gql`
    query FCV_PARAMETROS {
        sinTipoMetodoPago {
            codigoClasificador
            descripcion
        }
        sinUnidadMedida {
            codigoClasificador
            descripcion
        }
        sinActividades{
            codigoCaeb
            descripcion
            tipoActividad
        }
    }
`

export const fetchFacturaParams = async (): Promise<FacturaProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query)
    return data;
}
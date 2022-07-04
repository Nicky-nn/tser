// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {SinActividadesPorDocumentoSector} from "../interfaces/sin.interface";

const query = gql`
    query ACTIVIDADES_POR_DOCUMENTO_SECTOR($codDocSector: Int!) {
        sinActividadesPorDocumentoSector(codigoDocumentoSector: $codDocSector) {
            codigoActividad
            codigoDocumentoSector
            tipoDocumentoSector
            actividadEconomica
            tipoActividad
        }
    }
`

export const fetchSinActividadesPorDocumentoSector = async (): Promise<SinActividadesPorDocumentoSector[]> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const codigoDs = parseInt(import.meta.env.ISI_DOCUMENTO_SECTOR.toString());
    const data: any = await client.request(query, {codDocSector: codigoDs})
    return data.sinActividadesPorDocumentoSector;
}
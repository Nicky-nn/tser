import {SinTipoDocumentoIdentidadProps} from "../../sin/interfaces/sin.interface";

export interface clienteProps {
    _id: string
    apellidos: string
    codigoCliente: string
    codigoExcepcion: number
    complemento: string
    email: string
    nombres: string
    numeroDocumento: string
    razonSocial: string
    tipoDocumentoIdentidad: SinTipoDocumentoIdentidadProps
}
import {number, object, string} from "yup";

export const clienteInputValidator = object({
    razonSocial: string().required('Razon social es un campo requerido'),
    numeroDocumento: string().required('Número de documento es un campo obligatorio'),
    complemento: string(),
    email: string().email("Ingrese email válido").required("Email es requerido"),
    codigoTipoDocumentoIdentidad: number().min(1, 'Tipo documento identidad es requerido').required("Tipo documento de identidad es requerido"),
    apellidos: string(),
})
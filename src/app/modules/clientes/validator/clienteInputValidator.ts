import { number, object, setLocale, string } from 'yup';
import { es } from 'yup-locales';

setLocale(es);
export const clienteInputValidator = object({
  codigoTipoDocumentoIdentidad: number()
    .min(1, 'Tipo documento identidad es requerido')
    .required('Tipo documento de identidad es requerido'),
  razonSocial: string().required('Razon social es un campo requerido'),
  numeroDocumento: string().required('Número de documento es un campo obligatorio'),
  complemento: string(),
  email: string().email('Ingrese email válido').required('Email es requerido'),
  apellidos: string(),
});

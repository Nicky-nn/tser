import { number, object, setLocale, string } from 'yup'
import { es } from 'yup-locales'

setLocale(es)
export const clienteInputValidator = object({
  sinTipoDocumento: object({
    codigoClasificador: number().integer().required(),
  })
    .required()
    .nullable(),
  razonSocial: string().required('Razon social es un campo requerido'),
  numeroDocumento: string().required('Número de documento es un campo obligatorio'),
  complemento: string(),
  email: string().email('Ingrese email válido').required('Email es requerido'),
  apellidos: string(),
})

export const cliente99001InputValidator = object({
  razonSocial: string().required('Razon social es un campo requerido'),
  codigoCliente: string().required('Código Cliente es un campo obligatorio'),
  email: string().email('Ingrese email válido').required('Email es requerido'),
})

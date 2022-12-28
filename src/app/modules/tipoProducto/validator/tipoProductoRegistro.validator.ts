import { object, setLocale, string } from 'yup'
import { es } from 'yup-locales'

setLocale(es)

export const tipoProductoRegistroValidationSchema = object({
  codigoParent: string().nullable(),
  descripcion: string().required(),
})

import { object, ref, setLocale, string } from 'yup'
import { es } from 'yup-locales'

setLocale(es)

export const cambiarPasswordValidationSchema = object({
  password: string().required(),
  nuevoPassword: string().min(7).required(),
  nuevoPassword2: string()
    .min(7)
    .oneOf([ref('nuevoPassword')], 'Las nuevas contraseñas deben coincidir')
    .required(),
})

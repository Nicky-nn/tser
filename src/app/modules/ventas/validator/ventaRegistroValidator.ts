import { object, string } from 'yup'

export const VentaRegistroValidator = object({
  actividadEconomica: object({
    codigoActividad: string().required(),
  }),
  tipoCliente: string().required(),
  cliente: object({
    codigoCliente: string().required(),
  })
    .nullable()
    .required(),
  emailCliente: string().email().nullable().required(),
})

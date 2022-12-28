import { array, number, object, string } from 'yup'

export const VentaRegistroValidator = object({
  actividadEconomica: object({
    codigoCaeb: string().required(),
  }),
  tipoCliente: string().required(),
  cliente: object({
    codigoCliente: string().required(),
  })
    .nullable()
    .required(),
  emailCliente: string().email().nullable().required(),
})

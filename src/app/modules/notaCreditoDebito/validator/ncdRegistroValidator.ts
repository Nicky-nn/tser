import { array, number, object, setLocale, string } from 'yup';
import { es } from 'yup-locales';

setLocale(es);
export const ncdRegistroValidationSchema = object({
  cuf: string().trim().required('Código Único de factura es requerido'),
  detalle: array().of(
    object({ itemFactura: number().required(), cantidad: number().required() }),
  ),
});

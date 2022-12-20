import { array, boolean, number, object, setLocale, string } from 'yup';
import { es } from 'yup-locales';

import { GiftCardInputProps } from '../interfaces/giftCard.interface';

export const giftCardRegistroVarianteValidationSchema = {
  id: string().required('Identificador unico de la variante del producto es requerido'),
  codigoProducto: string().trim().required('Código del producto es requerido'),
  codigoBarras: string().trim().nullable(),
  precio: number().min(0).required('Precio es un campo obligatorio'),
};

export const giftCardRegistroValidationSchema = object({
  actividad: object({
    codigoCaeb: string().required('Debe seleccionar la actividad económica'),
  }).required(),
  sinProductoServicio: object()
    .nullable()
    .default({})
    .shape({
      codigoProducto: string().required(
        'Codigo Producto Homologado es un campo obligatorio',
      ),
    })
    .required('Producto Homolago es un campo obligatorio'),
  codigo: string().trim().required(),
  descripcion: string(),
  titulo: string().trim().required('Nombre del producto es un campo obligatorio'),
  descripcionHtml: string(),
  tipoProducto: object({
    _id: string(),
  }).nullable(),
  proveedor: object({
    _id: string(),
  }).nullable(),
  variantes: array().of(object(giftCardRegistroVarianteValidationSchema)),
});

/**
 * Validamos los datos de formulario del producto
 * @param prod
 */
export const giftCardRegistroValidator = async (
  prod: GiftCardInputProps,
): Promise<Array<string>> => {
  try {
    setLocale(es);
    await giftCardRegistroValidationSchema.validate(prod);

    if (prod.variantes.length === 0) {
      throw new Error('Debe adicionar al menos una denominación de Gift-Card');
    }
    for await (const variante of prod.variantes) {
      const schemaVariante = object(giftCardRegistroVarianteValidationSchema);
      await schemaVariante.validate(variante);
    }
    return [];
  } catch (e: any) {
    return [e.message];
  }
};

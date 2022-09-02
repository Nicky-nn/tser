import { object, setLocale, string } from 'yup';
import { es } from 'yup-locales';

setLocale(es);

export const proveedorRegistroValidationSchema = object({
  codigo: string().required('Código es requerido'),
  nombre: string().required('Nombre Proveedor es requerido'),
  direccion: string().required('Dirección es requerido'),
  ciudad: string().required('Ciudad / Ubicación es requerido'),
  contacto: string().required('Nombre de contacto es requerido'),
  correo: string().email('Ingrese Correo válido').required('Correo es requerido'),
  telefono: string(),
});

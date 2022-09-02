import { AuditoriaProps } from '../../../interfaces';
import { genReplaceEmpty } from '../../../utils/helper';
import { SinTipoDocumentoIdentidadProps } from '../../sin/interfaces/sin.interface';

export interface ClienteProps extends AuditoriaProps {
  _id: string;
  apellidos: string;
  codigoCliente: string;
  codigoExcepcion: number;
  complemento: string;
  email: string;
  nombres: string;
  numeroDocumento: string;
  razonSocial: string;
  tipoDocumentoIdentidad: SinTipoDocumentoIdentidadProps;
  state: string;
}

export interface ClienteInputProps {
  codigoTipoDocumentoIdentidad: number;
  razonSocial: string;
  numeroDocumento: string;
  complemento: string;
  email: string;
  nombres: string;
  apellidos: string;
}

export const CLIENTE_DEFAULT_INPUT: ClienteInputProps = {
  codigoTipoDocumentoIdentidad: 1,
  razonSocial: '',
  numeroDocumento: '',
  complemento: '',
  email: '',
  nombres: '',
  apellidos: '',
};

export const clienteInputUpdateDefault = (cliente: ClienteProps) => ({
  codigoTipoDocumentoIdentidad: cliente.tipoDocumentoIdentidad.codigoClasificador,
  razonSocial: cliente.razonSocial,
  numeroDocumento: cliente.numeroDocumento,
  complemento: genReplaceEmpty(cliente.complemento, ''),
  email: cliente.email,
  nombres: cliente.nombres,
  codigoExcepcion: cliente.codigoExcepcion,
  apellidos: cliente.apellidos,
});

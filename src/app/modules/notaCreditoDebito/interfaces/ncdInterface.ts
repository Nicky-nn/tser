import { ClienteProps } from '../../clientes/interfaces/cliente';
import { ProductoVarianteProps } from '../../productos/interfaces/producto.interface';
import { PuntoVentaProps } from '../../puntoVenta/interfaces/puntoVenta';
import {
  SinActividadesProps,
  SinCufdProps,
  SinCuisProps,
  SinMotivoAnulacionProps,
  SinProductoServicioProps,
  SinTipoDocumentoSectorProps,
  SinTipoEmisionProps,
  SinTipoFacturaProps,
  SinUnidadMedidaProps,
} from '../../sin/interfaces/sin.interface';
import { SucursalProps } from '../../sucursal/interfaces/sucursal';

export interface FacturaDetalleInputProps extends ProductoVarianteProps {
  verificarStock: boolean;
  codigoProductoSin: string;
  descripcion: string;
  numeroImei: string;
  numeroSerie: string;
  cantidad: number;
  montoDescuento: number;
  precioUnitario: number;
  detalleExtra: string;
  subtotal: number;
  incluirCantidad: boolean;
}

export interface FacturaInputProps {
  actividadEconomica: SinActividadesProps;
  tipoCliente: 'N' | '99002' | '99003';
  cliente: ClienteProps | null;
  codigoCliente: string;
  codigoExcepcion: number | null;
  codigoMetodoPago: number;
  codigoMoneda: number;
  descuentoAdicional: number;
  detalle: FacturaDetalleInputProps[];
  detalleExtra?: string | null;
  detalleExtraText?: string | null;
  emailCliente?: string | null;
  montoGiftCard?: number | null;
  numeroTarjeta?: string | null;
  tipoCambio: number | null;
  montoPagar: number;
  montoSubTotal: number;
  total: number;
  inputMontoPagar: number;
  inputVuelto: number;
}

/**
 * Valores iniciales del formulario
 */
export const FacturaInitialValues: FacturaInputProps = {
  actividadEconomica: {} as SinActividadesProps,
  tipoCliente: 'N',
  cliente: null,
  codigoCliente: '',
  codigoExcepcion: null,
  codigoMetodoPago: 1,
  codigoMoneda: 1,
  descuentoAdicional: 0,
  detalle: [] as FacturaDetalleInputProps[],
  detalleExtra: '',
  detalleExtraText: '',
  emailCliente: null,
  montoGiftCard: 0,
  numeroTarjeta: null,
  tipoCambio: 1,
  montoSubTotal: 0,
  montoPagar: 0,
  total: 0,
  inputMontoPagar: 0,
  inputVuelto: 0,
};

export interface RepresentacionGraficaProps {
  pdf: string;
  rollo: string;
  xml: string;
  sin: string;
}

export interface DetalleNcdProps {
  nroItem: number;
  nroItemFactura: number;
  actividadEconomica: SinActividadesProps;
  productoServicio: SinProductoServicioProps;
  producto: string;
  descripcion: string;
  cantidad: number;
  unidadMedida: SinUnidadMedidaProps;
  precioUnitario: number;
  montoDescuento: number;
  subTotal: number;
  codigoDetalleTransaccion: 1 | 2;
}

export interface NcdProps {
  nitEmisor: string;
  razonSocialEmisor: string;
  numeroNotaCreditoDebito: number;
  numeroFactura: number;
  cuf: String;
  cufd: SinCufdProps;
  cuis: SinCuisProps;
  tipoFactura: SinTipoFacturaProps;
  tipoEmision: SinTipoEmisionProps;
  sucursal: SucursalProps;
  puntoVenta: PuntoVentaProps;
  fechaEmision: string;
  cliente: ClienteProps;
  numeroAutorizacionCuf: string;
  fechaEmisionFactura: string;
  montoTotalOriginal: number;
  montoTotalDevuelto: number;
  montoTotalLiteral: number;
  montoDescuentoCreditoDebito: number;
  montoEfectivoCreditoDebito: number;
  leyenda: string;
  subLeyenda: string;
  usuario: string;
  documentoSectorFactura: SinTipoDocumentoSectorProps;
  documentoSector: SinTipoDocumentoSectorProps;
  detalle: DetalleNcdProps[];
  codigoRecepcion: String;
  motivoAnulacion: SinMotivoAnulacionProps;
  representacionGrafica: RepresentacionGraficaProps;
  usucre: string;
  createdAt: string;
  usumod: string;
  updatedAt: string;
  state: string;
}

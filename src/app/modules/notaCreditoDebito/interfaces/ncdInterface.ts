import { ClienteProps } from '../../clientes/interfaces/cliente';
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
import { RepresentacionGraficaProps } from '../../../interfaces/facturaInterface';

export interface NcdDetalleInputProps {
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

export interface NcdInputProps {
  actividadEconomica: SinActividadesProps;
  tipoCliente: 'N' | '99002' | '99003';
  cliente: ClienteProps | null;
  codigoCliente: string;
  codigoExcepcion: number | null;
  codigoMetodoPago: number;
  codigoMoneda: number;
  descuentoAdicional: number;
  detalle: NcdDetalleInputProps[];
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

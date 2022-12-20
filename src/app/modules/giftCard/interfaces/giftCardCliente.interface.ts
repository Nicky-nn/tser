import { ImagenProps } from '../../../base/interfaces/base';
import { ClienteProps } from '../../clientes/interfaces/cliente';
import { PuntoVentaProps } from '../../puntoVenta/interfaces/puntoVenta';
import {
  SinProductoServicioProps,
  SinTipoMetodoPagoProps,
  SinTipoMonedaProps,
  SinUnidadMedidaProps,
} from '../../sin/interfaces/sin.interface';
import { SucursalProps } from '../../sucursal/interfaces/sucursal';

export interface GiftCardSaldosProps {
  cliente: ClienteProps;
  cuf: string;
  estado: string;
  fechaEmision: string;
  monto: number;
  notaVenta: string;
  puntoVenta: PuntoVentaProps;
  sucursal: SucursalProps;
}

export interface GiftCardClienteProps {
  cliente: ClienteProps;
  codigo: string;
  codigoBarras: string;
  codigoProducto: string;
  costo: number;
  createdAt: string;
  cuf: string;
  facturacion: boolean;
  imagen: ImagenProps;
  metodoPago: SinTipoMetodoPagoProps;
  moneda: SinTipoMonedaProps;
  nombre: string;
  notaVenta: string;
  numeroTarjeta: string;
  precio: number;
  precioComparacion: number;
  puntoVenta: PuntoVentaProps;
  saldo: number;
  saldos: GiftCardSaldosProps[];
  sinProductoServicio: SinProductoServicioProps;
  state: string;
  sucursal: SucursalProps;
  tipoCambio: number;
  titulo: string;
  unidadMedida: SinUnidadMedidaProps;
  updatedAt: string;
  usucre: string;
  usumod: string;
}

import {ClienteProps} from "../../../base/api/cliente.api";
import {ProductoVarianteProps} from "../../productos/api/producto.api";
import {
    SinActividadesProps,
    SinCufdProps,
    SinCuisProps,
    SinMotivoAnulacionProps,
    SinProductoServicioProps,
    SinTipoDocumentoSectorProps,
    SinTipoEmisionProps,
    SinTipoFacturaProps,
    SinTipoMetodoPagoProps,
    SinTipoMonedaProps,
    SinUnidadMedidaProps
} from "../../sin/interfaces/sin.interface";
import {PuntoVentaProps} from "../../puntoVenta/interfaces/puntoVenta";
import {SucursalProps} from "../../sucursal/interfaces/sucursal";

export interface FacturaDetalleProps extends ProductoVarianteProps {
    inputCantidad: number
    inputPrecio: number
    inputDescuento: number
    inputMotivoDescuento: number
    detalleExtra: string
    subtotal: number
}

export interface FacturaInputProps {
    actividadEconomica: string
    tipoCliente: 'N' | '99002' | '99003'
    cliente: ClienteProps,
    codigoCliente: string
    codigoMetodoPago: number
    codigoMoneda: number
    descuentoAdicional: number
    detalle: FacturaDetalleProps[]
    detalleExtra?: string | null
    emailCliente?: string | null
    montoGiftCard?: number | null
    numeroTarjeta?: string | null
    tipoCambio: number | null
    montoPagar: number
    inputMontoPagar: number
    inputVuelto: number
}

/**
 * Valores iniciales del formulario
 */
export const FacturaInitialValues: FacturaInputProps = {
    actividadEconomica: '620000',
    tipoCliente: 'N',
    cliente: {} as ClienteProps,
    codigoCliente: '',
    codigoMetodoPago: 1,
    codigoMoneda: 1,
    descuentoAdicional: 0,
    detalle: [] as FacturaDetalleProps[],
    detalleExtra: '',
    emailCliente: null,
    montoGiftCard: 0,
    numeroTarjeta: null,
    tipoCambio: 1,
    montoPagar: 0,
    inputMontoPagar: 0,
    inputVuelto: 0
}

export interface RepresentacionGraficaProps {
    pdf: string
    rollo: string
    xml: string
}

export interface DetalleFacturaProps {
    actividadEconomica: SinActividadesProps
    cantidad: number
    descripcion: string
    detalleExtra: string
    montoDescuento: number
    nroItem: number
    numeroImei: string
    numeroSerie: string
    precioUnitario: number
    producto: string
    productoServicio: SinProductoServicioProps
    subTotal: number
    unidadMedida: SinUnidadMedidaProps
}

export interface FacturaProps {
    _id: string,
    cafc: string,
    cliente: ClienteProps,
    codigoRecepcion: String,
    createdAt: string,
    cuf: String,
    cufd: SinCufdProps,
    cuis: SinCuisProps,
    descuentoAdicional: number,
    detalle: DetalleFacturaProps[]
    detalleExtra: string
    documentoSector: SinTipoDocumentoSectorProps
    eventoSignificativo: any
    fechaEmision: string
    leyenda: string
    metodoPago: SinTipoMetodoPagoProps
    moneda: SinTipoMonedaProps
    montoGiftCard: number
    montoTotal: number
    montoTotalLiteral: number
    montoTotalMoneda: number
    montoTotalSujetoIva: number
    motivoAnulacion: SinMotivoAnulacionProps
    nitEmisor: string
    numeroFactura: number
    numeroTarjeta: string
    puntoVenta: PuntoVentaProps
    razonSocialEmisor: string
    representacionGrafica: RepresentacionGraficaProps
    state: string
    subLeyenda: string
    sucursal: SucursalProps
    tipoCambio: number
    tipoEmision: SinTipoEmisionProps
    tipoFactura: SinTipoFacturaProps
    updatedAt: string
    usuario: string
    usucre: string
    usumod: string
}
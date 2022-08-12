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
import {ProductoVarianteProps} from "../../productos/interfaces/producto.interface";
import {ClienteProps} from "../../clientes/interfaces/cliente";

export interface FacturaDetalleInputProps extends ProductoVarianteProps {
    verificarStock: boolean
    codigoProductoSin: string
    descripcion: string
    numeroImei: string
    numeroSerie: string
    cantidad: number
    montoDescuento: number
    precioUnitario: number
    detalleExtra: string
    subtotal: number
    incluirCantidad: boolean
}

export interface FacturaInputProps {
    actividadEconomica: SinActividadesProps
    tipoCliente: 'N' | '99002' | '99003'
    cliente: ClienteProps | null,
    codigoCliente: string
    codigoExcepcion: number | null,
    codigoMetodoPago: number
    codigoMoneda: number
    descuentoAdicional: number
    detalle: FacturaDetalleInputProps[]
    detalleExtra?: string | null
    detalleExtraText?: string | null
    emailCliente?: string | null
    montoGiftCard?: number | null
    numeroTarjeta?: string | null
    tipoCambio: number | null
    montoPagar: number
    montoSubTotal: number
    total: number
    inputMontoPagar: number
    inputVuelto: number
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
    inputVuelto: 0
}

export const FacturaResetValues = {
    tipoCliente: 'N',
    cliente: {} as ClienteProps,
    codigoCliente: '',
    codigoExcepcion: null,
    codigoMetodoPago: 1,
    codigoMoneda: 1,
    descuentoAdicional: 0,
    detalle: [] as FacturaDetalleInputProps[],
    detalleExtra: '',
    emailCliente: null,
    montoGiftCard: 0,
    numeroTarjeta: null,
    tipoCambio: 1,
    montoSubTotal: 0,
    montoPagar: 0,
    inputMontoPagar: 0,
    inputVuelto: 0
}


export interface RepresentacionGraficaProps {
    pdf: string
    rollo: string
    xml: string
    sin: string
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
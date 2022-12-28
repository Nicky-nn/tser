import { NcdRegistroInputProps } from '../api/ncdRegistroApi'
import { NcdInputProps } from '../interfaces/ncdInterface'

export const ncdInputCompose = (ncd: NcdInputProps): NcdRegistroInputProps => {
  return {
    facturaCuf: ncd.facturaCuf,
    detalle: ncd.detalleFactura.map((item) => ({
      itemFactura: item.nroItem,
      cantidad: item.cantidad,
    })),
  }
}

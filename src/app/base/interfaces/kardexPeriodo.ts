import { SinTipoDocumentoSectorProps } from '../../interfaces/sin.interface'

/**
 * @description Modelo de Periodo
 */
export interface KardexPeriodoProps {
  codigo: number
  descripcion: string
  documentoSector: SinTipoDocumentoSectorProps
  state?: string
  usucre?: string
  createdAt?: Date
  usumod?: string
  updatedAt?: string
}

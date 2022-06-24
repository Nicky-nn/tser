export interface ClasificadorProps {
    codigoClasificador: string;
    descripcion: string;
}

export interface SinActividadesProps {
    codigoCaeb: string;
    tipoActividad: string;
    descripcion: string;
}

export interface ClaDepartamentoProps {
    codigo: number
    codigoPais: number
    sigla: string
    departamento: string
}

export interface SucursalProps {
    codigo: number
    direccion: string
    telefono: string
    departamento: ClaDepartamentoProps
    municipio: string
}

/**
 * Estados suscritos para el ciclo de vida del registro
 */
export const apiEstado = {
    elaborado: 'ELABORADO',
    aprobado: 'APROBADO',
    validada: 'VALIDADA',
    completado: 'COMPLETADO',
    finalizado: 'FINALIZADO',
    pendiente: 'PENDIENTE',
    observado: 'OBSERVADO',
    paqueteObservado: 'OBSERVADA',
    anulado: 'ANULADO',
    eliminado: 'ELIMINADO',
}
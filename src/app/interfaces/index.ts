export interface ClasificadorProps {
    codigoClasificador: string;
    descripcion: string;
}

export interface SinActividadesProps {
    codigoCaeb: string;
    tipoActividad: string;
    descripcion: string;
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

export interface AuditoriaProps {
    usucre: string,
    createdAt: string,
    usumod: string,
    updatedAt: string
}

export interface PageInfoProps {
    hasNextPage: boolean,
    hasPrevPage: boolean,
    totalDocs: number,
    limit: number,
    page: number,
    totalPages: number
}

export const PAGE_INFO_DEFAULT: PageInfoProps = {
    hasNextPage: false,
    hasPrevPage: false,
    totalDocs: 10,
    limit: 10,
    page: 1,
    totalPages: 1
}

export interface PageProps {
    limit: number,
    page: number,
    reverse: boolean,
    query?: string
}

export const PAGE_DEFAULT: PageProps = {
    limit: 10,
    page: 1,
    reverse: true,
    query: ""
}
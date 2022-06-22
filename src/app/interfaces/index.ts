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
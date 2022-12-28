export interface UsuarioPuntoVentaRestriccionProps {
  codigo: number
  tipoPuntoVenta: {
    codigoClasificador: number
    descripcion: string
  }
  nombre: string
  descripcion: string
}

export interface UsuarioSucursalRestriccionProps {
  codigo: number
  telefono: string
  direccion: string
  departamento: {
    codigo: number
    codigoPais: number
    sigla: string
    departamento: string
  }
  municipio: string
  puntosVenta: Array<UsuarioPuntoVentaRestriccionProps>
}

export interface UsuarioRestriccionProps {
  sucursales: Array<UsuarioSucursalRestriccionProps>
}

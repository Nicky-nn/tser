export interface ListadoPedidos {
  restPedidoListado: RestPedidoListado
}

interface RestPedidoListado {
  docs: Doc[]
}

interface Doc {
  numeroPedido: number
  numeroOrden: number
  sucursal: Sucursal
  mesa: Mesa
  puntoVenta: PuntoVenta
  tipoCambio: number
  productos: Producto[]
}

interface Sucursal {
  codigo: string
}

interface Mesa {
  nroComensales: number
  nombre: string
}

interface PuntoVenta {
  tipoPuntoVenta: TipoPuntoVenta
}

interface TipoPuntoVenta {
  descripcion: string
  codigoClasificador: string
}

interface Producto {
  actividadEconomica: ActividadEconomica
  almacen: Almacen
  articuloPrecio: ArticuloPrecio
  cantidad: number
  codigoArticulo: string
  documentoSector: DocumentoSector
  lote: Lote
  nombreArticulo: string
  nota: string
  nroItem: number
  sinProductoServicio: SinProductoServicio
  tipo: string
  tipoArticulo: TipoArticulo
  state: string
  updatedAt: string
  createdAt: string
}

interface ActividadEconomica {
  codigoCaeb: string
  tipoActividad: string
}

interface Almacen {
  state: string
  sucursal: SucursalAlmacen
  codigoAlmacen: string
  nombre: string
  ubicacion: string
}

interface SucursalAlmacen {
  departamento: Departamento
}

interface Departamento {
  sigla: string
  codigo: string
  codigoPais: string
}

interface ArticuloPrecio {
  articuloUnidadMedida: ArticuloUnidadMedida
  monedaPrecio: MonedaPrecio
  cantidadBase: number
  descuento: number
}

interface ArticuloUnidadMedida {
  ancho: number
  altura: number
  state: string
  peso: number
}

interface MonedaPrecio {
  manual: boolean
  precioBase: number
}

interface DocumentoSector {
  codigoClasificador: string
  descripcion: string
}

interface Lote {
  atributo1: string
  atributo2: string
  state: string
}

interface SinProductoServicio {
  descripcionProducto: string
}

interface TipoArticulo {
  state: string
  codigo: string
  descripcion: string
  grupoUnidadMedida: GrupoUnidadMedida
}

interface GrupoUnidadMedida {
  unidadMedidaBase: UnidadMedidaBase
}

interface UnidadMedidaBase {
  state: string
  peso: number
}

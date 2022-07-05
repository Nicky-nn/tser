import {
    OpcionesProductoProps,
    ProductoInputApiProps,
    ProductoInputProps,
    ProductoVarianteApiProps
} from "../interfaces/producto.interface";

/**
 * Componemos el producto para su posterior guardado
 * @param prod
 */
export const productoComposeService = (prod: ProductoInputProps): ProductoInputApiProps => {
    let opcionesProducto: OpcionesProductoProps[] = [];
    const variantes: ProductoVarianteApiProps[] = [];
    if (prod.varianteUnica) {
        // VARIANTE UNICA
        const v = prod.variante
        variantes.push({
            id: v.id,
            codigoProducto: v.codigoProducto,
            titulo: prod.titulo,
            precio: v.precio,
            precioComparacion: v.precioComparacion!,
            costo: v.costo,
            incluirCantidadInventario: v.incluirCantidadInventario,
            habilitarStock: v.habilitarStock,
            codigoUnidadMedida: parseInt(v.unidadMedida?.codigoClasificador!),
            inventario: <any>v.inventario.map(i => ({codigoSucursal: i.sucursal.codigo, stock: i.stock}))
        })
    } else {
        // MULTIPLES VARIANTES
        prod.variantes.forEach(item => {
            variantes.push({
                id: item.id,
                codigoProducto: item.codigoProducto,
                titulo: item.titulo,
                precio: item.precio,
                precioComparacion: item.precioComparacion!,
                costo: item.costo,
                incluirCantidadInventario: item.incluirCantidadInventario,
                habilitarStock: item.habilitarStock,
                codigoUnidadMedida: parseInt(item.unidadMedida?.codigoClasificador!),
                inventario: <any>item.inventario.map(i => ({codigoSucursal: i.sucursal.codigo, stock: i.stock}))
            })
        })
    }

    return {
        codigoActividad: prod.actividadEconomica?.codigoActividad!,
        codigoProductoSin: prod.sinProductoServicio?.codigoProducto!,
        titulo: prod.titulo,
        descripcion: prod.descripcion,
        descripcionHtml: `<p>${prod.descripcionHtml}</p>`,
        opcionesProducto: prod.opcionesProducto,
        codigoTipoProducto: prod.tipoProducto?._id || null,
        tipoProductoPersonalizado: prod.tipoProductoPersonalizado.trim(),
        varianteUnica: prod.varianteUnica,
        codigoProveedor: prod.proveedor?.codigo || null,
        variantes
    }
}
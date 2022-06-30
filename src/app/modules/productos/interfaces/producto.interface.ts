export interface ProductoInputProps {
    codigoProductoSin: string | null,
    titulo: string,
    descripcion: string,
    descripcionHtml: string
}

export const ProductoInitialValues: ProductoInputProps = {
    codigoProductoSin: null,
    titulo: '',
    descripcion: '',
    descripcionHtml: '<span></span>'
}
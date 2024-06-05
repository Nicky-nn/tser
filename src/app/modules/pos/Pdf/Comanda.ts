import * as pdfMake from 'pdfmake/build/pdfmake'
import printJS from 'print-js'
import { toast } from 'react-toastify'

type Producto = {
  name: string
  quantity: number
  extraDetalle: string
  extraDescription: string
}

export const generarComandaPDF = (
  data: any,
  usuario: any,
  mesa: string = 'NAN',
  orden: string = '',
) => {
  const fechaActual = new Date().toLocaleDateString()
  const horaActual = new Date().toLocaleTimeString()

  // Verificar si hay productos en el array especificado
  if (!data || data.length === 0) {
    toast.error('Debe agregar al menos un producto')
    return
  }

  // Crear un documento PDF
  const documentDefinition = {
    pageOrientation: 'portrait',
    pageMargins: [1, 1, 1, 1], // Configurar todos los márgenes a cero
    pageSize: { width: 228, height: 'auto' }, // Ancho: 80 mm (8 cm), Alto: 264 mm (26.4 cm)
    content: [
      { text: 'COMANDA', style: 'header' },
      { text: `MESA: ${mesa} - ORDEN: ${orden}`, style: 'subheader' },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 520,
            y2: 0,
            lineWidth: 1,
            dash: { length: 5 },
          }, // Dibujar una línea segmentada de un lado al otro
        ],
        margin: [0, 5, 0, 5], // Margen superior e inferior para separar la línea del contenido anterior y posterior
      },
      { text: `Fecha: ${fechaActual}  Hora: ${horaActual}`, style: 'subheader' },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 520,
            y2: 0,
            lineWidth: 1,
            dash: { length: 5 },
          }, // Dibujar una línea segmentada de un lado al otro
        ],
        margin: [0, 5, 0, 5], // Margen superior e inferior para separar la línea del contenido anterior y posterior
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', '*'], // Ancho automático para la primera columna, el resto se ajusta automáticamente
          body: [
            ['CANT.', 'DETALLE'],
            ...(data as Producto[]).map((producto) => [
              producto.quantity.toString(),
              producto.name +
                ' ' +
                producto.extraDetalle +
                ' -  ' +
                producto.extraDescription,
            ]),
          ],
        },
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 520,
            y2: 0,
            lineWidth: 1,
            dash: { length: 5 },
          }, // Dibujar una línea segmentada de un lado al otro
        ],
        margin: [0, 5, 0, 5], // Margen superior e inferior para separar la línea del contenido anterior y posterior
      },
      { text: 'Comentarios:', style: 'subheader' },
      // Dejamos dos líneas de espacio
      { text: ' ' },
      { text: 'Usuario: ' + usuario, style: 'subheader' },
    ],
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 5], // Margen inferior para separarlo del contenido siguiente
      },
      subheader: {
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 10],
      },
      tableExample: {
        fontSize: 8,
      },
    },
    defaultStyle: {
      margin: [0, 0, 0, 0], // Eliminar todos los márgenes
    },
  }

  // Generar el PDF
  //@ts-ignore
  const pdfDocGenerator = pdfMake.createPdf(documentDefinition)

  pdfDocGenerator.getBlob((blob: any) => {
    const pdfUrl = URL.createObjectURL(blob)

    printJS(pdfUrl)
  })
}

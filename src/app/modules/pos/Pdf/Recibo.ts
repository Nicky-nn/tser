import * as pdfMake from 'pdfmake/build/pdfmake'
import printJS from 'print-js'
import { toast } from 'react-toastify'

export const generarReciboPDF = (
  data: any,
  usuario: any,
  totalNeto: any,
  mesa: string = 'NAN',
  orden: string = '',
  descuentoAdicional: string = '0',
) => {
  const fechaActual = new Date().toLocaleDateString()
  const horaActual = new Date().toLocaleTimeString()

  // Verificar si hay productos en data.producto
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
      { text: 'ESTADO DE CUENTA', style: 'header' },
      {
        text: `PEDIDO N°: ${orden} - MESA: ${mesa} - FECHA: ${fechaActual} - HORA: ${horaActual}`,
        style: 'subheader',
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

      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'], // Ancho automático para la primera columna, el resto se ajusta automáticamente
          body: [
            ['CANT.', 'DETALLE', 'PRE. UNIT.', 'DESC.', 'IMPORTE'],
            ...data.map((producto: any) => [
              producto.quantity.toString(),
              producto.name + ' ' + producto.extraDetalle,
              producto.price.toString() + ' Bs.',
              producto.discount.toString() + ' Bs.',
              (producto.quantity * producto.price - producto.discount).toString() +
                ' Bs.',
            ]),
            [
              { text: ' ', border: [false, false, false, false] },
              { text: ' ', border: [false, false, false, false] },
              { text: ' ', border: [false, false, false, false] },
              'D. AD.',
              { text: descuentoAdicional + ' Bs.', border: [true, true, true, false] },
            ],
            [
              { text: ' ', border: [false, false, false, false] },
              { text: ' ', border: [false, false, false, false] },
              { text: ' ', border: [false, false, false, false] },
              'TOTAL:',
              { text: totalNeto + ' Bs.', border: [true, true, true, true] },
            ],
          ],
        },
      },

      {
        text: 'PROPINA:______________________',
        style: 'subheader',
        alignment: 'right',
      },
      {
        text: 'NIT:___________________________',
        style: 'subheader',
      },
      {
        text: 'NOMBRE:______________________________________',
        style: 'subheader',
      },
      {
        text: 'CORREO:______________________________________',
        style: 'subheader',
      },
      {
        text: 'Usuario: ' + usuario,
        style: 'subheader',
      },
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

  // Obtener la URL del PDF como un Blob
  // Obtener la URL del PDF como un Blob
  pdfDocGenerator.getBlob((blob: any) => {
    const pdfUrl = URL.createObjectURL(blob)
    // Abrir el PDF con PrintJS con el estilo personalizado para tamaño 100%
    printJS({
      printable: pdfUrl,
      style: '@media print { @page { size: 100%; margin: 0mm; } body { width: 100%; } }',
    })
  })
}

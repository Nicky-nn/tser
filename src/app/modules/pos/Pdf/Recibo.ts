import * as pdfMake from 'pdfmake/build/pdfmake'
import { toast } from 'react-toastify'
;(pdfMake as any).fonts = {
  Roboto: {
    normal:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
}

export const generarReciboPDF = (
  data: any,
  usuario: string,
  totalNeto: number,
  mesa: string = 'NAN',
  orden: string = '',
  descuentoAdicional: string = '0',
) => {
  const fechaActual = new Date().toLocaleDateString()
  const horaActual = new Date().toLocaleTimeString()

  // Verificar si hay productos en data
  if (!data || data.length === 0) {
    toast.error('Debe agregar al menos un producto')
    return
  }

  // Crear un documento PDF
  const documentDefinition: any = {
    pageOrientation: 'portrait',
    pageMargins: [1, 1, 1, 1],
    pageSize: { width: 228, height: 'auto' },
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
          },
        ],
        margin: [0, 5, 0, 5],
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
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
        margin: [0, 0, 0, 5],
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
      margin: [0, 0, 0, 0],
    },
  }

  // Generar el PDF
  const pdfDocGenerator = pdfMake.createPdf(documentDefinition)

  pdfDocGenerator.getBlob((blob: Blob) => {
    const formData = new FormData()
    formData.append('file', blob, 'recibo.pdf')

    fetch('http://localhost:7777/print', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(`Error al imprimir: ${data.error}`)
        } else {
          toast.success('Impresión iniciada')
        }
      })
      .catch((error) => {
        toast.error(`Error al imprimir: ${error.message}`)
      })
  })
}

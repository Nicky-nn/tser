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

export const generarComandaPDF = (
  data: any[],
  usuario: string,
  mesa: string = 'NAN',
  orden: string = '',
) => {
  const fechaActual = new Date().toLocaleDateString()
  const horaActual = new Date().toLocaleTimeString()

  if (!data || data.length === 0) {
    toast.error('Debe agregar al menos un producto')
    return
  }

  // Obtener la impresora seleccionada para Comanda
  const printerSettings = localStorage.getItem('printers')
  let selectedPrinter = ''
  if (printerSettings) {
    const parsedSettings = JSON.parse(printerSettings)
    selectedPrinter = parsedSettings.comanda
  }

  if (!selectedPrinter) {
    toast.error('Por favor, seleccione una impresora para Comanda en la configuración')
    return
  }

  const documentDefinition: any = {
    pageOrientation: 'portrait',
    pageMargins: [0, 0, 0, 0], // Configurar todos los márgenes a cero
    pageSize: { width: 228, height: 'auto' }, // Ancho: 80 mm (8 cm), Alto: automático
    content: [
      { text: 'COMANDA', style: 'header' },
      { text: `MESA: ${mesa} - ORDEN: ${orden}`, style: 'subheader' },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 228, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 2],
      },
      { text: `Fecha: ${fechaActual}  Hora: ${horaActual}`, style: 'subheader' },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 228, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 2],
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', '*'],
          body: [
            ['CANT.', 'DETALLE'],
            ...data.map((producto) => [
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
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 228, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 2],
      },
      { text: 'Comentarios:', style: 'subheader' },
      { text: ' ' },
      { text: 'Usuario: ' + usuario, style: 'subheader' },
    ],
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 2],
      },
      subheader: {
        fontSize: 8,
        bold: true,
        margin: [0, 2, 0, 2],
      },
      tableExample: {
        fontSize: 7,
      },
    },
    defaultStyle: {
      fontSize: 8,
      margin: [0, 0, 0, 0],
    },
  }

  const pdfDocGenerator = pdfMake.createPdf(documentDefinition)

  pdfDocGenerator.getBlob((blob: Blob) => {
    const formData = new FormData()
    formData.append('file', blob, 'comanda.pdf')
    formData.append('printer', selectedPrinter)
    console.log('Imprimiendo Comanda...', formData)

    fetch('http://localhost:7777/print', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(`Error al imprimir: ${data.error}`)
        } else {
          toast.success('Impresión de Comanda iniciada')
        }
      })
      .catch((error) => {
        toast.error(`Error al imprimir: ${error.message}`)
      })
    console.log('Comanda generada', formData)
  })
}

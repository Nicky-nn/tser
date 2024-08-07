import * as pdfMake from 'pdfmake/build/pdfmake'
import printJS from 'print-js' // Import printJS
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

  if (!data || data.length === 0) {
    toast.error('Debe agregar al menos un producto')
    return
  }

  const printerSettings = localStorage.getItem('printers')
  let selectedPrinter = ''
  if (printerSettings) {
    const parsedSettings = JSON.parse(printerSettings)
    selectedPrinter = parsedSettings.estadoDeCuenta
  }

  const documentDefinition: any = {
    pageOrientation: 'portrait',
    pageMargins: [0, 0, 0, 0], // Reducir márgenes a 0
    pageSize: { width: 190, height: 'auto' }, // Ancho: 80 mm (8 cm), Alto: automático
    content: [
      { text: 'ESTADO DE CUENTA', style: 'header' },
      {
        text: `PEDIDO N°: ${orden} - MESA: ${mesa}\nFECHA: ${fechaActual} - HORA: ${horaActual}`,
        style: 'subheader',
      },
      ...(() => {
        const ubicacionStr = localStorage.getItem('ubicacion')
        if (ubicacionStr) {
          try {
            const ubicacion = JSON.parse(ubicacionStr)
            if (ubicacion.descripcion) {
              return [{ text: `UBICACIÓN: ${ubicacion.descripcion}`, style: 'subheader' }]
            }
          } catch (e) {
            console.error('Error al parsear la ubicación:', e)
          }
        }
        return [] // Si no hay descripción, no añadimos nada
      })(),
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            ['CANT', 'DETALLE', 'P.U.', 'DESC', 'IMP'],
            ...data.map((producto: any) => [
              producto.quantity.toString(),
              producto.name + ' ' + producto.extraDetalle,
              producto.price.toString(),
              producto.discount.toString(),
              (producto.quantity * producto.price - producto.discount).toString(),
            ]),
            [
              { text: '', border: [false, false, false, false] },
              { text: '', border: [false, false, false, false] },
              { text: '', border: [false, false, false, false] },
              'D. AD.',
              { text: descuentoAdicional, border: [true, true, true, false] },
            ],
            [
              { text: '', border: [false, false, false, false] },
              { text: '', border: [false, false, false, false] },
              { text: '', border: [false, false, false, false] },
              'TOTAL:',
              { text: totalNeto.toString(), border: [true, true, true, true] },
            ],
          ],
        },
        layout: {
          hLineWidth: function (i: number, node: { table: { body: string | any[] } }) {
            return i === 0 || i === node.table.body.length ? 0.5 : 0.3
          },
          vLineWidth: function () {
            return 0
          },
          hLineColor: function () {
            return '#aaa'
          },
          paddingLeft: function () {
            return 2
          },
          paddingRight: function () {
            return 2
          },
          paddingTop: function () {
            return 1
          },
          paddingBottom: function () {
            return 1
          },
        },
      },
      { text: ' ', style: 'footer' },
      { text: 'PROPINA:_________________________', style: 'footer', alignment: 'right' },
      { text: ' ', style: 'footer' },
      { text: 'NIT:_____________________________', style: 'footer' },
      { text: 'NOMBRE:__________________________', style: 'footer' },
      { text: 'CORREO:__________________________', style: 'footer' },
      { text: 'Usuario: ' + usuario, style: 'usuario' },
    ],
    styles: {
      header: {
        fontSize: 8,
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
      footer: {
        fontSize: 8,
        margin: [0, 2, 0, 0],
      },
      usuario: {
        fontSize: 6,
        margin: [0, 2, 0, 2],
      },
    },
    defaultStyle: {
      fontSize: 8,
    },
  }

  const pdfDocGenerator = pdfMake.createPdf(documentDefinition)

  if (selectedPrinter) {
    pdfDocGenerator.getBlob((blob: Blob) => {
      const formData = new FormData()
      formData.append('file', blob, 'estado_de_cuenta.pdf')
      formData.append('printer', selectedPrinter)

      fetch('http://localhost:7777/print', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            toast.error(`Error al imprimir: ${data.error}`)
          } else {
            toast.success('Impresión de Estado de Cuenta iniciada')
          }
        })
        .catch((error) => {
          toast.error(`Error al imprimir: ${error.message}`)
        })
    })
  } else {
    pdfDocGenerator.getBlob((blob: any) => {
      const pdfUrl = URL.createObjectURL(blob)
      printJS({
        printable: pdfUrl,
        type: 'pdf',
        style:
          '@media print { @page { size: 100%; margin: 0mm; } body { width: 100%; } }',
      })
    })
  }
}

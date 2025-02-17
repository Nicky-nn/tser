import * as pdfMake from 'pdfmake/build/pdfmake'
import printJS from 'print-js'
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

function getStorageKey(orden: string, mesa: string): string {
  return `comanda_${orden}_${mesa}`
}

function getComandaStorage(orden: string, mesa: string): any[] {
  const key = getStorageKey(orden, mesa)
  const storage = localStorage.getItem(key)
  return storage ? JSON.parse(storage) : []
}

function setComandaStorage(orden: string, mesa: string, data: any[]) {
  const key = getStorageKey(orden, mesa)
  localStorage.setItem(key, JSON.stringify(data))
}

export const generarComandaPDF = (
  data: any[],
  usuario: string,
  mesa: string = 'NAN',
  orden: string = '',
  productosEliminados: any[] = [],
  tipoPedido: any = 'ACA',
  cliente: any = null,
  notasGenerales: string = '',
) => {
  const fechaActual = new Date().toLocaleDateString()
  const horaActual = new Date().toLocaleTimeString()

  if (!data || data.length === 0) {
    toast.error('Debe agregar al menos un producto')
    return
  }

  // Obtener los productos anteriores
  const productosAnteriores = getComandaStorage(orden, mesa)

  // Verificar si es la primera creación de la comanda
  const esPrimeraCreacion = productosAnteriores.length === 0

  // Función para comparar productos y determinar cambios
  const compararProductos = (productoNuevo: any, productoAnterior: any) => {
    if (esPrimeraCreacion) return '' // No marcar como nuevo si es la primera creación
    if (!productoAnterior) return ' (NUEVO)'
    if (productoNuevo.quantity > productoAnterior.quantity) {
      return ` (+ ${productoNuevo.quantity - productoAnterior.quantity})`
    }
    return ''
  }

  // Obtener la impresora seleccionada para Comanda
  const printerSettings = localStorage.getItem('printers')
  let selectedPrinter = ''
  if (printerSettings) {
    const parsedSettings = JSON.parse(printerSettings)
    selectedPrinter = parsedSettings.comanda
  }

  const documentDefinition: any = {
    pageMargins: [0, 0, 0, 0],
    pageSize: { width: 180, height: 'auto' },
    content: [
      { text: 'COMANDA', style: 'header' },
      ...(cliente
        ? [{ text: `CLIENTE: ${cliente.razonSocial}`, style: 'subheader' }]
        : []),
      ...(tipoPedido ? [{ text: `PARA: ${tipoPedido}`, style: 'tipoPedido' }] : []),
      { text: `MESA: ${mesa} - ORDEN: ${orden}`, style: 'subheader' },
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
        return []
      })(),
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 228, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 2],
      },
      { text: `Fecha: ${fechaActual}  Hora: ${horaActual}`, style: 'subheader' },

      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', '*'],
          body: [
            [
              { text: 'CANT', style: 'tableHeader' },
              { text: 'DETALLE', style: 'tableHeader' },
            ],
            ...data.map((producto) => {
              const productoAnterior = productosAnteriores.find(
                (p: any) => p.codigoArticulo === producto.codigoArticulo,
              )
              const cambio = compararProductos(producto, productoAnterior)

              // Agregar complementos si existen
              const complementosTexto = producto.listaComplemento?.length
                ? `\n  * Complementos: ${producto.listaComplemento
                    .map(
                      (c: any) =>
                        `${c.nombreArticulo} (x${c.ArticuloPrecio?.cantidad ?? 1})`,
                    )
                    .join(', ')}`
                : ''

              return [
                producto.quantity.toString(),
                {
                  text: `${producto.name} ${producto.extraDetalle}${producto.extraDescription ? ' - ' + producto.extraDescription : ''}${cambio}${complementosTexto}`,
                  style: cambio && !esPrimeraCreacion ? 'nuevos' : null,
                },
              ]
            }),

            ...productosEliminados.map((producto) => [
              '0',
              {
                text: producto.nombreArticulo,
                decoration: 'lineThrough',
                style: 'eliminados',
              },
            ]),
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

      { text: 'Comentarios:', style: 'subheader' },
      ...(notasGenerales ? [{ text: ` -${notasGenerales}`, style: 'subheader' }] : []),
      { text: ' ' },
      { text: ' ' },
      { text: ' ' },
      { text: 'Usuario: ' + usuario, style: 'subheader' },
    ],
    styles: {
      header: {
        fontSize: 9,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 1],
      },
      subheader: {
        fontSize: 8,
        margin: [0, 1, 0, 0],
      },
      tableExample: {
        fontSize: 7,
        margin: [0, 1, 0, 1],
      },
      tableHeader: {
        fontSize: 9,
        bold: true,
        alignment: 'center',
      },
      eliminados: {
        fontSize: 7,
        italics: true,
        color: 'gray',
      },
      tipoPedido: {
        fontSize: 9,
        bold: true,
        alignment: 'right',
        margin: [0, 0, 0, 1],
      },
      nuevos: {
        fontSize: 9,
        bold: true,
      },
      fecha: {
        fontSize: 8,
        margin: [0, 1, 0, 1],
      },
      usuario: {
        fontSize: 6,
        margin: [0, 1, 0, 0],
      },
    },
    defaultStyle: {
      fontSize: 6,
    },
  }

  // Actualizar el almacenamiento con los nuevos productos
  setComandaStorage(orden, mesa, data)

  const pdfDocGenerator = pdfMake.createPdf(documentDefinition)

  if (selectedPrinter) {
    pdfDocGenerator.getBlob((blob: Blob) => {
      const formData = new FormData()
      formData.append('file', blob, 'comanda.pdf')
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
            toast.success('Impresión de Comanda iniciada')
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

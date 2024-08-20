import Swal from 'sweetalert2'

import { apiSendMessageWhatsApp } from '../../whatsapp/api/enviarMensajeWhatsApp.api'

interface User {
  miEmpresa: {
    tienda: string
  }
}

export const useWhatsappSender = (user: User) => {
  const sendWhatsappMessage = async (
    telefono: string,
    mensaje: string,
    documentUrl?: string,
    documentFileName?: string,
  ) => {
    try {
      console.log('Enviando mensaje...', user.miEmpresa.tienda)

      // Si el número tiene más de 8 dígitos, se asume que es internacional y no se agrega el prefijo '591'
      const numeroWhatsApp = telefono.length > 8 ? telefono : '591' + telefono

      await apiSendMessageWhatsApp({
        username: user.miEmpresa.tienda,
        to: numeroWhatsApp,
        text: mensaje,
        mediaUrl: documentUrl,
        mediaType: documentUrl ? 'document' : undefined,
        fileName: documentFileName,
      })
      console.log('Mensaje enviado correctamente')

      // Verificar la preferencia del usuario en el localStorage
      const showAlert = localStorage.getItem('showWhatsappAlert') !== 'false'

      if (showAlert) {
        const { value: confirm } = await Swal.fire({
          title: 'Mensaje Enviado',
          text: 'Factura enviada correctamente por WhatsApp para el número ' + telefono,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'No mostrar más',
        })

        // Si el usuario selecciona "No mostrar más", guardar la preferencia en localStorage
        if (!confirm) {
          localStorage.setItem('showWhatsappAlert', 'false')
        }
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error)
      throw error
    }
  }

  return sendWhatsappMessage
}

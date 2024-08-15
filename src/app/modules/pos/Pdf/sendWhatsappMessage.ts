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
      await apiSendMessageWhatsApp({
        username: user.miEmpresa.tienda,
        to: '591' + telefono,
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
          text: 'El mensaje de WhatsApp ha sido enviado correctamente.',
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

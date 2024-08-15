import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

// Define la mutación para enviar un mensaje
const gqlMutation = gql`
  mutation SendMessage(
    $username: String!
    $to: String!
    $text: String!
    $mediaUrl: String
    $mediaType: String
    $fileName: String
  ) {
    sendMessage(
      username: $username
      to: $to
      text: $text
      mediaUrl: $mediaUrl
      mediaType: $mediaType
      fileName: $fileName
    )
  }
`

interface SendMessageProps {
  username: string
  to: string
  text: string
  mediaUrl?: string
  mediaType?: string
  fileName?: string
}

/**
 * @description Envía un mensaje de WhatsApp usando la API GraphQL
 * @param props
 */
export const apiSendMessageWhatsApp = async (props: SendMessageProps): Promise<void> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_WHAPI_URL)

    // Realiza la solicitud de mutación
    await client.request(gqlMutation, { ...props })

    // Opcional: Mostrar un mensaje de éxito si es necesario
    Swal.fire({
      icon: 'success',
      title: 'Mensaje Enviado',
      text: 'El mensaje de WhatsApp se ha enviado correctamente.',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    })
  } catch (e: any) {
    console.error(e)

    let errorMessage = 'Ha ocurrido un error al enviar el mensaje de WhatsApp.'

    if (e.response?.errors?.[0]?.message) {
      errorMessage = e.response.errors[0].message
    }

    Swal.fire({
      icon: 'error',
      title: 'Error al enviar el mensaje',
      text: errorMessage,
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'No mostrar de nuevo',
      preConfirm: (result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          // Guarda la preferencia en localStorage
          localStorage.setItem('doNotShowError', 'true')
        }
      },
    })
    throw new Error('Error al enviar el mensaje de WhatsApp')
  }
}

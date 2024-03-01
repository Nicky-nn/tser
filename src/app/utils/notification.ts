import { toast } from 'react-toastify'
import { ToastOptions } from 'react-toastify/dist/types'

const options: ToastOptions = {
  position: 'top-center',
  theme: 'colored',
}

export const notError = (msg: string) => {
  toast.error(msg, { ...options })
}

/**
 * @description Notificacion de accion satisfactoria
 * @param msg
 */
export const notSuccess = (msg: string = 'Acción realizada correctamente') => {
  toast.success(msg, { ...options })
}
/**
 * @description Notificacion de de alerta
 * @param msg
 */
export const notDanger = (msg: string) => {
  toast.warning(msg, { ...options })
}

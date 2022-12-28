import { toast } from 'react-toastify'

export const notError = (msg: string) => {
  toast.error(msg)
}

/**
 * @description Notificacion de accion satisfactoria
 * @param msg
 */
export const notSuccess = (msg: string = 'Acción realizada correctamente') => {
  toast.success(msg)
}
/**
 * @description Notificacion de de alerta
 * @param msg
 */
export const notDanger = (msg: string) => {
  toast.warning(msg)
}

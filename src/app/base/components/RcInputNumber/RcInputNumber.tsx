/**
 * @description pintamos de color cuando se cambia el control a error
 * @param error
 */
export const rcInputError = (error: boolean): string => {
  return error ? 'rc-input-error' : ''
}

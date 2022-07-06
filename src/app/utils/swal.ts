import Swal, {SweetAlertOptions, SweetAlertResult} from "sweetalert2";

interface Props extends SweetAlertOptions<any, any> {
    title?: string,
    text?: string
}

export const swalConfirm = {
    title: 'Confirmación',
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonText: 'Confirmar',
    showLoaderOnConfirm: true,
}

export const swalErrorMsg = (msg: string | Array<any>) => {
    Swal.fire({
        title: 'Error!!',
        width: 800,
        customClass: 'swalError',
        allowEscapeKey: false,
        allowOutsideClick: false,
        html: msg,
    }).then()
}

export const swalSuccessMsg = (msg: string) => {

}

/**
 * Custmom error para excepciones
 * @param e
 */
export const swalException = (e: Error) => {
    Swal.fire({
        title: 'Error!!',
        width: 800,
        customClass: 'swalError',
        allowEscapeKey: false,
        allowOutsideClick: false,
        html: e.message,
    }).then()
}

/**
 * @description Dialog de confirmación devuelve un Promise en then
 * @param title
 * @param text
 */
export const swalConfirmDialog = (
    {
        title = 'Confirmación',
        text = 'Confirma que desea realizar la acción'
    }: { title?: string, text?: string }): Promise<SweetAlertResult<any>> => {
    return Swal.fire({
        title,
        text,
        showCancelButton: true,
        confirmButtonText: 'Si, Confirmar',
        cancelButtonText: 'Cancelar',
    })
}

/**
 * @description Confirmación para datos asincronos, usado para api rest, debe usar preConfirm(), y then
 * @param title
 * @param text
 * @param preConfirm, funcion que retorna los datos del fetch
 */
export const swalAsyncConfirmDialog = async (
    {
        title = 'Confirmación',
        text = 'Confirma que desea realizar la acción',
        preConfirm
    }: { title?: string, text?: string, preConfirm:({...props}: any) => any }): Promise<SweetAlertResult<Awaited<any>>> => {
    return Swal.fire({
        title,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        backdrop: true,
        text,
        showLoaderOnConfirm: true,
        preConfirm,
        allowOutsideClick: () => !Swal.isLoading()
    })
}

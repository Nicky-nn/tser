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
        allowOutsideClick: false,
        confirmButtonText: 'Si, Confirmar',
        cancelButtonText: 'Cancelar'
    })
}

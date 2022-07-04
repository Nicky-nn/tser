import {toast} from "react-toastify";

export const notError = (msg: string) => {
    toast.error(msg)
}
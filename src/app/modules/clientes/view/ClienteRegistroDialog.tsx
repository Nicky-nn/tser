import React, {FunctionComponent, useEffect} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useFormik} from "formik";
import {clienteInputValidator} from "../validator/clienteInputValidator";
import {CLIENTE_DEFAULT_INPUT, ClienteInputProps, ClienteProps} from "../interfaces/cliente";
import ClienteForm from "./ClienteForm";
import {swalAsyncConfirmDialog, swalException} from "../../../utils/swal";
import {notSuccess} from "../../../utils/notification";
import {fetchClienteCreate} from "../api/clienteCreate.api";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: ClienteProps) => void;
}

type Props = OwnProps;

const ClienteRegistroDialog: FunctionComponent<Props> = (props) => {
    const {onClose, open, ...other} = props;

    const clienteForm = useFormik<ClienteInputProps>({
        initialValues: CLIENTE_DEFAULT_INPUT,
        validationSchema: clienteInputValidator,
        onSubmit: async (values) => {
            console.log(values)
            await swalAsyncConfirmDialog({

                preConfirm: () => {
                    return fetchClienteCreate({
                        ...values,
                        codigoTipoDocumentoIdentidad: parseInt(values.codigoTipoDocumentoIdentidad.toString())
                    })
                        .catch(err => {
                            swalException(err)
                            return false
                        })
                },
                text: 'Confirma que desea registrar al nuevo cliente'
            }).then(resp => {
                if (resp.isConfirmed) {
                    notSuccess()
                    onClose(resp.value)
                }
            })
        },
    });

    useEffect(() => {
        if (open) {
            // clienteForm.resetForm()
            // clienteForm.setValues(CLIENTE_DEFAULT_INPUT)
        }
    }, [open]);

    return (
        <>
            <Dialog
                sx={{'& .MuiDialog-paper': {width: '80%', maxHeight: 435}}}
                maxWidth="sm"
                open={open}
                {...other}
            >
                <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                <DialogContent dividers>
                    <ClienteForm formik={clienteForm}/>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus color={'error'} variant={'contained'} size={'small'} onClick={() => {
                        onClose()
                    }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={clienteForm.submitForm}
                        style={{marginRight: 15}}
                        size={'small'}
                        variant={'contained'}
                    >Registrar</Button>
                </DialogActions>
            </Dialog>
        </>

    );
};

export default ClienteRegistroDialog;

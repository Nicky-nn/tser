import React, {FunctionComponent, useEffect} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {
    TIPO_PRODUCTO_INITIAL_VALUES,
    TipoProductoInputProp
} from "../interfaces/tipoProducto.interface";
import {FormikProps, useFormik} from "formik";
import {genRandomString} from "../../../utils/helper";
import {swalAsyncConfirmDialog, swalException} from "../../../utils/swal";
import {notSuccess} from "../../../utils/notification";
import {tipoProductoRegistroValidationSchema} from "../validator/tipoProductoRegistro.validator";
import {apiTipoProductoRegistro} from "../api/tipoProductoRegistro.api";
import TipoProductoForm from "./TipoProductoForm";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: TipoProductoInputProp) => void;
}

type Props = OwnProps;

const TipoProductoDialogRegistro: FunctionComponent<Props> = (props) => {
    const {onClose, open, ...other} = props

    const formik: FormikProps<TipoProductoInputProp> = useFormik<TipoProductoInputProp>({
        initialValues: TIPO_PRODUCTO_INITIAL_VALUES,
        validationSchema: tipoProductoRegistroValidationSchema,
        onSubmit: async (values) => {
            await swalAsyncConfirmDialog({
                preConfirm: () => {
                    return apiTipoProductoRegistro(values)
                        .catch(err => {
                            swalException(err)
                            return false
                        })
                },
                text: 'Confirma que desea reagistrar al proveedor'
            }).then(resp => {
                if (resp.isConfirmed) {
                    notSuccess()
                    onClose(values)
                }
            })
        }
    });

    const handleCancel = () => {
        onClose();
    };

    useEffect(() => {
        formik.resetForm()
    }, [open]);

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 500}}}
            maxWidth="sm"
            open={open}
            {...other}
        >
            <DialogTitle>Registrar nuevo clasificador de productos</DialogTitle>
            <DialogContent dividers>
                <TipoProductoForm formik={formik}/>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color={'error'} size={'small'} variant={'contained'} onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button
                    onClick={formik.submitForm}
                    size={'small'}
                    style={{marginRight: 25}}
                    variant={'contained'}
                    disabled={!formik.isValid}
                >Registrar Proveedor</Button>
            </DialogActions>
        </Dialog>
    )
};

export default TipoProductoDialogRegistro;

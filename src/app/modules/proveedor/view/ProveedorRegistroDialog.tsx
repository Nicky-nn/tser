import React, {FunctionComponent, useEffect} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PROVEEDOR_INITIAL_VALUES, ProveedorInputProp} from "../interfaces/proveedor.interface";
import ProveedorForm from "./ProveedorForm";
import {FormikProps, useFormik} from "formik";
import {genRandomString} from "../../../utils/helper";
import {swalAsyncConfirmDialog, swalException} from "../../../utils/swal";
import {apiProveedorRegistro} from "../api/proveedorRegistro.api";
import {notSuccess} from "../../../utils/notification";
import {proveedorRegistroValidationSchema} from "../validator/proveedorRegistro.validator";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: ProveedorInputProp) => void;
}

type Props = OwnProps;

const ProveedorRegistro: FunctionComponent<Props> = (props) => {
    const {onClose, open, ...other} = props

    const formik: FormikProps<ProveedorInputProp> = useFormik<ProveedorInputProp>({
        initialValues: PROVEEDOR_INITIAL_VALUES,
        validationSchema: proveedorRegistroValidationSchema,
        onSubmit: async (values) => {
            await swalAsyncConfirmDialog({
                preConfirm: () => {
                    return apiProveedorRegistro(values)
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
        formik.setFieldValue('codigo', genRandomString().toUpperCase())
    }, [open]);

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 500}}}
            maxWidth="sm"
            open={open}
            {...other}
        >
            <DialogTitle>Registrar nuevo Proveedor</DialogTitle>
            <DialogContent dividers>
                <ProveedorForm formik={formik}/>
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

export default ProveedorRegistro;

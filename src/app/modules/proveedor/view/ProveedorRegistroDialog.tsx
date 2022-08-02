import React, {FunctionComponent, useEffect} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {ProveedorInputProp} from "../interfaces/proveedor.interface";
import ProveedorForm from "./ProveedorForm";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: ProveedorInputProp) => void;
}

type Props = OwnProps;

const ProveedorRegistro: FunctionComponent<Props> = (props) => {
    const {onClose, open, ...other} = props

    const handleCancel = () => {
        onClose();
    };

    // REGISTRO Y VALIDACION DE DATOS
    const handleSubmit = async (): Promise<void> => {

    }

    useEffect(() => {

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
                <ProveedorForm/>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color={'error'} size={'small'} variant={'contained'} onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    size={'small'}
                    style={{marginRight: 25}} variant={'contained'}>Registrar Proveedor</Button>
            </DialogActions>
        </Dialog>
    )
};

export default ProveedorRegistro;

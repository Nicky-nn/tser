import React, {FunctionComponent, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import ProductosVariantes from "./ProductosVariantes";
import {ProductoVarianteProps} from "../interfaces/producto.interface";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: ProductoVarianteProps[]) => void;
    codigoActividad: string
}

type Props = OwnProps;


const ProductoExplorarDialog: FunctionComponent<Props> = (props) => {
    const {onClose, codigoActividad, open, ...other} = props
    const [rowSelection, setProductosVariantes] = useState<ProductoVarianteProps[]>([]);
    const handleAddProds = () => {
        if (rowSelection.length > 0) {
            onClose(rowSelection)
        }
    }

    return (<>
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 750}}}
            maxWidth="lg"
            open={open}
            {...other}
        >
            <DialogTitle>Explorar Productos</DialogTitle>
            <DialogContent dividers>
                <ProductosVariantes
                    codigoActividad={codigoActividad}
                    setProductosVariantes={setProductosVariantes}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus color={'error'} size={'small'} variant={'contained'}
                        onClick={() => onClose()}>
                    Cerrar
                </Button>
                <Button sx={{mr: 2}} disabled={rowSelection.length === 0} autoFocus color={'primary'} size={'small'}
                        variant={'contained'}
                        onClick={() => handleAddProds()}>
                    Adicionar Productos
                </Button>
            </DialogActions>
        </Dialog>
    </>);
};

export default ProductoExplorarDialog;
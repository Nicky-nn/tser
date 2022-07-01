import React, {FunctionComponent, useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Tooltip
} from "@mui/material";
import CreatableSelect from "react-select/creatable";
import {OPCIONES_PRODUCTO} from "../../../utils/clasificadores";
import {reactSelectStyles} from "../../../../../base/components/MySelect/ReactSelect";
import {Add, Delete} from "@mui/icons-material";
import {toast} from "react-toastify";
import {uniq} from "lodash";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: any) => void;
}

type Props = OwnProps;


const ProductoCantidadDialog: FunctionComponent<Props> = (props) => {
    const {onClose, open, ...other} = props;
    const [tipo, setTipo] = useState<{value: string, label: string} | undefined>(undefined);
    const [valor, setValor] = useState<Array<{ pos: number, val: string }>>([]);

    useEffect(() => {
        if (open) {
            setTipo(undefined)
            setValor([])
        }
    }, [open]);

    const handleChange = (option: any) => {
        setTipo(option)
    }

    const handleCancel = () => {
        onClose();
    };

    // REGISTRO Y VALIDACION DE DATOS
    const handleSubmit = async () => {
        const newValor = valor.filter(i => i.val.trim() === '')
        if (newValor.length === 0) {
            const valorStrings: Array<string> = uniq(valor.map(i => i.val.trim()))
            if(tipo){
                onClose({nombre: tipo.value, valores: valorStrings})
            } else {
                toast.error('Seleccione el tipo')
            }
        } else {
            toast.error('No debe existir valores vacios')
        }
        return;
    }
    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '50%', maxHeight: 500}}}
            maxWidth="xs"
            open={open}
            {...other}
        >
            <DialogTitle>Adicionar opción de producto</DialogTitle>
            <DialogContent dividers>
                <form>
                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Stack
                                direction={{xs: 'column', sm: 'row'}}
                                spacing={{xs: 0, sm: 1, md: 1}}
                            >
                                <FormControl fullWidth>
                                    <small>Nombre Opción</small>
                                    <CreatableSelect
                                        styles={reactSelectStyles}
                                        menuPosition={'fixed'}
                                        onChange={handleChange}
                                        value={tipo}
                                        options={OPCIONES_PRODUCTO}
                                        placeholder="Seleccione o escriba un nuevo tipo"
                                    />
                                </FormControl>
                                <FormControl>
                                    <small>.</small>
                                    <Tooltip title={'Adicionar Valor'} placement={'top'}>
                                        <Button variant={'outlined'} onClick={() => {
                                            setValor([...valor, {pos: valor.length + 1, val: ''}])
                                        }} startIcon={<Add/>}>Add</Button>
                                    </Tooltip>
                                </FormControl>
                            </Stack>
                        </Grid>
                        {
                            valor.map(v => (
                                <Grid key={v.pos} item lg={12} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        id="input-with-icon-textfield"
                                        label="Valor"
                                        value={v.val}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={(e) => {
                                                        setValor(valor.filter(item => item.pos !== v.pos))
                                                    }} aria-label="delete" color={'error'}>
                                                        <Delete/>
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        onChange={(e) => {
                                            const newValue = valor.filter(item => item.pos !== v.pos)
                                            setValor(valor.map(item =>
                                                item.pos === v.pos
                                                    ? {...item, val: e.target.value}
                                                    : item))
                                        }}
                                        variant="outlined"
                                        size={'small'}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color={'error'} variant={'outlined'} onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={valor.length === 0}
                    style={{marginRight: 15}} variant={'outlined'}>Adicionar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductoCantidadDialog;

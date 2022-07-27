import React, {FunctionComponent, useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid} from "@mui/material";
import CreatableSelect from "react-select/creatable";
import {OPCIONES_PRODUCTO} from "../../../utils/clasificadores";
import {reactSelectStyles} from "../../../../../base/components/MySelect/ReactSelect";
import {SelectInputLabel} from "../../../../../base/components/ReactSelect/SelectInputLabel";
import {OnChangeValue} from "react-select";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: any) => void;
}

type Props = OwnProps;

const components = {
    DropdownIndicator: null,
};

interface SelectOption {
    label: string;
    value: string;
}

const ProductoAdicionarOpcionDialog: FunctionComponent<Props> = (props) => {
    const {onClose, open, ...other} = props;
    const [tipo, setTipo] = useState<OnChangeValue<SelectOption, false>>(null);
    const [valor, setValor] = useState<OnChangeValue<SelectOption, true>>([]);

    useEffect(() => {
        if (open) {
            setTipo(null)
            setValor([])
        }
    }, [open]);

    const handleChangeTipo = (option: any) => {
        setTipo(option)
        setValor([])
    }

    const handleCancel = () => {
        onClose();
    };

    // REGISTRO Y VALIDACION DE DATOS
    const handleSubmit = async () => {
        onClose({nombre: tipo?.value, valores: valor.map(v => v.value)})
    }

    const handleChangeValor = (
        value: OnChangeValue<SelectOption, true>) => {
        setValor(value)
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 500}}}
            maxWidth="sm"
            open={open}
            {...other}
        >
            <DialogTitle>Adicionar opción de producto</DialogTitle>
            <DialogContent dividers>
                <form>
                    <Grid container spacing={3}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <SelectInputLabel shrink>
                                    Seleccione nombre de opción
                                </SelectInputLabel>
                                <CreatableSelect
                                    styles={reactSelectStyles}
                                    menuPosition={'fixed'}
                                    onChange={handleChangeTipo}
                                    defaultValue={undefined}
                                    value={tipo}
                                    options={OPCIONES_PRODUCTO}
                                    placeholder="Seleccione o escriba un nuevo tipo"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            <FormControl fullWidth>
                                <SelectInputLabel shrink>
                                    Registre los valores de la opción
                                </SelectInputLabel>
                                <CreatableSelect
                                    components={components}
                                    styles={reactSelectStyles}
                                    menuPosition={'fixed'}
                                    isClearable
                                    isMulti
                                    value={valor}
                                    onChange={handleChangeValor}
                                    placeholder="Presione Enter o Tab para crear un nuevo valor..."
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color={'error'} variant={'outlined'} onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!tipo || valor.length === 0}
                    style={{marginRight: 15}} variant={'outlined'}>Adicionar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductoAdicionarOpcionDialog;
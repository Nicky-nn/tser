import React, {FunctionComponent, useState} from 'react';
import {Button, FormControl, Grid} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import Select from "react-select";
import useQueryTiposProducto from "../../../tipoProducto/hooks/useQueryTiposProducto";
import {TipoProductoInputProp, TipoProductoProps} from "../../../tipoProducto/interfaces/tipoProducto.interface";
import TipoProductoDialogRegistro from "../../../tipoProducto/view/TipoProductoRegistroDialog";
import {ProductoInputProps} from "../../interfaces/producto.interface";
import {Controller, UseFormReturn} from "react-hook-form";
import {MyInputLabel} from "../../../../base/components/MyInputs/MyInputLabel";

interface OwnProps {
    form: UseFormReturn<ProductoInputProps>
}

type Props = OwnProps;

const ProductoClasificador: FunctionComponent<Props> = (props) => {
    const {
        form: {
            control,
            setValue,
            formState: {errors}
        }
    } = props

    const [openDialog, setOpenDialog] = useState(false);
    const {tiposProducto, tpRefetch} = useQueryTiposProducto([openDialog])

    return (
        <SimpleCard title={'Clasificador de productos'}>
            <Grid container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>
                    <Controller
                        control={control}
                        name={'tipoProducto'}
                        render={({field}) => (
                            <FormControl fullWidth>
                                <MyInputLabel shrink>
                                    Tipo Producto
                                </MyInputLabel>
                                <Select<TipoProductoProps>
                                    {...field}
                                    styles={reactSelectStyles}
                                    menuPosition={'fixed'}
                                    name="tipoProducto"
                                    placeholder={'Seleccione...'}
                                    value={field.value}
                                    onChange={(tipoProducto: any) => {
                                        field.onChange(tipoProducto)
                                    }}
                                    options={tiposProducto}
                                    isClearable={true}
                                    getOptionValue={(ps) => ps._id}
                                    getOptionLabel={(ps) => `${ps.descripcion}`}
                                />
                            </FormControl>
                        )}
                    />

                </Grid>

                <Grid item lg={12} md={12} xs={12} textAlign={'right'}>
                    <Button variant={'outlined'} onClick={() => setOpenDialog(true)} size={'small'}>
                        Nuevo Clasificador
                    </Button>
                    <TipoProductoDialogRegistro
                        id={'tipoProductoDialogRegistro'}
                        keepMounted={false}
                        open={openDialog}
                        onClose={(value?: TipoProductoProps) => {
                            setOpenDialog(false)
                            if(value) {
                                setValue('tipoProducto', value)
                                tpRefetch().then()
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </SimpleCard>
    );
};

export default ProductoClasificador;

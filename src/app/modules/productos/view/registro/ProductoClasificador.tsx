import React, {FunctionComponent, useState} from 'react';
import {Button, FormControl, Grid} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {useAppSelector} from "../../../../hooks";
import {selectProducto, setProdTipo, setProducto} from "../../slices/productos/producto.slice";
import {useDispatch} from "react-redux";
import Select from "react-select";
import useQueryTiposProducto from "../../../tipoProducto/hooks/useQueryTiposProducto";
import {TipoProductoInputProp, TipoProductoProps} from "../../../tipoProducto/interfaces/tipoProducto.interface";
import TipoProductoDialogRegistro from "../../../tipoProducto/view/TipoProductoRegistroDialog";

interface OwnProps {
}

type Props = OwnProps;

const ProductoClasificador: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const dispatch = useDispatch()
    const [openDialog, setOpenDialog] = useState(false);
    const {tiposProducto} = useQueryTiposProducto([openDialog])

    return (
        <SimpleCard title={'Clasificador de productos'}>
            <Grid container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>
                    <FormControl fullWidth>
                        <SelectInputLabel shrink>
                            Tipo Producto
                        </SelectInputLabel>
                        <Select<TipoProductoProps>
                            styles={reactSelectStyles}
                            menuPosition={'fixed'}
                            name="productoClasificador"
                            placeholder={'Seleccione...'}
                            value={prod.tipoProducto}
                            onChange={(tipoProducto: any) => {
                                dispatch(setProducto({...prod, tipoProducto}))
                            }}
                            options={tiposProducto}
                            isClearable={true}
                            getOptionValue={(ps) => ps._id}
                            getOptionLabel={(ps) => `${ps.descripcion}`}
                        />
                    </FormControl>
                </Grid>

                <Grid item lg={12} md={12} xs={12} textAlign={'right'}>
                    <Button variant={'outlined'} onClick={() => setOpenDialog(true)} size={'small'}>
                        Nuevo Clasificador
                    </Button>
                    <TipoProductoDialogRegistro
                        id={'tipoProductoDialogRegistro'}
                        keepMounted={false}
                        open={openDialog}
                        onClose={(value?: TipoProductoInputProp) => {
                            setOpenDialog(false)
                        }}
                    />
                </Grid>
            </Grid>
        </SimpleCard>
    );
};

export default ProductoClasificador;

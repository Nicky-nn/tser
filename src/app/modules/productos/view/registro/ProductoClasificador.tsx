import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import {Checkbox, FormControl, FormControlLabel, Grid, TextField} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {useAppSelector} from "../../../../hooks";
import {selectProducto, setProdTipo, setProdTipoPersonalizado} from "../../slices/productos/producto.slice";
import {useDispatch} from "react-redux";
import Select from "react-select";
import {TipoProductoProps} from "../../../../base/interfaces/base";
import {swalException} from "../../../../utils/swal";
import {apiTipoProducto} from "../../api/productoTipo.api";

interface OwnProps {
}

type Props = OwnProps;

const ProductoClasificador: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const dispatch = useDispatch()
    const [tiposProducto, setTiposProductos] = useState<TipoProductoProps[]>([]);
    const [isTipoPersonalizado, setIsTipoPersonalizado] = useState(false);

    const fetchTipoProducto = async () => {
        await apiTipoProducto().then(async (data) => {
            setTiposProductos(data)
        }).catch(err => {
            swalException(err);
            return []
        })
    }
    useEffect(() => {
        fetchTipoProducto().then()
    }, []);

    return (
        <SimpleCard title={'Clasificador de productos'}>
            <Grid container spacing={2}>
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
                                dispatch(setProdTipo(tipoProducto))
                            }}
                            options={tiposProducto}
                            isClearable={true}
                            getOptionValue={(ps) => ps.codigo}
                            getOptionLabel={(ps) => `${ps.descripcion}`}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isTipoPersonalizado}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        if (!e.target.checked) {
                                            dispatch(setProdTipoPersonalizado(''))
                                        }
                                        setIsTipoPersonalizado(e.target.checked)
                                    }}
                                />
                            }
                            label="Registrar tipo personalizado "/>
                    </FormControl>
                </Grid>
                {
                    isTipoPersonalizado && (<>
                        <Grid item lg={12} md={12} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    name="nombre"
                                    label="Ingrese el nuevo tipo de producto"
                                    size="small"
                                    value={prod.tipoProductoPersonalizado}
                                    onChange={(e) => {
                                        dispatch(setProdTipoPersonalizado(e.target.value))
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </>)
                }
            </Grid>
        </SimpleCard>
    );
};

export default ProductoClasificador;

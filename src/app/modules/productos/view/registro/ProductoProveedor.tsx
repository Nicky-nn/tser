import React, {FunctionComponent, useEffect, useState} from 'react';
import {FormControl, Grid} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import Select from "react-select";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {selectProducto, setProdProveedor} from "../../slices/productos/producto.slice";
import {swalException} from "../../../../utils/swal";
import {useAppSelector} from "../../../../hooks";
import {useDispatch} from "react-redux";
import {ProveedorProps} from "../../../proveedor/interfaces/proveedor.interface";
import {apiProveedores} from "../../../proveedor/api/proveedores.api";

interface OwnProps {
}

type Props = OwnProps;

const ProductoProveedor: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const dispatch = useDispatch()
    const [proveedores, setProveedores] = useState<ProveedorProps[]>([]);
    const fetchTipoProducto = async () => {
        await apiProveedores().then(async (data) => {
            setProveedores(data)
        }).catch(err => {
            swalException(err);
            return []
        })
    }
    useEffect(() => {
        fetchTipoProducto().then()
    }, []);

    return (
        <SimpleCard title={'Proveedor'}>
            <Grid container spacing={3}>
                <Grid item lg={12} md={12} xs={12}>
                    <FormControl fullWidth>
                        <SelectInputLabel shrink>
                            Seleccione su proveedor
                        </SelectInputLabel>
                        <Select<ProveedorProps>
                            styles={reactSelectStyles}
                            menuPosition={'fixed'}
                            name="productoProveedor"
                            placeholder={'Seleccione...'}
                            value={prod.proveedor}
                            onChange={(proveedor: any) => {
                                dispatch(setProdProveedor(proveedor))
                            }}
                            options={proveedores}
                            isClearable={true}
                            getOptionValue={(ps) => ps.codigo}
                            getOptionLabel={(ps) => `${ps.nombre}`}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </SimpleCard>
    );
};

export default ProductoProveedor;

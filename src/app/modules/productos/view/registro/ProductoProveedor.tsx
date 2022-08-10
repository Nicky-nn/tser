import React, {FunctionComponent, useState} from 'react';
import {Button, FormControl, Grid} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import Select from "react-select";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {ProveedorInputProp, ProveedorProps} from "../../../proveedor/interfaces/proveedor.interface";
import {apiProveedores} from "../../../proveedor/api/proveedores.api";
import {useQuery} from "@tanstack/react-query";
import {prodMap, ProductoInputProps} from "../../interfaces/producto.interface";
import ProveedorRegistroDialog from "../../../proveedor/view/ProveedorRegistroDialog";
import {FormikProps} from "formik";

interface OwnProps {
    formik: FormikProps<ProductoInputProps>
}

type Props = OwnProps;

const ProductoProveedor: FunctionComponent<Props> = (props) => {
    const {formik} = props;
    const {values, setFieldValue} = formik

    const [openDialog, setOpenDialog] = useState(false);

    const {data: proveedores} = useQuery<ProveedorProps[], Error>(['proveedores', openDialog], () => {
        return apiProveedores()
    })

    return (
        <SimpleCard title={'Proveedor'}>
            <Grid container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>
                    <FormControl fullWidth>
                        <SelectInputLabel shrink>
                            Seleccione su proveedor
                        </SelectInputLabel>
                        <Select<ProveedorProps>
                            styles={reactSelectStyles}
                            menuPosition={'fixed'}
                            name="proveedor"
                            placeholder={'Seleccione...'}
                            value={values.proveedor}
                            onChange={(proveedor: any) => {
                                setFieldValue(prodMap.proveedor, proveedor)
                            }}
                            options={proveedores}
                            isClearable={true}
                            getOptionValue={(ps) => ps.codigo}
                            getOptionLabel={(ps) => `${ps.codigo} - ${ps.nombre}`}
                        />
                    </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} textAlign={'right'}>
                    <Button variant={'outlined'} onClick={() => setOpenDialog(true)} size={'small'}>Nuevo
                        Proveedor</Button>
                    <ProveedorRegistroDialog
                        id={'proveedorRegistroDialog'}
                        keepMounted={false}
                        open={openDialog}
                        onClose={(value?: ProveedorInputProp) => {
                            setOpenDialog(false)
                        }}
                    />
                </Grid>
            </Grid>
        </SimpleCard>
    );
};

export default ProductoProveedor;

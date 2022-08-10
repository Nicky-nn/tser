import React, {FunctionComponent} from "react";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {FormControl, FormHelperText, Grid, TextField} from "@mui/material";
import Select from "react-select";
import {SinActividadesPorDocumentoSector, SinProductoServicioProps} from "../../../sin/interfaces/sin.interface";
import {fetchSinProductoServicioPorActividad} from "../../../sin/api/sinProductoServicio.api";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {fetchSinActividadesPorDocumentoSector} from "../../../sin/api/sinActividadesPorDocumentoSector";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import useAuth from "../../../../base/hooks/useAuth";
import {useQuery} from "@tanstack/react-query";
import AlertError from "../../../../base/components/Alert/AlertError";
import {FormikProps} from "formik";
import {prodMap, ProductoInputProps} from "../../interfaces/producto.interface";

interface OwnProps {
    formik: FormikProps<ProductoInputProps>
}

type Props = OwnProps;

const ProductoHomologacion: FunctionComponent<Props> = (props) => {
    const {formik} = props;
    const {values, setFieldValue} = formik
    const {user} = useAuth()

    // CARGA DATOS DE ACTIVIDADES
    const {data: actividades, error: actError} = useQuery<SinActividadesPorDocumentoSector[], Error>(["actividades"],
        async () => {
            const data = await fetchSinActividadesPorDocumentoSector()
            if (data.length > 0) {
                const actividadEconomica = data.find(item => item.codigoActividad === user.actividadEconomica.codigoCaeb) || data[0];
                setFieldValue(prodMap.actividadEconomica, actividadEconomica)
            }
            return data
        }, {enabled: !!user.actividadEconomica})

    // CARGA DE DATOS DE PRODUCTOS SERVICIOS
    const {
        data: productosServicios,
        error: prodServError
    } = useQuery<SinProductoServicioProps[], Error>(['productosServicios', values.actividadEconomica],
        async () => {
            return await fetchSinProductoServicioPorActividad(values.actividadEconomica?.codigoActividad!)
        }, {
            enabled: !!values.actividadEconomica,
            keepPreviousData: false
        })

    return (
        <>
            <SimpleCard title={'HOMOLOGACIÓN'}>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} xs={12}>
                        {
                            actError ? <AlertError mensaje={actError.message}/> :
                                (
                                    <FormControl fullWidth>
                                        <SelectInputLabel shrink>
                                            Actividad Económica
                                        </SelectInputLabel>
                                        <Select<SinActividadesPorDocumentoSector>
                                            styles={reactSelectStyles}
                                            menuPosition={'fixed'}
                                            name="actividadEconomica"
                                            placeholder={'Seleccione la actividad económica'}
                                            value={formik.values.actividadEconomica}
                                            onChange={async (actividadEconomica: any) => {
                                                formik.setFieldValue(prodMap.actividadEconomica, actividadEconomica)
                                                formik.setFieldValue(prodMap.sinProductoServicio, null)
                                            }}
                                            isSearchable={false}
                                            options={actividades}
                                            getOptionValue={(item) => item.codigoActividad}
                                            getOptionLabel={(item) => `${item.tipoActividad} - ${item.codigoActividad} - ${item.actividadEconomica}`}
                                        />
                                    </FormControl>
                                )
                        }

                    </Grid>

                    <Grid item lg={12} md={12} xs={12}>
                        {
                            prodServError ? <AlertError mensaje={prodServError.message}/> :
                                (
                                    <FormControl fullWidth component={'div'} error={
                                        Boolean(formik.errors.sinProductoServicio)
                                    }>
                                        <SelectInputLabel shrink>
                                            Producto Homologado
                                        </SelectInputLabel>
                                        <Select<SinProductoServicioProps>
                                            styles={reactSelectStyles}
                                            menuPosition={'fixed'}
                                            name="productoServicio"
                                            placeholder={'Seleccione producto para homolgación'}
                                            value={values.sinProductoServicio}
                                            onChange={sinProductoServicio => {
                                                setFieldValue(prodMap.sinProductoServicio, sinProductoServicio)
                                            }}
                                            options={productosServicios}
                                            getOptionValue={(ps) => ps.codigoProducto}
                                            getOptionLabel={(ps) => `${ps.codigoProducto} - ${ps.descripcionProducto}`}
                                        />
                                        <FormHelperText>{formik.errors.sinProductoServicio}</FormHelperText>
                                    </FormControl>
                                )
                        }
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <TextField
                            name="titulo"
                            label="Nombre Producto"
                            size="small"
                            fullWidth
                            value={values.titulo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.titulo && Boolean(formik.errors.titulo)}
                            helperText={formik.touched.titulo && formik.errors.titulo}
                        />
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <TextField
                            name="descripcion"
                            label="Descripcion"
                            size="small"
                            fullWidth
                            multiline
                            minRows={3}
                            maxRows={5}
                            value={values.descripcion}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                </Grid>
            </SimpleCard>
        </>
    );
};

export default ProductoHomologacion;
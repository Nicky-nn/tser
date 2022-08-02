import React, {FunctionComponent} from "react";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {FormControl, Grid, TextField} from "@mui/material";
import {useAppSelector} from "../../../../hooks";
import {selectProducto, setDescripcionProducto, setProducto} from "../../slices/productos/producto.slice";
import Select from "react-select";
import {SinActividadesPorDocumentoSector, SinProductoServicioProps} from "../../../sin/interfaces/sin.interface";
import {fetchSinProductoServicioPorActividad} from "../../../sin/api/sinProductoServicio.api";
import {useDispatch} from "react-redux";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {fetchSinActividadesPorDocumentoSector} from "../../../sin/api/sinActividadesPorDocumentoSector";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import useAuth from "../../../../base/hooks/useAuth";
import {useQuery} from "@tanstack/react-query";
import AlertError from "../../../../base/components/Alert/AlertError";

interface OwnProps {
}

type Props = OwnProps;

const ProductoHomologacion: FunctionComponent<Props> = (props) => {
    const dispatch = useDispatch()
    const prod = useAppSelector(selectProducto)
    const {user} = useAuth()

    // CARGA DATOS DE ACTIVIDADES
    const {data: actividades, error: actError} = useQuery<SinActividadesPorDocumentoSector[], Error>(["actividades"],
        async () => {
            const data = await fetchSinActividadesPorDocumentoSector()
            if (data.length > 0) {
                const actividadEconomica = data.find(item => item.codigoActividad === user.actividadEconomica.codigoCaeb) || data[0];
                dispatch(setProducto({...prod, actividadEconomica}))
            }
            return data
        }, {enabled: !!user.actividadEconomica})

    // CARGA DE DATOS DE PRODUCTOS SERVICIOS
    const {
        data: productosServicios,
        error: prodServError
    } = useQuery<SinProductoServicioProps[], Error>(['productosServicios', prod.actividadEconomica],
        async () => {
            return await fetchSinProductoServicioPorActividad(prod.actividadEconomica?.codigoActividad!)
        }, {
            enabled: !!prod.actividadEconomica,
            keepPreviousData: true
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
                                            value={prod.actividadEconomica}
                                            onChange={async (actividadEconomica: any) => {
                                                dispatch(setProducto({
                                                    ...prod,
                                                    actividadEconomica,
                                                    sinProductoServicio: null
                                                }))
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
                                    <FormControl fullWidth component={'div'}>
                                        <SelectInputLabel shrink>
                                            Producto Homologado
                                        </SelectInputLabel>
                                        <Select<SinProductoServicioProps>
                                            styles={reactSelectStyles}
                                            menuPosition={'fixed'}
                                            name="productoServicio"
                                            placeholder={'Seleccione producto para homolgación'}
                                            value={prod.sinProductoServicio}
                                            onChange={sinProductoServicio => {
                                                dispatch(setProducto({
                                                    ...prod,
                                                    sinProductoServicio
                                                }))
                                            }}
                                            options={productosServicios}
                                            getOptionValue={(ps) => ps.codigoProducto}
                                            getOptionLabel={(ps) => `${ps.codigoProducto} - ${ps.descripcionProducto}`}
                                        />
                                    </FormControl>
                                )
                        }
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <TextField
                            name="nombre"
                            label="Nombre Producto"
                            size="small"
                            fullWidth
                            value={prod.titulo}
                            onChange={e => {
                                dispatch(setProducto({...prod, titulo: e.target.value}))
                            }}
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
                            value={prod.descripcion}
                            onChange={(e) => {
                                dispatch(setProducto({...prod, descripcion: e.target.value }))
                            }}
                        />
                    </Grid>
                </Grid>
            </SimpleCard>
        </>
    );
};

export default ProductoHomologacion;
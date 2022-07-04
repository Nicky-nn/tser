import React, {FunctionComponent, useEffect, useState} from "react";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {FormControl, Grid, TextField} from "@mui/material";
import {useAppSelector} from "../../../../hooks";
import {
    selectProducto,
    setActividadEconomica,
    setCodigoProductoSin,
    setDescripcionProducto,
    setNombreProducto
} from "../../slices/productos/producto.slice";
import Select from "react-select";
import {SinActividadesPorDocumentoSector, SinProductoServicioProps} from "../../../sin/interfaces/sin.interface";
import {fetchSinProductoServicioPorActividad} from "../../../sin/api/sinProductoServicio.api";
import {swalException} from "../../../../utils/swal";
import {useDispatch} from "react-redux";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {fetchSinActividadesPorDocumentoSector} from "../../../sin/api/sinActividadesPorDocumentoSector";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";

interface OwnProps {}

type Props = OwnProps;

const ProductoHomologacion: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const dispatch = useDispatch()
    const [productosServicios, setProductosServicios] = useState<SinProductoServicioProps[]>([]);
    const [actividades, setActividades] = useState<SinActividadesPorDocumentoSector[]>([]);

    const fetchProductosServicios = async (codigoActividad: string) => {
        dispatch(setCodigoProductoSin(null))
        setProductosServicios([])
        const resp = await fetchSinProductoServicioPorActividad(codigoActividad)
            .catch(err => {
                swalException(err);
                return []
            })
        if (resp.length > 0) {
            setProductosServicios(resp)
        }
    }

    const fetchActividades = async () => {
        await fetchSinActividadesPorDocumentoSector()
            .then(async (data) => {
                setActividades(data)
                dispatch(setActividadEconomica(data[0]))
                await fetchProductosServicios(data[0].codigoActividad)
            })
            .catch(err => {
                swalException(err);
                return []
            })
    }
    useEffect(() => {
        fetchActividades().then()
    }, []);

    return (
        <>
            <SimpleCard title={'Datos Básicos'}>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} xs={12}>
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
                                onChange={async (val: any) => {
                                    dispatch(setActividadEconomica(val))
                                    await fetchProductosServicios(val.codigoActividad).then()
                                }}
                                isSearchable={false}
                                options={actividades}
                                getOptionValue={(item) => item.codigoActividad}
                                getOptionLabel={(item) => `${item.tipoActividad} - ${item.codigoActividad} - ${item.actividadEconomica}`}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
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
                                onChange={(e: any) => {
                                    dispatch(setCodigoProductoSin(e))
                                }}
                                options={productosServicios}
                                getOptionValue={(ps) => ps.codigoProducto}
                                getOptionLabel={(ps) => `${ps.codigoProducto} - ${ps.descripcionProducto}`}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <TextField
                            name="nombre"
                            label="Nombre Producto"
                            size="small"
                            fullWidth
                            value={prod.titulo}
                            onChange={(e) => {
                                dispatch(setNombreProducto(e.target.value))
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
                                dispatch(setDescripcionProducto(e.target.value))
                            }}
                        />
                    </Grid>
                </Grid>
            </SimpleCard>
        </>
    );
};

export default ProductoHomologacion;
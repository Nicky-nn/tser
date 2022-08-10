import React, {FunctionComponent, useState} from 'react';
import {FormControl, FormHelperText, Grid} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {handleSelect} from "../../../../utils/helper";
import {MyInputLabel} from "../../../../base/components/MyInputs/MyInputLabel";
import {apiSinUnidadMedida} from "../../../sin/api/sinUnidadMedida.api";
import {SinUnidadMedidaProps} from "../../../sin/interfaces/sin.interface";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import Select from "react-select";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {useQuery} from "@tanstack/react-query";
import {FormikProps} from "formik";
import {prodMap, ProductoInputProps} from "../../interfaces/producto.interface";

interface OwnProps {
    formik: FormikProps<ProductoInputProps>
}

type Props = OwnProps;

const ProductoPrecio: FunctionComponent<Props> = (props) => {
    const {formik} = props;
    const {values, setFieldValue, errors} = formik

    const [isError, setError] = useState<any>(null);
    // const dispatch = useDispatch()

    const {data: unidadesMedida} = useQuery<SinUnidadMedidaProps[], Error>(['unidadesMedida'], () => {
        return apiSinUnidadMedida()
    })

    if (isError) {
        return <h1>Ocurrio un error</h1>
    }


    return (
        <SimpleCard title={'PRECIO'}>
            <Grid container columnSpacing={3} rowSpacing={2}>
                <Grid item lg={12} md={12} xs={12}>
                    <FormControl fullWidth sx={{mb: 1}}
                                 error={Boolean(errors.variante?.unidadMedida)}
                    >
                        <SelectInputLabel shrink>
                            Unidad Medida
                        </SelectInputLabel>
                        <Select<SinUnidadMedidaProps>
                            styles={reactSelectStyles}
                            menuPosition={'fixed'}
                            placeholder={'Seleccione la unidad de medida'}
                            value={values.variante.unidadMedida}
                            onChange={async (unidadMedida: any) => {
                                setFieldValue(prodMap.variante, {...values.variante, unidadMedida})
                                setFieldValue(prodMap.variantes, values.variantes.map(value => {
                                    return {
                                        ...value,
                                        unidadMedida
                                    }
                                }))
                            }}
                            options={unidadesMedida}
                            getOptionValue={(item) => item.codigoClasificador}
                            getOptionLabel={(item) => `${item.codigoClasificador} - ${item.descripcion}`}
                        />
                        <FormHelperText>{errors.variante?.unidadMedida}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth
                                 error={Boolean(errors.variante?.precio)}
                    >
                        <MyInputLabel shrink>Precio</MyInputLabel>
                        <InputNumber
                            min={0}
                            placeholder={'0.00'}
                            name={'variante.precio'}
                            value={values.variante.precio}
                            onFocus={handleSelect}
                            onChange={(precio: number) => {
                                setFieldValue(prodMap.variante, {
                                    ...values.variante,
                                    precio
                                })
                                setFieldValue(prodMap.variantes, values.variantes.map(value => {
                                    return {
                                        ...value,
                                        precio
                                    }
                                }))
                            }}
                            formatter={numberWithCommas}
                        />
                        <FormHelperText>{errors.variante?.precio}</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth component={'div'}>
                        <MyInputLabel shrink>Precio de comparación</MyInputLabel>
                        <InputNumber
                            min={0}
                            name={'variante.precioComparacion'}
                            placeholder={'0.00'}
                            value={values.variante.precioComparacion}
                            onFocus={handleSelect}
                            onChange={(precioComparacion: number) => {
                                setFieldValue(prodMap.variante, {
                                    ...values.variante,
                                    precioComparacion
                                })
                                setFieldValue(prodMap.variantes, values.variantes.map(value => {
                                    return {
                                        ...value,
                                        precioComparacion
                                    }
                                }))
                            }}
                            formatter={numberWithCommas}
                        />
                    </FormControl>
                </Grid>

                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth component={'div'}>
                        <MyInputLabel shrink>Costo</MyInputLabel>
                        <InputNumber
                            min={0}
                            name={'variante.costo'}
                            max={values.variante.precio - 1}
                            placeholder={'0.00'}
                            value={values.variante.costo}
                            onFocus={handleSelect}
                            onChange={(costo: number) => {
                                setFieldValue(prodMap.variante, {
                                    ...values.variante,
                                    costo
                                })
                                setFieldValue(prodMap.variantes, values.variantes.map(value => {
                                    return {
                                        ...value,
                                        costo
                                    }
                                }))
                            }}
                            formatter={numberWithCommas}
                        />
                        <FormHelperText>Información protegida</FormHelperText>
                    </FormControl>
                </Grid>

            </Grid>
        </SimpleCard>
    );
};

export default ProductoPrecio;

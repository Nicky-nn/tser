import React, {ChangeEvent, FunctionComponent, useState} from 'react';
import {Button, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, Grid} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {
    selectProducto,
    setOpcionesProducto,
    setVariantesProducto,
    setVarianteUnica
} from "../../slices/productos/producto.slice";
import ProductoCantidadDialog from "./ProductoOpciones/ProductoCantidadDialog";
import {useDispatch} from "react-redux";
import {swalErrorMsg} from "../../../../utils/swal";
import {arrayMove, List} from "react-movable";
import {ProductoVarianteInputProps} from "../../interfaces/producto.interface";
import {cartesianProduct} from "../../../../utils/helper";

interface OwnProps {
}

type Props = OwnProps;

const ProductoOpciones: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const [openProductOpcion, setOpenProductOpcion] = useState<boolean>(false);
    const generarVariantes = (opciones: any): ProductoVarianteInputProps[] | void => {
        const preVariantes: any = [];
        opciones.forEach((op: any) => {
            preVariantes.push(op.valores)
        })
        dispatch(setOpcionesProducto(opciones))
        const variantes: ProductoVarianteInputProps[] = cartesianProduct(preVariantes).map(pv => {
            return {
                codigoProducto: prod.varianteDefault.codigoProducto,
                titulo: pv.join(' / '),
                nombre: `${prod.titulo} ${pv.join(' / ')}`,
                disponibleParaVenta: true,
                codigoBarras: prod.varianteDefault.codigoBarras,
                precio: prod.varianteDefault.precio,
                precioComparacion: prod.varianteDefault.precioComparacion,
                costo: prod.varianteDefault.costo,
                inventario: prod.varianteDefault.inventario,
                codigoUnidadMedida: prod.varianteDefault.codigoUnidadMedida
            } as ProductoVarianteInputProps
        })
        dispatch(setVariantesProducto(variantes))
    }
    const dispatch = useDispatch();
    return (
        <SimpleCard title={'Opciones'}>
            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                <Grid item lg={12} md={12} xs={12}>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={prod.varianteUnica}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            dispatch(setVarianteUnica(e.target.checked))
                                        }}
                                    />
                                }
                                label="Este producto tiene opciones, como talla y color"/>
                        </FormGroup>
                    </FormControl>
                </Grid>
                {
                    prod.varianteUnica &&
                    (
                        <Grid item lg={12} md={12} xs={12}>
                            <Button size={"small"} onClick={() => {
                                setOpenProductOpcion(true)
                            }}>Adicionar Opción de producto</Button>

                            <List
                                values={prod.opcionesProducto}
                                onChange={({oldIndex, newIndex}) => {
                                    generarVariantes(arrayMove(prod.opcionesProducto, oldIndex, newIndex))
                                }}
                                renderList={({children, props, isDragged}) => (
                                    <div className="responsive-table">
                                        <table className="table-dense"
                                               style={{
                                                   cursor: isDragged ? 'grabbing' : undefined
                                               }}
                                        >
                                            <thead>
                                            <tr>
                                                <th style={{width: '30%'}}>Nombre</th>
                                                <th>Valores</th>
                                            </tr>
                                            </thead>
                                            <tbody {...props}>{children}</tbody>
                                        </table>
                                    </div>
                                )}
                                renderItem={({value, props, isDragged, isSelected}: any) => {
                                    const row = (
                                        <tr
                                            {...props}
                                            style={{
                                                ...props.style,
                                                cursor: isDragged ? 'grabbing' : 'grab',
                                                backgroundColor: isDragged || isSelected ? '#EEE' : '#fafafa'
                                            }}
                                        >
                                            <td data-label="NOMBRE">{value.nombre}</td>
                                            <td data-label="VALORES">{value.valores.map((val: string) => (
                                                <Chip key={val} label={val} color={'info'} variant="outlined"
                                                      size={'small'}/>
                                            ))}</td>
                                        </tr>
                                    )
                                    return isDragged ? (
                                        <table style={{...props.style, borderSpacing: 0}}>
                                            <tbody>{row}</tbody>
                                        </table>
                                    ) : (
                                        row
                                    );
                                }}
                            />
                        </Grid>
                    )
                }
            </Grid>
            <ProductoCantidadDialog
                id="productoCantidad" keepMounted
                open={openProductOpcion}
                onClose={(val) => {
                    if (val) {
                        const repetido = prod.opcionesProducto.filter(op => op.nombre === val.nombre)
                        if (repetido.length === 0) {
                            const newValue = [...prod.opcionesProducto, {...val, id: prod.opcionesProducto.length + 1}]
                            generarVariantes(newValue)
                            setOpenProductOpcion(false)
                        } else {
                            swalErrorMsg('El nombre de la opciones ya esta en uso')
                        }
                    } else {
                        setOpenProductOpcion(false)
                    }
                }}
            />
        </SimpleCard>
    );
};

export default ProductoOpciones;

import React, {FunctionComponent, useState} from 'react';
import {Button, Chip, Grid, IconButton, Tooltip} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {selectProducto, setProdOpciones, setProdVariantes} from "../../slices/productos/producto.slice";
import {useDispatch} from "react-redux";
import {swalConfirmDialog, swalErrorMsg} from "../../../../utils/swal";
import {arrayMove, List} from "react-movable";
import {OpcionesProductoProps, ProductoVarianteInputProps} from "../../interfaces/producto.interface";
import {Delete, Edit} from "@mui/icons-material";
import {cartesianProduct, genRandomString} from "../../../../utils/helper";
import {notError} from "../../../../utils/notification";
import ProductoAdicionarOpcionDialog from "../registro/ProductoOpciones/ProductoAdicionarOpcionDialog";

interface OwnProps {
}

type Props = OwnProps;

const ProductoActualizarOpciones: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const [openProductOpcion, setOpenProductOpcion] = useState<boolean>(false);
    const dispatch = useDispatch();
    const generarVariantes = (opciones: any): ProductoVarianteInputProps[] | void => {
        const preVariantes: any = [];
        opciones.forEach((op: any) => {
            preVariantes.push(op.valores)
        })
        const variantes = cartesianProduct(preVariantes).map((pv: any, index) => ({
            ...prod.variante,
            id: genRandomString(),
            codigoProducto: `${prod.variante.codigoProducto}-${index + 1}`,
            titulo: pv.join(' / '),
            nombre: `${prod.titulo} ${pv.join(' / ')}`
        }))

        // Generamos las nuevas opciones y variantes
        dispatch(setProdOpciones(opciones))
        dispatch(setProdVariantes(variantes))
    }
    // Eliminamos un determinado valor del item
    const eliminarValor = async (opcion: OpcionesProductoProps, valor: string) => {
        const newValor = opcion.valores.filter(op => op !== valor)
        if (newValor.length === 0) {
            notError('No se puede eliminar el ultimo valor')
            return
        }
        await swalConfirmDialog({
            text: `Confirma que desea eliminar <strong>${opcion.nombre} ${valor}</strong>. 
            Esta acción también eliminará las variantes de productos relacionados con ${valor}`
        }).then(resp => {
            if (resp.isConfirmed) {
                const newOpcionesProducto = prod.opcionesProducto.map(op => op.nombre === opcion.nombre ? {
                    ...op,
                    valores: newValor
                } : op)
                generarVariantes(newOpcionesProducto)
            }
        })
    }
    // Eliminamos todo el item
    const eliminarOpcion = (opcion: OpcionesProductoProps) => {
        if (prod.opcionesProducto.length > 1) {
            const newOpcionesProducto = prod.opcionesProducto.filter(op => op.nombre !== opcion.nombre)
            generarVariantes(newOpcionesProducto)
        } else {
            notError('Debe existe al menos una Opcion de producto')
        }

    }
    return (
        <>
            <SimpleCard title={'OPCIONES'}>
                <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                    {
                        !prod.varianteUnica &&
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
                                                    <th style={{width: '15%'}}>Opciones</th>
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
                                                <td data-label="Nombre">{value.nombre}</td>
                                                <td data-label="Valores">
                                                    {
                                                        value.valores.map((val: string) => (
                                                            <Chip
                                                                style={{marginRight: 10}}
                                                                key={val}
                                                                label={val}
                                                                color={'info'}
                                                                variant="outlined"
                                                                size={'small'}
                                                                onDelete={() => eliminarValor(value, val)}
                                                            />
                                                        ))
                                                    }
                                                </td>
                                                <td data-label="Opciones" width={'50px'} style={{textAlign: 'right'}}>
                                                    <div style={{width: 80}}>
                                                        <Tooltip title={'Modificar'} placement={'top'}>
                                                            <IconButton aria-label="modify"
                                                                        onClick={() => eliminarOpcion(value)}
                                                                        color={"primary"}>
                                                                <Edit/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={'Eliminar'} placement={'top'}>
                                                            <IconButton aria-label="delete"
                                                                        onClick={() => eliminarOpcion(value)}
                                                                        color={"error"}>
                                                                <Delete/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </td>
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
            </SimpleCard>
            <ProductoAdicionarOpcionDialog
                keepMounted={false}
                id="productoOpcion"
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
        </>

    );
};

export default ProductoActualizarOpciones;

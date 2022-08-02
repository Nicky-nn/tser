import React, {ChangeEvent, FunctionComponent, useState} from 'react';
import {
    Button,
    Checkbox,
    Chip,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Tooltip
} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {selectProducto, setProducto} from "../../slices/productos/producto.slice";
import ProductoAdicionarOpcionDialog from "./ProductoOpciones/ProductoAdicionarOpcionDialog";
import {useDispatch} from "react-redux";
import {swalConfirmDialog} from "../../../../utils/swal";
import {arrayMove, List} from "react-movable";
import {OpcionesProductoProps, ProductoVarianteInputProps} from "../../interfaces/producto.interface";
import {Delete, Edit} from "@mui/icons-material";
import {cartesianProduct, genRandomString, isEmptyValue} from "../../../../utils/helper";
import {notError} from "../../../../utils/notification";

interface OwnProps {
}

type Props = OwnProps;

const ProductoOpciones: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const [openProductOpcion, setOpenProductOpcion] = useState<boolean>(false);
    const [opcionesEdit, setOpcionesEdit] = useState<OpcionesProductoProps | undefined>(undefined);
    const dispatch = useDispatch();

    // Generacion de variantes de productos
    const generarVariantes = (opciones: any): ProductoVarianteInputProps[] | void => {
        const preVariantes: any = [];
        opciones.forEach((op: any) => {
            preVariantes.push(op.valores)
        })
        const variantes = cartesianProduct(preVariantes).map((pv: any, index) => ({
            ...prod.variante,
            id: genRandomString(),
            codigoProducto: !isEmptyValue(prod.variante.codigoProducto) ? `${prod.variante.codigoProducto}-${index + 1}` : '',
            titulo: pv.join(' / '),
            nombre: `${prod.titulo} ${pv.join(' / ')}`
        })) || []

        // Generamos las nuevas opciones y variantes
        dispatch(setProducto({...prod, opcionesProducto: opciones, variantes: opciones.length === 0 ? [] : variantes}))
    }

    // Eliminamos un determinado valor del item
    const eliminarVariante = async (opcion: OpcionesProductoProps, valor: string) => {
        const newValor = opcion.valores.filter(op => op !== valor)
        if(newValor.length > 0) {
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
        } else {
            notError('Debe existir al menos 1 valor presente')
        }

    }

    // Eliminamos todo el item
    const eliminarOpcion = async (opcion: OpcionesProductoProps) => {
        await swalConfirmDialog({
            text: `¿Confirma que desea eliminar <strong>${opcion.nombre}</strong>. y todos sus valores?`
        }).then(resp => {
            if (resp.isConfirmed) {
                const newOpcionesProducto = prod.opcionesProducto.filter(op => op.nombre !== opcion.nombre)
                generarVariantes(newOpcionesProducto)
            }
        })
    }

    const modificarOpciones = async (opcion: OpcionesProductoProps) => {
        setOpcionesEdit(opcion)
        setOpenProductOpcion(true)
    }
    return (
        <>
            <SimpleCard title={'OPCIONES'}>
                <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                    <Grid item lg={12} md={12} xs={12}>
                        <FormControl>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!prod.varianteUnica}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                // clear opciones y variantes
                                                dispatch(setProducto({...prod, varianteUnica: !e.target.checked}))
                                            }}
                                        />
                                    }
                                    label="Este producto tiene opciones, como talla y color"/>
                            </FormGroup>
                        </FormControl>
                    </Grid>
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
                                                                onDelete={() => eliminarVariante(value, val)}
                                                            />
                                                        ))
                                                    }
                                                </td>
                                                <td data-label="Opciones" width={'50px'} style={{textAlign: 'right'}}>
                                                    <div style={{width: 80}}>
                                                        <Tooltip title={'Modificar'} placement={'top'}>
                                                            <IconButton aria-label="modify"
                                                                        onClick={() => modificarOpciones(value)}
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
                opcion={opcionesEdit}
                open={openProductOpcion}
                onClose={(val) => {
                    setOpcionesEdit(undefined)
                    if (val) {
                        const repetido = prod.opcionesProducto.filter(op => op.id === val.id)
                        if (repetido.length === 0) {
                            const newValue = [...prod.opcionesProducto, {...val}]
                            generarVariantes(newValue)
                            setOpenProductOpcion(false)
                        } else {
                            // Buscamos y actualizamos el registro
                            const updateValue = prod.opcionesProducto.map(item => {
                                if (item.id === val.id) {
                                    return val
                                }
                                return item
                            })
                            generarVariantes(updateValue)
                            setOpenProductOpcion(false)
                        }
                    } else {
                        setOpenProductOpcion(false)
                    }
                }}
            />
        </>

    );
};

export default ProductoOpciones;

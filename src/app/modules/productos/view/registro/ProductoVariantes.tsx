import {FunctionComponent, useState} from 'react';
import {Grid, IconButton} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {
    prodMap,
    PRODUCTO_VARIANTE_INITIAL_VALUES,
    ProductoInputProps,
    ProductoVarianteInputProps
} from "../../interfaces/producto.interface";
import DataTable, {TableColumn} from "react-data-table-component";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import PrecioInventarioVariantesDialog from "./ProductoVariantes/PrecioInventarioVariantesDialog";
import PrecioInventarioDetalle from "./ProductoVariantes/PrecioInventarioDetalle";
import {Delete, Edit} from "@mui/icons-material";
import {swalConfirmDialog} from "../../../../utils/swal";
import {notError} from "../../../../utils/notification";
import {FormikProps} from "formik";

interface OwnProps {
    formik: FormikProps<ProductoInputProps>
}

type Props = OwnProps;


const ProductoVariantes: FunctionComponent<Props> = (props) => {
    const {formik} = props;
    const {values, setFieldValue} = formik
    const [data, setData] = useState<ProductoVarianteInputProps[]>(values.variantes);
    const [variante, setVariante] = useState<ProductoVarianteInputProps>(PRODUCTO_VARIANTE_INITIAL_VALUES);
    const [openDialog, setOpenDialog] = useState(false);

    const columns: TableColumn<ProductoVarianteInputProps>[] = [
        {
            name: 'Variante',
            selector: (row) => row.titulo
        }, {
            name: 'Código',
            selector: (row) => row.codigoProducto
        }, {
            name: 'Unidad Medida',
            selector: (row) => row.unidadMedida?.descripcion || '',
        }, {
            name: 'Precio',
            selector: (row) => row.precio,
            right: true,
            cell: row => numberWithCommas(row.precio, {})
        }, {
            name: 'Opciones',
            right: true,
            cell: row => (
                <>
                    <IconButton aria-label="delete" color={'primary'} onClick={() => {
                        setVariante(row)
                        setOpenDialog(true)
                    }}>
                        <Edit/>
                    </IconButton>
                    <IconButton aria-label="delete" color={'error'} onClick={async () => {
                        if (values.variantes.length > 1) {
                            await swalConfirmDialog({}).then(resp => {
                                if (resp.isConfirmed) {
                                    const newVariantes = values.variantes.filter(v => v.id !== row.id)
                                    setFieldValue(prodMap.variantes, newVariantes)
                                    // dispatch(setProducto({...prod, variantes: newVariantes}))
                                }
                            })
                        } else {
                            notError('Debe existe al menos 1 variante de producto')
                        }
                    }}>
                        <Delete/>
                    </IconButton>
                </>
            )
        }
    ]

    const ExpandedComponent = ({data}: any) => <PrecioInventarioDetalle variante={data}/>;

    return (
        <>
            {
                !values.varianteUnica && (
                    <>
                        <SimpleCard title={'VARIANTES DE PRODUCTO'}>
                            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                                <Grid item lg={12} md={12} xs={12}>
                                    <DataTable
                                        columns={columns}
                                        data={values.variantes}
                                        expandableRows
                                        expandableRowsComponent={ExpandedComponent}
                                        expandOnRowClicked={false}
                                        expandOnRowDoubleClicked={false}
                                        expandableRowsHideExpander={false}
                                    />
                                </Grid>
                            </Grid>
                        </SimpleCard>
                        <PrecioInventarioVariantesDialog
                            variante={variante}
                            id={'editVariante'}
                            keepMounted={false}
                            open={openDialog}
                            onClose={(data: ProductoVarianteInputProps | undefined) => {
                                if (data) {
                                    const newVariantes = values.variantes.map(v => {
                                        if (v.id === data.id)
                                            return data
                                        return v
                                    })
                                    setFieldValue(prodMap.variantes, newVariantes)
                                    // dispatch(setProducto({...prod, variantes: newVariantes}))
                                }
                                setOpenDialog(false)
                            }}
                        />
                    </>
                )
            }

        </>

    );
};

export default ProductoVariantes;

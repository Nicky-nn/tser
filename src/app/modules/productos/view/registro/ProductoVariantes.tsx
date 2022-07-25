import {FunctionComponent, useState} from 'react';
import {Grid, IconButton} from "@mui/material";
import {selectProducto, setProdVariantes} from "../../slices/productos/producto.slice";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {ProductoVarianteInitialValues, ProductoVarianteInputProps} from "../../interfaces/producto.interface";
import DataTable, {TableColumn} from "react-data-table-component";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import PrecioInventarioVariantesDialog from "./ProductoVariantes/PrecioInventarioVariantesDialog";
import PrecioInventarioDetalle from "./ProductoVariantes/PrecioInventarioDetalle";
import {Delete, Edit} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {swalConfirmDialog} from "../../../../utils/swal";
import {notError} from "../../../../utils/notification";

interface OwnProps {
}

type Props = OwnProps;


const ProductoVariantes: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const [data, setData] = useState<ProductoVarianteInputProps[]>(prod.variantes);
    const [variante, setVariante] = useState<ProductoVarianteInputProps>(ProductoVarianteInitialValues);
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch()

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
                        if (prod.variantes.length > 1) {
                            await swalConfirmDialog({}).then(resp => {
                                if (resp.isConfirmed) {
                                    const newVariantes = prod.variantes.filter(v => v.id !== row.id)
                                    dispatch(setProdVariantes(newVariantes))
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
                !prod.varianteUnica && (
                    <>
                        <SimpleCard title={'Variantes de productos'}>
                            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                                <Grid item lg={12} md={12} xs={12}>
                                    <DataTable
                                        columns={columns}
                                        data={prod.variantes}
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
                            incluirCantidad={prod.incluirCantidad}
                            id={'editVariante'}
                            keepMounted={false}
                            open={openDialog}
                            onClose={(data: ProductoVarianteInputProps | undefined) => {
                                if (data) {
                                    const newVariantes = prod.variantes.map(v => {
                                        if (v.id === data.id)
                                            return data
                                        return v
                                    })
                                    dispatch(setProdVariantes(newVariantes))
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

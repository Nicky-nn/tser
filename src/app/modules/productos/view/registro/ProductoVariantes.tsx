import {FunctionComponent, useState} from 'react';
import {Grid, IconButton} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {
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
import {useFieldArray, UseFormReturn} from "react-hook-form";

interface OwnProps {
    form: UseFormReturn<ProductoInputProps>
}

type Props = OwnProps;


const ProductoVariantes: FunctionComponent<Props> = (props) => {
    const {
        form: {
            control,
            watch,
            formState: {errors}
        }
    } = props
    const {replace} = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "variantes", // unique name for your Field Array
    });
    const [varianteWatch, variantesWatch] = watch(['variante', 'variantes'])
    const varianteUnicaWatch = watch('varianteUnica')

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
                        if (variantesWatch.length > 1) {
                            await swalConfirmDialog({}).then(resp => {
                                if (resp.isConfirmed) {
                                    const newVariantes = variantesWatch.filter(v => v.id !== row.id)
                                    replace(newVariantes)
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
                !varianteUnicaWatch && (
                    <>
                        <SimpleCard title={'VARIANTES DE PRODUCTO'}>
                            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                                <Grid item lg={12} md={12} xs={12}>
                                    <DataTable
                                        columns={columns}
                                        data={variantesWatch}
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
                                    const newVariantes = variantesWatch.map(v => {
                                        if (v.id === data.id)
                                            return data
                                        return v
                                    })
                                    replace(newVariantes)
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

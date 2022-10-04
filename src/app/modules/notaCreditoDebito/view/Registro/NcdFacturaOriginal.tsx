import React, {FunctionComponent, useMemo, useState} from 'react';
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {UseFormReturn} from "react-hook-form";
import {NcdInputProps} from "../../interfaces/ncdInterface";
import {Button, Grid, Typography} from "@mui/material";
import {FormTextField} from "../../../../base/components/Form";
import NcdFacturaOriginalDialog from "./NcdFacturaOriginalDialog";
import {DetalleFacturaProps, FacturaProps} from "../../../ventas/interfaces/factura";
import MaterialReactTable, {MRT_ColumnDef} from "material-react-table";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {RowSelectionState} from "@tanstack/react-table";

interface OwnProps {
    form: UseFormReturn<NcdInputProps>;
}

type Props = OwnProps;

const NcdFacturaOriginal: FunctionComponent<Props> = (props) => {
    const {
        form: {
            control,
            setValue,
            getValues,
            watch,
            formState: {errors},
        },
    } = props;

    const [openDialog, setOpenDialog] = useState(false);

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const [{numeroFactura, fechaEmision, razonSocial, cuf}, setFacturaOriginal] = useState({
        numeroFactura: '',
        fechaEmision: '',
        razonSocial: '',
        cuf: ''
    });

    const [data, setData] = useState<DetalleFacturaProps[]>([]);
    const columns = useMemo(
        //column definitions...
        () =>
            [
                {
                    accessorKey: 'nroItem',
                    header: 'Nro. Item',
                    size: 50
                },
                {
                    accessorKey: 'cantidad',
                    header: 'Cantidad',
                    size: 60
                },
                {
                    accessorKey: 'descripcion',
                    header: 'Descripción',
                },
                {
                    accessorKey: 'montoDescuento',
                    header: 'Descuento',
                    muiTableBodyCellProps: {
                        align: 'right',
                    },
                    size: 100,
                    Cell: ({cell}) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
                },
                {
                    accessorKey: 'precioUnitario',
                    header: 'Precio Unitario',
                    muiTableBodyCellProps: {
                        align: 'right',
                    },
                    size: 100,
                    Cell: ({cell}) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
                },
                {
                    accessorKey: 'subTotal',
                    header: 'Sub Total',
                    muiTableBodyCellProps: {
                        align: 'right',
                    },
                    size: 100,
                    Cell: ({cell}) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
                }
            ] as MRT_ColumnDef<DetalleFacturaProps>[],
        [], //end
    );

    return (<>
        <SimpleCard title={'DATOS DE LA FACTURA ORIGINAL'}>
            <Grid container spacing={3}>
                <Grid item lg={12}>
                    <Button size={'small'} variant={'contained'} color={'info'}
                            onClick={() => setOpenDialog(true)}
                    >
                        Seleccionar Factura</Button>
                    <hr/>
                </Grid>
                <Grid item lg={2} md={2} xs={12}>
                    <FormTextField
                        name="numeroFactura"
                        label="Número Factura"
                        value={numeroFactura}
                        autoComplete="off"
                    />
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                    <FormTextField
                        name="fechaEmision"
                        label="Fecha Emisión"
                        value={fechaEmision}
                    />
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <FormTextField
                        name="razonSocial"
                        label="Razon Social"
                        value={razonSocial}
                    />
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                    <FormTextField
                        name="cuf"
                        label="Código Control (C.U.F.)"
                        value={cuf}
                    />
                </Grid>
                <Grid item lg={12} md={12} xs={12} sx={{pt: 10}}>
                    <Typography gutterBottom variant={'h6'} >Detalle</Typography>
                    <MaterialReactTable
                        enableColumnActions={false}
                        enableColumnFilters={false}
                        enablePagination={false}
                        enableSorting={false}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}
                        columns={columns}
                        initialState={{density: 'compact'}}
                        data={data}
                        enableRowSelection
                        onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
                        state={{rowSelection}} //pass our managed row selection state to the table to use
                    />
                </Grid>
            </Grid>
        </SimpleCard>
        <>
            <NcdFacturaOriginalDialog
                id={'ncdFacturaOriginalDialogSeleccion'}
                keepMounted={false}
                open={openDialog}
                onClose={(value?: FacturaProps) => {
                    setOpenDialog(false);
                    if (value) {
                        console.log(value)
                        setFacturaOriginal({
                            numeroFactura: value.numeroFactura.toString(),
                            fechaEmision: value.fechaEmision,
                            razonSocial: value.cliente.razonSocial,
                            cuf: value.cuf
                        })
                        setValue('facturaCuf', value.cuf)
                        setData(value.detalle)
                        // setValue('tipoProducto', value);
                        // tpRefetch().then();
                    }
                }}
            />
        </>
    </>);
};

export default NcdFacturaOriginal;

import React, {FunctionComponent, useMemo, useState} from 'react';
import {Box, Button, Chip, IconButton, Stack} from "@mui/material";
import {Delete, Edit, Newspaper} from "@mui/icons-material";
import MaterialReactTable, {MRT_ColumnDef} from 'material-react-table';
import type {ColumnFiltersState, PaginationState, RowSelectionState,} from '@tanstack/react-table';
import {SortingState} from "@tanstack/react-table";
import {useQuery} from "@tanstack/react-query";
import {ProveedorProps} from "../interfaces/proveedor.interface";
import {useNavigate} from "react-router-dom";
import {PAGE_DEFAULT, PageInputProps} from "../../../interfaces";
import {genApiQuery} from "../../../utils/helper";
import {apiProveedores} from "../api/proveedores.api";
import {swalAsyncConfirmDialog, swalException} from "../../../utils/swal";
import {notSuccess} from "../../../utils/notification";
import {localization} from "../../../utils/localization";
import {proveedorRouteMap} from "../ProveedorRoutesMap";
import AuditIconButton from "../../../base/components/Auditoria/AuditIconButton";
import {apiProveedorEliminar} from "../api/proveedorEliminar.api";
import ProveedorRegistroDialog from "../view/ProveedorRegistroDialog";

interface OwnProps {
}

type Props = OwnProps;

const tableColumns: MRT_ColumnDef<ProveedorProps>[] = [
    {
        accessorKey: 'codigo',
        header: 'Código',
    }, {
        accessorKey: 'nombre',
        header: 'Proveedor',
    }, {
        accessorKey: 'direccion',
        header: 'Dirección',
    }, {
        accessorKey: 'ciudad',
        header: 'Ciudad',
    }, {
        accessorKey: 'contacto',
        header: 'Contacto',
    }, {
        accessorKey: 'correo',
        header: 'Correo Electrónico',
    }, {
        accessorKey: 'telefono',
        header: 'Teléfono',
    },
    {
        accessorFn: (row) => (<Chip size={'small'} label={row.state} color={"success"}/>),
        id: 'state',
        header: 'Estado',
    },
]

const ProveedorListado: FunctionComponent<Props> = (props) => {
    const navigate = useNavigate()
    const [openNuevoProveedor, setOpenNuevoProveedor] = useState<boolean>(false);
    // ESTADO DATATABLE
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGE_DEFAULT.page,
        pageSize: PAGE_DEFAULT.limit
    });
    const [rowCount, setRowCount] = useState(0);
    const [isRefetching, setIsRefetching] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    // FIN ESTADO DATATABLE

    const {data, isError, isLoading, status, refetch} = useQuery<ProveedorProps[]>(
        [
            'proveedoresListado',
            columnFilters,
            pagination.pageIndex,
            pagination.pageSize,
            sorting,
        ],
        async () => {
            const query = genApiQuery(columnFilters);
            const fetchPagination: PageInputProps = {
                ...PAGE_DEFAULT,
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                reverse: sorting.length <= 0,
                query
            }
            const {pageInfo, docs} = await apiProveedores(fetchPagination);
            setRowCount(pageInfo.totalDocs);
            return docs
        },
        {
            refetchOnWindowFocus: true,
            keepPreviousData: true
        },
    );

    const columns = useMemo(() => tableColumns, []);

    const handleDeleteData = async (data: any) => {
        const resp = data.map((item: any) => item.original.codigo)
        await swalAsyncConfirmDialog({
            text: "Confirma que desea eliminar los registros seleccionados, esta operación no se podra revertir",
            preConfirm: () => {
                return apiProveedorEliminar(resp).catch(err => {
                    swalException(err)
                    return false
                })
            }
        }).then(resp => {
            if (resp.isConfirmed) {
                notSuccess()
                setRowSelection({})
                refetch()
            }
        })
    }
    return (<>
        <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} justifyContent="right" sx={{marginBottom: 3}}>
            <Button size={'small'} variant="contained" onClick={() => setOpenNuevoProveedor(true)}
                    startIcon={<Newspaper/>} color={'success'}
            > Nuevo Proveedor</Button>
        </Stack>
        <MaterialReactTable
            columns={columns}
            data={data ?? []}
            initialState={{showColumnFilters: false}}
            manualFiltering
            manualPagination
            manualSorting
            muiTableToolbarAlertBannerProps={
                isError
                    ? {color: 'error', children: 'Error loading data'}
                    : undefined
            }
            onColumnFiltersChange={setColumnFilters}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            rowCount={rowCount}
            localization={localization}
            state={{
                columnFilters,
                isLoading,
                pagination,
                showAlertBanner: isError,
                showProgressBars: isRefetching,
                density: 'compact',
                sorting,
                rowSelection
            }}
            muiSearchTextFieldProps={{
                variant: 'outlined',
                placeholder: 'Busqueda',
                InputLabelProps: {shrink: true},
                size: 'small',
            }}
            enableRowActions
            positionActionsColumn={'last'}
            renderRowActions={({row}) => (
                <div style={{display: 'flex', flexWrap: 'nowrap', gap: '0.5rem'}}>
                    <IconButton onClick={() => navigate(`${proveedorRouteMap.modificar}/${row.original.codigo}`)}
                                color={'primary'} aria-label="delete">
                        <Edit/>
                    </IconButton>
                    <AuditIconButton row={row.original}/>
                </div>
            )}
            muiTableHeadCellFilterTextFieldProps={{
                sx: {m: '0.5rem 0', width: '95%'},
                variant: 'outlined',
                size: 'small'
            }}
            enableRowSelection
            onRowSelectionChange={setRowSelection}
            renderTopToolbarCustomActions={({table}) => {
                return (
                    <Box
                        sx={{display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap'}}
                    >
                        <Button
                            color="error"
                            onClick={() => handleDeleteData(table.getSelectedRowModel().flatRows)}
                            startIcon={<Delete/>}
                            variant="contained"
                            size={'small'}
                            disabled={table.getSelectedRowModel().flatRows.length === 0}
                        >
                            Eliminar
                        </Button>
                    </Box>
                )
            }}
        />
        <ProveedorRegistroDialog
            id={'proveedorRegistroDialog'}
            keepMounted={false}
            open={openNuevoProveedor}
            onClose={(value?: ProveedorProps) => {
                if (value) {
                    refetch().then()
                }
                setOpenNuevoProveedor(false)
            }}
        />
    </>);
};

export default ProveedorListado;

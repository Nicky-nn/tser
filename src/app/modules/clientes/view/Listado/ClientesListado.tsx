import React, {FunctionComponent, useMemo, useState} from 'react';
import {Chip, IconButton} from "@mui/material";
import {genApiQuery} from "../../../../utils/helper";
import {fetchClienteListado} from "../../api/clienteListado.api";
import {PAGE_DEFAULT, PageProps} from "../../../../interfaces";
import MaterialReactTable, {MRT_ColumnDef} from 'material-react-table';
import {useQuery} from "@tanstack/react-query";
import {ColumnFiltersState, PaginationState, SortingState} from "@tanstack/react-table";
import {localization} from "../../../../utils/localization";
import {Edit} from "@mui/icons-material";
import AuditIconButton from "../../../../base/components/Auditoria/AuditIconButton";
import ClienteModificarDialog from "../ClienteModificarDialog";
import {ClienteProps} from "../../interfaces/cliente";

interface OwnProps {
}

type Props = OwnProps;

const tableColumns: MRT_ColumnDef<ClienteProps>[] = [
    {
        accessorKey: 'razonSocial',
        header: 'Razon Social',
    },
    {
        accessorFn: (row) => `${row.numeroDocumento}${row.complemento ? `-${row.complemento}` : ''}`,
        id: 'numeroDocumento',
        header: 'Nro. Documento',
    },
    {
        id: 'email',
        header: 'Correo',
        accessorKey: 'email'
    },
    {
        accessorKey: 'tipoDocumentoIdentidad.descripcion',
        id: 'tipoDocumentoIdentidad.descripcion',
        header: 'Tipo Documento',
    },
    {
        accessorFn: (row) => (<Chip size={'small'} label={row.state} color={"success"}/>),
        id: 'state',
        header: 'Estado',
    },
]

const ClientesListado: FunctionComponent<Props> = (props) => {

    // DATA TABLE
    const [rowCount, setRowCount] = useState(0);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGE_DEFAULT.page,
        pageSize: PAGE_DEFAULT.limit
    });
    // FIN DATA TABLE
    const [openDialog, setOpenDialog] = useState(false);
    const [cliente, setCliente] = useState<ClienteProps | null>(null);

    const {data: clientes, isError, isLoading, isFetching} = useQuery([
            'client',
            columnFilters,
            pagination.pageIndex,
            pagination.pageSize,
            sorting
        ],
        async () => {
            const query = genApiQuery(columnFilters);
            const fetchPagination: PageProps = {
                ...PAGE_DEFAULT,
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                reverse: sorting.length <= 0,
                query
            }
            const {pageInfo, docs} = await fetchClienteListado(fetchPagination);
            setRowCount(pageInfo.totalDocs);
            return docs
        }, {keepPreviousData: true})
    const columns = useMemo(() => tableColumns, [])

    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={clientes ?? []}
                initialState={{showColumnFilters: false}}
                manualFiltering
                manualPagination
                manualSorting
                enableDensityToggle={false}
                enableGlobalFilter={false}
                localization={localization}
                enableRowNumbers={true}
                muiTableToolbarAlertBannerProps={
                    isError
                        ? {
                            color: 'error',
                            children: 'Error loading data',
                        }
                        : undefined
                }
                onColumnFiltersChange={setColumnFilters}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                rowCount={rowCount}
                state={{
                    columnFilters,
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isFetching,
                    sorting,
                    density: 'compact'
                }}
                enableRowActions
                positionActionsColumn={'last'}
                renderRowActions={({row}) => (
                    <>
                        <div style={{display: 'flex', flexWrap: 'nowrap', gap: '0.5rem'}}>
                            <IconButton onClick={() => {
                                setCliente(row.original)
                                setOpenDialog(true)
                            }}
                                        color={'primary'} aria-label="delete">
                                <Edit/>
                            </IconButton>
                            <AuditIconButton row={row.original}/>
                        </div>
                    </>
                )}
                muiTableHeadCellFilterTextFieldProps={{
                    sx: {m: '0.5rem 0', width: '95%'},
                    variant: 'outlined',
                    size: 'small'
                }}
            />
            {
                cliente && <ClienteModificarDialog
                    id={'clienteModificar'}
                    keepMounted
                    open={openDialog}
                    cliente={cliente!}
                    onClose={(value?: ClienteProps) => {
                        if(value){
                            console.log(value)
                        }
                        setCliente(null)
                        setOpenDialog(false)
                    }}
                />
            }

        </>
    );
}
export default ClientesListado
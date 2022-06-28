import React, {FunctionComponent, useEffect, useState} from 'react';
import {Button, Grid, IconButton, InputAdornment, Stack, TextField} from "@mui/material";
import {FileDownload, LayersClear, MenuOpen, Search, UploadFile} from "@mui/icons-material";
import DataTable, {TableColumn} from "react-data-table-component";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import SimpleMenu, {StyledMenuItem} from "../../../../base/components/MyMenu/SimpleMenu";
import {openInNewTab} from "../../../../utils/helper";
import {fetchClienteListado} from "../../api/clienteListado.api";
import {PAGE_DEFAULT, PAGE_INFO_DEFAULT, PageInfoProps, PageProps} from "../../../../interfaces";
import {ClienteProps} from "../../../../base/api/cliente.api";
import AuditIconButton from "../../../../base/components/Auditoria/AuditIconButton";

interface OwnProps {
}

type Props = OwnProps;

const columns: TableColumn<ClienteProps>[] = [{
    name: 'Razon Social',
    sortable: true,
    selector: (row) => row.razonSocial,
}, {
    name: 'Nro. Documento',
    sortable: true,
    selector: (row) => row.numeroDocumento,
    cell: (row) => `${row.numeroDocumento}${row.complemento ? `-${row.complemento}` : ''}`,
    width: '170px'
}, {
    name: 'Correo Electrónico',
    selector: (row) => row.email,
}, {
    name: 'Tipo Documento',
    selector: (row) => row.tipoDocumentoIdentidad.descripcion,
}, {
    name: 'Acciones',
    cell: (row) => (<>
        <SimpleMenu
            menuButton={
                <>
                    <IconButton aria-label="delete">
                        <MenuOpen/>
                    </IconButton>
                </>
            }
        >
            <StyledMenuItem onClick={() => {
                openInNewTab(row._id)
            }}>
                <LayersClear/> Modificar Datos
            </StyledMenuItem>
        </SimpleMenu>
        <AuditIconButton row={row}/>
    </>),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
},
];

const ClientesListado: FunctionComponent<Props> = (props) => {
    const [loading, setLoading] = useState(false);
    const [{page, limit, query}, setPage] = useState<PageProps>(PAGE_DEFAULT);
    const [pageInfo, setPageInfo] = useState<PageInfoProps>(PAGE_INFO_DEFAULT);
    const [data, setData] = useState<ClienteProps[]>([]);

    const fetchClientes = async (pageProp: PageProps) => {
        setLoading(true);
        await fetchClienteListado(pageProp).then(cli => {
            setData(cli.docs)
            setPageInfo(cli.pageInfo)
        })
        setLoading(false);
    };

    useEffect(() => {
        fetchClientes(PAGE_DEFAULT).then()
    }, []);

    const handlePerRowsChange = async (limit: number, page: number) => {
        await fetchClientes({limit, page}).then()
        setPage({limit, page, query})
    };

    const handlePageChange = async (page: number) => {
        await fetchClientes({limit, page, query}).then()
        setPage({limit, page, query})
    };

    const handleFilter = async (e: any) => {
        e.preventDefault()
        const filter = e.target.value.trim()
        const filterQuery = filter.length > 0 ? `razonSocial=/${filter}/i` : ''
        setTimeout(async () => {
            await fetchClientes({limit, page, query: filterQuery})
        }, 500)
    }
    return (
        <SimpleCard>
            <Grid container spacing={1} mb={1}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <TextField
                        label="Filtrar Clientes"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                        }}
                        onChange={handleFilter}
                        variant="outlined"
                        size={'small'}
                    />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={1}>
                        <Button variant="outlined" color={'inherit'} startIcon={<UploadFile/>}>Proveedor</Button>
                        <Button variant="outlined" color={'inherit'} startIcon={<FileDownload/>}>Estado</Button>
                    </Stack>
                </Grid>
            </Grid>

            <DataTable
                columns={columns}
                data={data}
                selectableRows
                progressPending={loading}
                dense
                pagination
                paginationServer
                paginationTotalRows={pageInfo.totalDocs}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </SimpleCard>
    );
}
export default ClientesListado
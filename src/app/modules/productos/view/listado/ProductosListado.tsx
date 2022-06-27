import React, {FunctionComponent} from 'react';
import {Button, IconButton, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import {
    FileDownload,
    FileOpen,
    LayersClear,
    MenuOpen,
    PictureAsPdf,
    Search,
    UploadFile,
    Visibility
} from "@mui/icons-material";
import DataTable, {TableColumn} from "react-data-table-component";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import SimpleMenu, {StyledMenuItem} from "../../../../base/components/MyMenu/SimpleMenu";
import {openInNewTab} from "../../../../utils/helper";
import {HtmlTooltip} from "../../../../base/components/Tooltip/HtmlTooltip";

interface OwnProps {
}

type Props = OwnProps;

const columns: TableColumn<any>[] = [
    {
        name: 'Title',
        sortable: true,
        selector: (row: any) => row.title,
        width: '120px'
    },
    {
        name: 'Year',
        selector: (row: any) => row.year,
    },
    {
        name: 'Acciones',
        cell: (row: any) => (<>
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
                    openInNewTab(row.original.representacionGrafica.pdf)
                    console.log('Pdf Medio Oficio', row.original);
                }}>
                    <LayersClear/> Anular Documento
                </StyledMenuItem>

                <StyledMenuItem onClick={() => {
                    openInNewTab(row.original.representacionGrafica.pdf)
                    console.log('Pdf Medio Oficio', row.original);
                }}>
                    <PictureAsPdf/> Pdf Medio Oficio
                </StyledMenuItem>

                <StyledMenuItem onClick={() => {
                    openInNewTab(row.original.representacionGrafica.xml)
                    console.log('Pdf Medio Oficio', row.original);
                }}>
                    <FileOpen/> Xml
                </StyledMenuItem>
            </SimpleMenu>
            <IconButton aria-label="auditoria">
                <HtmlTooltip
                    placement="top-start"
                    title={
                        <>
                            <Typography color="inherit">Tooltip with HTML</Typography>
                            <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
                            {"It's very engaging. Right?"}
                        </>
                    }
                >
                    <Visibility/>
                </HtmlTooltip>
            </IconButton>
        </>),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    },
];

const data = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]

const ProductosListado: FunctionComponent<Props> = (props) => {

    return (<>
        <SimpleCard>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} sx={{marginBottom: 1}}>
                <TextField
                    label="Filtrar Produtos"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search/>
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                    size={'small'}
                />
                <Button size={'small'} variant="outlined" startIcon={<UploadFile/>}>Proveedor</Button>
                <Button size={'small'} variant="outlined" startIcon={<FileDownload/>}>Estado</Button>
            </Stack>
            <DataTable
                columns={columns}
                data={data}
                selectableRows
                dense
                pagination
            />
        </SimpleCard>
    </>);
};

export default ProductosListado;

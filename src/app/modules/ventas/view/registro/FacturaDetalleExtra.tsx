import React, {FunctionComponent, useState} from 'react';
import {useAppSelector} from "../../../../hooks";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {Box} from "@mui/material";
import FacturaDetalleExtraDialog from "./DetalleExtra/FacturaDetalleExtraDialog";
import {setFactura} from "../../slices/facturacion/factura.slice";
import {useDispatch} from "react-redux";
import {Editor} from "@tinymce/tinymce-react";
import {TINYMCE_TEMPLATES} from "../../../../interfaces/tinimce.template";

interface OwnProps {
}

type Props = OwnProps;

const FacturaDetalleExtra: FunctionComponent<Props> = (props) => {
    const factura = useAppSelector(state => state.factura);
    const [openDetalleExtra, setOpenDetalleExtra] = useState(false);
    const dispatch = useDispatch();
    const handleDetalleExtra = (event: any) => {
        setOpenDetalleExtra(true);
    }
    const handleCloseDetalleExtra = (newValue?: string) => {
        setOpenDetalleExtra(false);
        if (newValue) {
            dispatch(setFactura({...factura, detalleExtra: newValue}))
        }
    };

    return (
        <>
            <SimpleCard title="Detalle Extra">
                <Box sx={{alignItems: 'right', textAlign: 'left'}}>
                    <Editor
                        apiKey='niud727ae46xgl3s5morxk4v03hq6rrv7lpkvustyt2ilp2k'
                        value={factura.detalleExtra || ''}
                        onInit={(evt, editor) => {
                            console.log(editor.getContent({format: 'text'}));
                        }}
                        onEditorChange={(newValue, editor) => {
                            dispatch(setFactura({...factura, detalleExtra: editor.getContent()}))
                            console.log(editor.getContent({format: 'text'}));
                        }}
                        init={{
                            plugins: 'table template code',
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | table | template | code',
                            menubar: false,
                            table_default_attributes: {
                                border: 'none'
                            },
                            min_height: 250,
                            height: 250,
                            max_height: 500,
                            templates: TINYMCE_TEMPLATES,
                        }}
                    />
                </Box>
            </SimpleCard>
            <FacturaDetalleExtraDialog
                id="ringtone-menu"
                keepMounted
                open={openDetalleExtra}
                onClose={handleCloseDetalleExtra}
                value={factura.detalleExtra || ''}
            />
        </>
    );
};

export default FacturaDetalleExtra;

import React, {FunctionComponent} from 'react';
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {Box} from "@mui/material";
import {Editor} from "@tinymce/tinymce-react";
import {TINYMCE_TEMPLATES} from "../../../../interfaces/tinimce.template";
import {UseFormReturn} from "react-hook-form";
import {FacturaInputProps} from "../../interfaces/factura";

interface OwnProps {
    form: UseFormReturn<FacturaInputProps>
}

type Props = OwnProps;

const FacturaDetalleExtra: FunctionComponent<Props> = (props) => {
    const {form: {control, setValue, getValues, formState: {errors}}} = props
    return (
        <>
            <SimpleCard title="Detalle Extra">
                <Box sx={{alignItems: 'right', textAlign: 'left'}}>
                    <Editor
                        apiKey='niud727ae46xgl3s5morxk4v03hq6rrv7lpkvustyt2ilp2k'
                        value={getValues("detalleExtra") || ''}
                        onInit={(evt, editor) => {
                            editor.on('blur', (e) => {
                                setValue("detalleExtraText", editor.getContent({format: 'text'}))
                                console.log(getValues("detalleExtra"), getValues("detalleExtraText"))
                            })
                        }}
                        onEditorChange={(newValue, editor) => {
                            setValue("detalleExtra", editor.getContent())
                            // dispatch(setFactura({...factura, detalleExtra: editor.getContent()}))
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
        </>
    );
};

export default FacturaDetalleExtra;

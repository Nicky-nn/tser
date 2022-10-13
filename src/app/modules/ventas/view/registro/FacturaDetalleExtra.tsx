import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tooltip,
  Typography,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import React, { FunctionComponent } from 'react';
import { UseFormReturn } from 'react-hook-form';

import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard';
import { TINYMCE_TEMPLATES } from '../../../../interfaces/tinimce.template';
import { FacturaInputProps } from '../../interfaces/factura';
import { ExpandMore } from '@mui/icons-material';

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>;
}

type Props = OwnProps;

const FacturaDetalleExtra: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props;
  return (
    <>
      <Accordion>
        <Tooltip title={'Click para Abrir / Cerrar'} placement={'top'} arrow>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content">
            <Typography variant={'subtitle2'}>DETALLE EXTRA</Typography>
          </AccordionSummary>
        </Tooltip>
        <AccordionDetails>
          <Box sx={{ alignItems: 'right', textAlign: 'left' }}>
            <Editor
              apiKey="niud727ae46xgl3s5morxk4v03hq6rrv7lpkvustyt2ilp2k"
              value={getValues('detalleExtra') || ''}
              onInit={(evt, editor) => {
                editor.on('blur', (e) => {
                  setValue('detalleExtraText', editor.getContent({ format: 'text' }));
                  console.log(getValues('detalleExtra'), getValues('detalleExtraText'));
                });
              }}
              onEditorChange={(newValue, editor) => {
                setValue('detalleExtra', editor.getContent());
                // dispatch(setFactura({...factura, detalleExtra: editor.getContent()}))
              }}
              init={{
                plugins: 'table template code',
                toolbar:
                  'undo redo | bold italic | alignleft aligncenter alignright alignjustify | table | template | code',
                menubar: false,
                table_default_attributes: {
                  border: 'none',
                },
                min_height: 250,
                height: 250,
                max_height: 500,
                templates: TINYMCE_TEMPLATES,
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default FacturaDetalleExtra;

import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tooltip,
  Typography,
} from '@mui/material'
import { Editor } from '@tinymce/tinymce-react'
import { FunctionComponent } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { FacturaInputProps } from '../../interfaces/factura'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
  detalleExtra: any
}

type Props = OwnProps

const FacturaDetalleExtra: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      getValues,
      formState: { errors },
    },
    detalleExtra,
  } = props

  return (
    <>
      <Accordion sx={{ backgroundColor: '#EFEFEF' }}>
        <Tooltip title={'Click para Abrir / Cerrar'} placement={'top'} arrow>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content">
            <Typography variant={'subtitle2'}>
              DETALLE EXTRA (Click para expandir)
            </Typography>
          </AccordionSummary>
        </Tooltip>
        <AccordionDetails>
          <Box sx={{ alignItems: 'right', textAlign: 'left' }}>
            <Editor
              apiKey="niud727ae46xgl3s5morxk4v03hq6rrv7lpkvustyt2ilp2k"
              value={getValues('detalleExtra') || ''}
              onInit={(evt, editor) => {
                editor.on('blur', (e: any) => {
                  setValue('detalleExtraText', editor.getContent({ format: 'text' }))
                })
              }}
              onEditorChange={(newValue, editor) => {
                setValue('detalleExtra', editor.getContent())
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
                templates: detalleExtra,
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default FacturaDetalleExtra

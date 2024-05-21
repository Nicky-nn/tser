import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tooltip,
  Typography,
} from '@mui/material'
import JoditEditor, { IJoditEditorProps } from 'jodit-react'
import { FunctionComponent, useMemo, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { TINYMCE_TEMPLATES } from '../../../../interfaces/tinimce.template'
import { FacturaInputProps } from '../../interfaces/factura'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
  detalleExtra: any
}

type Props = OwnProps

/**
 * Factura detalle extra que permite contenido html
 * @param props
 * @constructor
 */
const FacturaDetalleExtra: FunctionComponent<Props> = (props) => {
  const {
    form: { getValues, setValue },
    detalleExtra, // array que llega del servidor
  } = props

  const editor = useRef<any>(null)

  const config: any = useMemo<IJoditEditorProps['config']>(
    () => ({
      readonly: false,
      autofocus: true,
      useSearch: false,
      toolbarButtonSize: 'large',
      showWordsCounter: false,
      defaultActionOnPaste: 'insert_only_text',
      toolbarSticky: false,
      cleanHTML: {
        denyTags: 'script,img',
      },
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      disablePlugins: [
        'iframe',
        'ai-assistant',
        'search',
        'class-span',
        'color',
        'video',
        'image',
        'powered-by-jodit',
      ],
      buttons: [
        'bold',
        'italic',
        'eraser',
        'spellcheck',
        'copy',
        'paste',
        'selectall',
        'copyformat',
        'table',
        'ul',
        'ol',
        'left',
        'undo',
        'redo',
        'source',
        'fullsize',
        'preview',
        {
          name: 'plantilla',
          tooltip: 'Inserta desde una plantilla',
          exec: (editor: any) => {
            editor.s.insertHTML(TINYMCE_TEMPLATES[1].content)
          },
        },
      ],
    }),
    [],
  )

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
            <JoditEditor
              ref={editor}
              value={getValues('detalleExtra') || ''}
              config={config}
              onBlur={(newContent) => {
                setValue('detalleExtra', newContent)
                return false
              }} // preferred to use only this option to update the content for performance reasons
              onChange={(newContent) => {}}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default FacturaDetalleExtra

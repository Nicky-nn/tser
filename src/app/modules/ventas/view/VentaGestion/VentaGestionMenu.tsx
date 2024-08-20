import {
  FileOpen,
  LayersClear,
  Mail,
  MenuOpen,
  PictureAsPdf,
  WhatsApp,
} from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'

import AuditIconButton from '../../../../base/components/Auditoria/AuditIconButton'
import SimpleMenu, { SimpleMenuItem } from '../../../../base/components/MyMenu/SimpleMenu'
import { openInNewTab } from '../../../../utils/helper'
import { FacturaProps } from '../../interfaces/factura'

interface OwnProps {
  row: FacturaProps
  refetch: () => any
  setOpenAnularDocumento: Dispatch<SetStateAction<boolean>>
  setOpenReenviarEmails: Dispatch<SetStateAction<boolean>>
  setFactura: Dispatch<SetStateAction<FacturaProps | null>>
  setOpenReenviarWhatsapp: Dispatch<SetStateAction<boolean>>
}

type Props = OwnProps

/**
 * @description menu contextual para los servicios
 * @param props
 * @constructor
 */
const VentaGestionMenu: FunctionComponent<Props> = (props) => {
  const {
    row,
    setOpenAnularDocumento,
    setOpenReenviarEmails,
    setFactura,
    setOpenReenviarWhatsapp,
  } = props
  return (
    <>
      <Box>
        <SimpleMenu
          menuButton={
            <>
              <IconButton aria-label="delete">
                <MenuOpen />
              </IconButton>
            </>
          }
        >
          <SimpleMenuItem
            onClick={(e) => {
              e.preventDefault()
              setOpenAnularDocumento(true)
              setFactura(row)
            }}
          >
            <LayersClear /> Anular Documento
          </SimpleMenuItem>

          <SimpleMenuItem
            onClick={() => {
              openInNewTab(row.representacionGrafica.pdf)
            }}
          >
            <PictureAsPdf /> Pdf Medio Oficio
          </SimpleMenuItem>

          <SimpleMenuItem
            onClick={() => {
              openInNewTab(row.representacionGrafica.rollo)
            }}
          >
            <PictureAsPdf /> Pdf Rollo
          </SimpleMenuItem>

          <SimpleMenuItem
            onClick={() => {
              openInNewTab(row.representacionGrafica.xml)
            }}
          >
            <FileOpen /> Xml
          </SimpleMenuItem>

          <SimpleMenuItem
            onClick={() => {
              openInNewTab(row.representacionGrafica.sin)
            }}
          >
            <FileOpen /> Url S.I.N.
          </SimpleMenuItem>

          <SimpleMenuItem
            onClick={(e) => {
              e.preventDefault()
              setOpenReenviarEmails(true)
              setFactura(row)
            }}
          >
            <Mail /> Reenviar Correo
          </SimpleMenuItem>
          <SimpleMenuItem
            onClick={(e) => {
              e.preventDefault()
              setOpenReenviarWhatsapp(true)
              setFactura(row)
            }}
          >
            <WhatsApp /> Reenviar Whatsapp
          </SimpleMenuItem>
        </SimpleMenu>
        <AuditIconButton row={row} />
      </Box>
    </>
  )
}

export default VentaGestionMenu

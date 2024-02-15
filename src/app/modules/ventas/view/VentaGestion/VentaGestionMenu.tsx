import { FileOpen, LayersClear, Mail, MenuOpen, PictureAsPdf } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'

import AuditIconButton from '../../../../base/components/Auditoria/AuditIconButton'
import SimpleMenu, { StyledMenuItem } from '../../../../base/components/MyMenu/SimpleMenu'
import { openInNewTab } from '../../../../utils/helper'
import { FacturaProps } from '../../interfaces/factura'

interface OwnProps {
  row: FacturaProps
  refetch: () => any
  setOpenAnularDocumento: Dispatch<SetStateAction<boolean>>
  setOpenReenviarEmails: Dispatch<SetStateAction<boolean>>
  setFactura: Dispatch<SetStateAction<FacturaProps | null>>
}

type Props = OwnProps

/**
 * @description menu contextual para los servicios
 * @param props
 * @constructor
 */
const VentaGestionMenu: FunctionComponent<Props> = (props) => {
  const { row, setOpenAnularDocumento, setOpenReenviarEmails, setFactura } = props
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
          <StyledMenuItem
            onClick={(e) => {
              e.preventDefault()
              setOpenAnularDocumento(true)
              setFactura(row)
            }}
          >
            <LayersClear /> Anular Documento
          </StyledMenuItem>

          <StyledMenuItem
            onClick={() => {
              openInNewTab(row.representacionGrafica.pdf)
            }}
          >
            <PictureAsPdf /> Pdf Medio Oficio
          </StyledMenuItem>

          <StyledMenuItem
            onClick={() => {
              openInNewTab(row.representacionGrafica.rollo)
            }}
          >
            <PictureAsPdf /> Pdf Rollo
          </StyledMenuItem>

          <StyledMenuItem
            onClick={() => {
              openInNewTab(row.representacionGrafica.xml)
            }}
          >
            <FileOpen /> Xml
          </StyledMenuItem>

          <StyledMenuItem
            onClick={() => {
              openInNewTab(row.representacionGrafica.sin)
            }}
          >
            <FileOpen /> Url S.I.N.
          </StyledMenuItem>

          <StyledMenuItem
            onClick={(e) => {
              e.preventDefault()
              setOpenReenviarEmails(true)
              setFactura(row)
            }}
          >
            <Mail /> Reenviar Correo
          </StyledMenuItem>
        </SimpleMenu>
        <AuditIconButton row={row} />
      </Box>
    </>
  )
}

export default VentaGestionMenu

import {
  FileOpen,
  PictureAsPdfOutlined,
  PostAdd,
  ScreenSearchDesktop,
} from '@mui/icons-material'
import { Button, Container, List, ListItem, ListItemText } from '@mui/material'
import React, { FunctionComponent } from 'react'

import { openInNewTab } from '../../../utils/helper'

interface OwnProps {
  representacionGrafica: {
    pdf: string
    xml: string
    rollo: string
    sin: string
  }
}

type Props = OwnProps

const RepresentacionGraficaUrls: FunctionComponent<Props> = (props) => {
  const {
    representacionGrafica: { pdf, xml, sin, rollo },
  } = props
  return (
    <>
      <Container>
        <List dense>
          <ListItem>
            <ListItemText
              primary={
                <Button
                  variant={'contained'}
                  size={'small'}
                  onClick={() => openInNewTab(pdf)}
                  startIcon={<PictureAsPdfOutlined />}
                >
                  PDF MEDIO OFICIO
                </Button>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Button
                  variant={'contained'}
                  size={'small'}
                  onClick={() => openInNewTab(xml)}
                  startIcon={<FileOpen />}
                >
                  ARCHIVO XML
                </Button>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Button
                  variant={'contained'}
                  size={'small'}
                  onClick={() => openInNewTab(rollo)}
                  startIcon={<PostAdd />}
                >
                  ROLLO
                </Button>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Button
                  variant={'contained'}
                  size={'small'}
                  onClick={() => openInNewTab(sin)}
                  startIcon={<ScreenSearchDesktop />}
                >
                  CONSULTA QR S.I.N
                </Button>
              }
            />
          </ListItem>
        </List>
      </Container>
    </>
  )
}

export default RepresentacionGraficaUrls

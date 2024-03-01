import { Refresh } from '@mui/icons-material'
import { Box, IconButton, Stack, StackProps, Tooltip } from '@mui/material'
import { FC, ReactElement } from 'react'

import { StackMenuItem } from '../MyMenu/StackMenuItem'

interface OwnProps {
  refetch?: () => any // Si se actualizan los datos del menu
  children?: ReactElement | ReactElement[]
}

type Props = StackProps & OwnProps

/**
 * @description menu horizontal asociado a la tabla listado, para los hijos StackMenuItem
 * @param props
 * @constructor
 * renderTopToolbar Se usa solo si se requiere reemplazar toda la logica del top menu, sug NO USAR
 */
export const MuiRenderTopToolbarCustomActions: FC<Props> = (props) => {
  const { refetch, ...others } = props

  return (
    <Box sx={{ p: '0.3rem' }}>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        {...others}
      >
        {refetch && (
          <>
            <StackMenuItem>
              <Tooltip arrow title="Actualizar Datos">
                <IconButton onClick={() => refetch()}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </StackMenuItem>
          </>
        )}
        {props.children}
      </Stack>
    </Box>
  )
}
export default MuiRenderTopToolbarCustomActions

import { Refresh } from '@mui/icons-material'
import { Box, IconButton, Stack, styled, Tooltip } from '@mui/material'
import { StackProps } from '@mui/material/Stack/Stack'
import { FC, ReactElement } from 'react'

/**
 * @description Item para lo StackMenu y StackMenuActionTable
 */
export const StackMenuItem = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
}))

interface OwnProps {
  refetch?: () => any // Si se actualizan los datos del menu
  children?: ReactElement | ReactElement[]
}

type Props = StackProps & OwnProps

/**
 * @description menu horizontal asociado a la tabla listado, para los hijos StackMenuItem
 * @param props
 * @constructor
 */
export const StackMenuActionTable: FC<Props> = (props) => {
  const { refetch, ...others } = props

  return (
    <Box sx={{ p: '0.3rem' }}>
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
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
export default StackMenuActionTable

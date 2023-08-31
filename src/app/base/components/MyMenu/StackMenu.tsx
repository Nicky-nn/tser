import { Paper, Stack } from '@mui/material'
import { StackProps } from '@mui/material/Stack/Stack'
import React, { FC, ReactElement } from 'react'

interface OwnProps {
  children?: ReactElement | ReactElement[]
  /**
   * menu fixado, se mueve con el cursor del mause
   */
  asideSidebarFixed?: boolean
}

type Props = StackProps & OwnProps

/**
 * @description menu horizontal que se adapta a la pantalla, responsivo, para los hijos StackMenuItem
 * @param props
 * @constructor
 */
export const StackMenu: FC<Props> = (props) => {
  const { asideSidebarFixed, ...others } = props

  return (
    <Paper
      elevation={0}
      variant="elevation"
      square
      sx={{ p: '0.3rem', mb: 1, background: 'rgba(250, 250, 250, 0)' }}
      className={asideSidebarFixed ? 'asideSidebarFixed' : ''}
    >
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
        justifyContent="right"
        {...others}
      >
        {props.children}
      </Stack>
    </Paper>
  )
}
export default StackMenu

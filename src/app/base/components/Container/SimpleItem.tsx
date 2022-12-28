import { Theme } from '@mui/material'
import { styled } from '@mui/styles'

interface OwnProps {
  theme: Theme
}

type Props = OwnProps

export const SimpleItem = styled('div')(({ theme }: Props) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

import { InputLabel, styled, Theme } from '@mui/material'

export const SelectInputLabel = styled(InputLabel)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.primary.contrastText,
  paddingRight: 7,
  paddingLeft: 5,
  fontSize: 15,
}))

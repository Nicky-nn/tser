import { SxProps, Theme } from '@mui/system'

export const buttonStyles: SxProps<Theme> = {
  borderRadius: '10px',
  borderWidth: '2px',
  borderStyle: 'solid',
  height: '100px',
  width: '100%',
  boxShadow: 'none',
  '&:focus': {
    boxShadow: 'none',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
}

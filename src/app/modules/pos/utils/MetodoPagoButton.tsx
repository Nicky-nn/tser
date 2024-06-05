import { Button, useTheme } from '@mui/material'

import { buttonStyles } from './ButtonCompraStyles'

interface MetodoPagoButtonProps {
  text: string
  icon: React.ReactNode
  selected: boolean
  onClick: () => void
}

const MetodoPagoButton = ({ text, icon, selected, onClick }: MetodoPagoButtonProps) => {
  const theme = useTheme()

  const handleClick = () => {
    if (!selected) {
      onClick()
    }
  }

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      sx={{
        ...buttonStyles,
        borderColor: selected ? theme.palette.primary.main : '#D7D9DB',
        backgroundColor: selected ? theme.palette.primary.main : '#FFFFFF',
        color: selected ? '#FFFFFF' : '#D7D9DB',
      }}
      startIcon={icon}
      fullWidth
    >
      {text}
    </Button>
  )
}

export default MetodoPagoButton

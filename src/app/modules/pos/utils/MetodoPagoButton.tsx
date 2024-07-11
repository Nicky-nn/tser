import { Box, IconButton, Typography, useTheme } from '@mui/material'

interface MetodoPagoButtonProps {
  text: string
  icon: React.ReactNode
  selected: boolean
  onClick: () => void
}

const MetodoPagoButton = ({ text, icon, selected, onClick }: MetodoPagoButtonProps) => {
  const theme = useTheme()

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <IconButton
        sx={{
          backgroundColor: selected ? theme.palette.primary.main : '#FFFFFF',
          color: selected ? '#FFFFFF' : theme.palette.text.secondary,
          border: `1px solid ${selected ? theme.palette.primary.main : '#D7D9DB'}`,
          '&:hover': {
            backgroundColor: selected ? theme.palette.primary.dark : '#F5F5F5',
          },
        }}
      >
        {icon}
      </IconButton>
      <Typography
        variant="caption"
        sx={{
          mt: 0.5,
          color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
        }}
      >
        {text}
      </Typography>
    </Box>
  )
}

export default MetodoPagoButton

import { Close, CreditCard } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { styled, ThemeProvider, useTheme } from '@mui/system'
import { replace } from 'lodash'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { TarjetaMask } from '../../../base/components/Mask/TarjetaMask'

const CreditCardContainer = styled('div')(({ theme }) => ({
  // Pass theme as a parameter
  width: '280px',
  height: '180px',
  borderRadius: '10px',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  padding: '20px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
}))

const CardNumber = styled('div')(() => ({
  color: '#fff',
  fontSize: '18px',
  letterSpacing: '2px',
}))

const CardDetails = styled('div')(() => ({
  color: '#fff',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'space-between',
}))

interface CreditCardDialogProps {
  open: boolean
  onClose: () => void
  cliente: any
  form: any
  metodoPago: any
}

const CreditCardDialog = ({
  open,
  onClose,
  cliente,
  form,
  metodoPago,
}: CreditCardDialogProps) => {
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry] = useState('')

  const { setValue } = form

  // Función para formatear el número de tarjeta
  const formatCardNumber = (cardNumber = '') => {
    const visibleDigits = 4
    const totalDigits = cardNumber.length
    const middleDigits = '•••• ••••'
    const firstFour = cardNumber.substring(0, visibleDigits)
    const lastFour = cardNumber.substring(totalDigits - visibleDigits)
    return `${firstFour} ${middleDigits} ${lastFour}`
  }

  useEffect(() => {
    if (metodoPago === true) {
      setCardNumber('')
    }
  }, [metodoPago])

  const enviarNumeroTarjeta = () => {
    if (!cardNumber) {
      Swal.fire({
        icon: 'warning',
        title: 'Número de tarjeta inválido',
        text: 'Ingrese un número de tarjeta válido',
      })
      return
    }

    // Check if the number is "00000000"
    if (cardNumber === '00000000') {
      Swal.fire({
        icon: 'error',
        title: 'Número de tarjeta inválido',
        text: 'El número de tarjeta no puede ser "00000000".',
      })
      return
    }

    // Validate that the card number is 8 digits long
    if (cardNumber.length !== 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Número de tarjeta inválido',
        text: 'Ingrese un número de tarjeta válido',
      })
      return
    }

    onClose()
    setValue('numeroTarjeta', cardNumber)
  }

  return (
    <ThemeProvider theme={useTheme()}>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>
          Detalles de la tarjeta
          <IconButton
            onClick={onClose}
            style={{ position: 'absolute', right: '8px', top: '8px' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              lg={6}
              md={6}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CreditCardContainer>
                <CardNumber>{formatCardNumber(cardNumber)}</CardNumber>
                <CardDetails>
                  <div>{cliente?.razonSocial || 'Nombre del cliente'}</div>
                  <div>Exp: {cardExpiry || '••/••'}</div>
                </CardDetails>
              </CreditCardContainer>
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
              <FormControl fullWidth style={{ zIndex: 0 }}>
                <TextField
                  variant={'outlined'}
                  value={cardNumber || ''}
                  onChange={(event) => {
                    const numeroTarjeta = replace(
                      event.target.value,
                      new RegExp('-', 'g'),
                      '',
                    )
                      .replace(/_/g, '')
                      .trim()
                    setCardNumber(numeroTarjeta)
                  }}
                  name="numeroTarjeta"
                  size={'small'}
                  InputProps={{
                    inputComponent: TarjetaMask as any,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <FormHelperText>
                  Ingrese los primeros 4 y últimos 4 dígitos de la tarjeta
                </FormHelperText>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={enviarNumeroTarjeta}
                style={{ marginTop: '20px' }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}

export default CreditCardDialog

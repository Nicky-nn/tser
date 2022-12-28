import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material'
import InputNumber from 'rc-input-number'
import { useEffect, useRef, useState } from 'react'

import { numberWithCommas } from '../../../../../base/components/MyInputs/NumberInput'
import useAuth from '../../../../../base/hooks/useAuth'

export interface SimpleDialogProps {
  id: string
  keepMounted: boolean
  value: number
  open: boolean
  onClose: (value?: number) => void
}

export const DescuentoAdicionalDialog = (props: SimpleDialogProps) => {
  const {
    user: { monedaTienda },
  } = useAuth()
  const { onClose, keepMounted, value: valueProp, open, ...other } = props
  const [value, setValue] = useState(valueProp)
  const inputRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) {
      setValue(valueProp)
    }
  }, [valueProp, open])

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    onClose(value)
  }

  const handleEntering = () => {
    if (inputRef.current != null) {
      inputRef.current.focus()
    }
  }

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      keepMounted={keepMounted}
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Ingrese Descuento Adicional ({monedaTienda.descripcion})</DialogTitle>
      <DialogContent dividers>
        <Grid container>
          <Grid item lg={12}>
            <InputNumber
              min={0}
              value={value}
              onFocus={(e) => e.target.select()}
              onChange={(val: number | null) => setValue(val!)}
              formatter={numberWithCommas}
            />
            <Typography variant={'subtitle1'} sx={{ ml: 1 }} component={'small'}>
              {monedaTienda.sigla || ''}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleOk} style={{ marginRight: 10 }}>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

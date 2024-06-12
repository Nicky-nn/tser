import { ImportExport } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import useAuth from '../../../../base/hooks/useAuth'
import { swalConfirm, swalException } from '../../../../utils/swal'
import { fetchSinMotivoAnulacion } from '../../../sin/api/sinMotivoAnulacion.api'
import { SinMotivoAnulacionProps } from '../../../sin/interfaces/sin.interface'
import { fetchFacturaAnular } from '../../api/facturaAnular.api'
import { FacturaProps } from '../../interfaces/factura'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onClose: (value?: any) => void
  factura: FacturaProps | null
}

type Props = OwnProps

const AnularDocumentoDialog: FunctionComponent<Props> = (props: Props) => {
  const {
    user: { sucursal, puntoVenta },
  } = useAuth()
  const { onClose, open, factura, ...other } = props
  const [motivosAnulacion, setMotivosAnulacion] = useState<SinMotivoAnulacionProps[]>([])
  const [loading, setLoading] = useState(false)
  const initalValues: any = {
    codigoMotivo: null,
  }
  const [value, setValue] = useState(initalValues)

  useEffect(() => {
    if (open) {
      setValue(initalValues)
    }
  }, [open])

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      await fetchSinMotivoAnulacion().then((res) => {
        const filteredMotivos =
          //@ts-ignore
          res?.filter((motivo) => motivo.codigoClasificador !== '2') || []
        setMotivosAnulacion(filteredMotivos)
      })
    }
    fetch().then()
  }, [])

  const handleCancel = () => {
    onClose()
  }
  const entidad = {
    codigoSucursal: sucursal.codigo,
    codigoPuntoVenta: puntoVenta.codigo,
  }

  const handleOk = async () => {
    let aux = true
    if (!value.codigoMotivo) {
      toast.error('Seleccione el motivo de la anulación')
      aux = false
    }
    if (!factura?.cuf) {
      toast.error('Seleccione el documento')
      aux = false
    }
    if (aux) {
      Swal.fire({
        ...swalConfirm,
        html: '¿Confirma que desea anular el documento? <br> este proceso no se podra revertir',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          setLoading(true)
          return fetchFacturaAnular(
            factura?.cuf || '',
            value.codigoMotivo,
            entidad,
          ).catch((err) => {
            swalException(err)
            setLoading(false)
            return false
          })
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
        .then((result) => {
          if (result.isConfirmed) {
            toast.success('Documento Anulado correctamente')
            onClose(true)
            setLoading(false)
          }
        })
        // Abrimos Dialog
        .catch((err) => {
          swalException(err)
          setLoading(false)
        })
    }
  }

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Anular Documento</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12}>
              Nro Factura: {factura?.numeroFactura || ''} <br />
              Cliente: {factura?.cliente.razonSocial || ''} <br />
              Fecha Emisión: {factura?.fechaEmision || ''} <br />
            </Grid>
            <Grid item lg={12} md={12}>
              <FormControl sx={{ width: '100%' }} size="small">
                <InputLabel id="demo-select-small">Motivo de la anulación</InputLabel>
                <Select
                  labelId="Motivo de la anulación"
                  value={value.codigoMotivo || ''}
                  label="Motivo de la anulación"
                  onChange={(e) => {
                    setValue({ ...value, codigoMotivo: parseInt(e.target.value) })
                  }}
                >
                  {motivosAnulacion.map((ma) => (
                    <MenuItem key={ma.codigoClasificador} value={ma.codigoClasificador}>
                      {ma.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            disabled={loading}
            color={'error'}
            variant={'contained'}
            size={'small'}
            onClick={handleCancel}
          >
            Cancelar
          </Button>

          <LoadingButton
            loading={loading}
            onClick={handleOk}
            startIcon={<ImportExport />}
            loadingPosition="start"
            size={'small'}
            variant={'contained'}
            style={{ marginRight: 15 }}
          >
            Anular Documento
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AnularDocumentoDialog

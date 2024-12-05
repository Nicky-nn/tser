import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import useAuth from '../../../../base/hooks/useAuth'
import { isEmptyValue } from '../../../../utils/helper'
import { swalException } from '../../../../utils/swal'
import { apiEnviarArchivo } from '../../api/waapi.api'
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

const ReenviarWhatsAppDialog: FunctionComponent<Props> = (props: Props) => {
  const { onClose, open, factura, ...other } = props
  const [numerosCelulares, setnumerosCelulares] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])

  const {
    user: { sucursal, puntoVenta },
  } = useAuth()

  useEffect(() => {
    if (open) {
      setnumerosCelulares(factura?.cliente.telefono || '')
      setTags([factura?.cliente.telefono || ''])
    }
  }, [open])

  const handleCancel = () => {
    onClose()
  }

  const handleOk = async () => {
    let aux = true
    if (!factura?.cuf) {
      toast.error('Seleccione el documento')
      aux = false
    }
    if (isEmptyValue(numerosCelulares) && tags.length === 0) {
      toast.error('Debe registrar al menos un número de celular')
      aux = false
    }

    const regex = /^[0-9]{8}$/
    for (const tag of tags) {
      if (!regex.test(tag)) {
        toast.error(`${tag} no es un número de celular válido`)
        aux = false
      }
    }

    if (aux) {
      const mensaje = `*Saludos, Reenviamos su factura electrónica al Cliente: ${factura?.cliente.razonSocial}.*`
      const documentUrl = factura?.representacionGrafica.pdf
      const documentFileName = 'Factura.pdf'
      setLoading(true)
      try {
        for (const numero of tags) {
          await apiEnviarArchivo({
            entidad: {
              codigoSucursal: sucursal.codigo,
              codigoPuntoVenta: puntoVenta.codigo,
            },
            input: {
              codigoArea: '591',
              mensaje: mensaje,
              nombre: documentFileName,
              telefono: numero,
              url: documentUrl || '',
            },
          })
        }
        toast.success('Mensajes enviados correctamente')
        onClose()
      } catch (error) {
        swalException(error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddTag = () => {
    const boliviaPrefix = '591'
    let normalizedNumber = numerosCelulares.trim()

    if (normalizedNumber.startsWith(boliviaPrefix)) {
      normalizedNumber = normalizedNumber.slice(boliviaPrefix.length)
    }

    const regexBolivia = /^[0-9]{8}$/
    const regexInternacional = /^[1-9][0-9]{9,14}$/

    if (!isEmptyValue(normalizedNumber)) {
      if (regexBolivia.test(normalizedNumber)) {
        const exists = tags.some((tag) => {
          const normalizedTag = tag.startsWith(boliviaPrefix)
            ? tag.slice(boliviaPrefix.length)
            : tag
          return normalizedTag === normalizedNumber
        })

        if (!exists) {
          setTags([...tags, numerosCelulares])
        }
      } else if (regexInternacional.test(numerosCelulares)) {
        if (!tags.includes(numerosCelulares)) {
          setTags([...tags, numerosCelulares])
        }
      } else {
        toast.error(
          'Número de celular no válido. Asegúrese de que los números bolivianos tengan 8 dígitos o que los números internacionales incluyan el prefijo sin el +.',
        )
      }
    }
  }

  const handleDeleteTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 560 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Reenviar Notificación de Factura por Whatsapp</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12}>
              Nro Factura: {factura?.numeroFactura || ''} <br />
              Cliente: {factura?.cliente.razonSocial || ''} <br />
              Fecha Emisión: {factura?.fechaEmision || ''} <br />
              Código de control CUF: {factura?.cuf || ''} <br />
            </Grid>
            <Grid item lg={12} md={12}>
              <Alert severity="info">
                Para ingresar varios numeros de celular, presione la tecla Enter después
                de cada número, Si es para numeros de celular internacionales, debe
                agregar el código de país, sin el signo +.
              </Alert>
            </Grid>
            <Grid item lg={12} md={12}>
              <TextField
                id="numerosCelulares"
                name="numerosCelulares"
                label="Ingrese los números de celular"
                helperText="El botón se activará cuando ingrese un número de celular, presione Enter para agregar"
                size="small"
                fullWidth
                multiline
                rows={2}
                value={numerosCelulares}
                onChange={(event) => {
                  const value = event.target.value.replace(/[\r\n]+/g, '')
                  setnumerosCelulares(value)
                }}
                onKeyDown={(event) => {
                  if (
                    (event.key === 'Enter' ||
                      event.key === ' ' ||
                      event.key === ',' ||
                      event.key === ';') &&
                    !isEmptyValue(numerosCelulares)
                  ) {
                    handleAddTag()
                    setnumerosCelulares('')
                    ;(event.target as HTMLInputElement).value = '' // Eliminar los datos del input
                    event.preventDefault()
                  }
                }}
              />
            </Grid>
            <Grid item lg={12} md={12}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  variant="outlined"
                  style={{ margin: 5 }}
                />
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <LoadingButton
            variant={'contained'}
            size={'small'}
            onClick={handleOk}
            loading={loading}
            style={{ marginRight: 15 }}
            disabled={!isEmptyValue(numerosCelulares)}
          >
            Enviar Notificación
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReenviarWhatsAppDialog

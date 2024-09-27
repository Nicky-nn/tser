import {
  AccessTime as AccessTimeIcon,
  Apartment as ApartmentIcon,
  Close,
  ContactPhone as ContactPhoneIcon,
  DateRange as DateRangeIcon,
  ExpandMore as ExpandMoreIcon,
  LocationCity as LocationCityIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { FormTextField } from '../../../../base/components/Form'

interface DeliveryInfo {
  calle: string
  número: string
  apartamento: string
  colonia: string
  ciudad: string
  códigoPostal: string
  referenciasAdicionales: string
  fechaEntrega: string
  horaPreferida: string
  ventanaTiempo: string
  instruccionesEspeciales: string
  preferenciasContacto: string
  solicitarUtensilios: boolean
  entregaSinContacto: boolean
  nombreRepartidor: string
}

interface DataDelivery {
  atributo1: string | null
  atributo2: string | null
  atributo3: string | null
  atributo4: string | null
  direccionEntrega: string | null
  fechaEntrega: Date | null
  terminos: string
  fromDatabase: boolean
}

const parseDataDelivery = (data: DataDelivery): DeliveryInfo => {
  const [calle, número, apartamento, colonia, ciudad, códigoPostal] = (
    data.direccionEntrega || ''
  )
    .split('|')
    .map((item) => item.trim())

  const [nombreRepartidor, entregaSinContacto, solicitarUtensilios] = (
    data.atributo1 || ''
  ).split('|')

  return {
    calle: calle || '',
    número: número || '',
    apartamento: apartamento || '',
    colonia: colonia || '',
    ciudad: ciudad || '',
    códigoPostal: códigoPostal || '',
    referenciasAdicionales: data.atributo2 || '',
    fechaEntrega: data.fechaEntrega
      ? new Date(data.fechaEntrega).toISOString().split('T')[0]
      : '',
    horaPreferida: data.atributo3 || '',
    ventanaTiempo: data.atributo4 || '',
    instruccionesEspeciales: data.terminos?.split('|')[0] || '',
    preferenciasContacto: data.terminos?.split('|')[1] || '',
    solicitarUtensilios: solicitarUtensilios === 'true',
    entregaSinContacto: entregaSinContacto === 'true',
    nombreRepartidor: nombreRepartidor || '',
  }
}

const initialDeliveryInfo: DeliveryInfo = {
  calle: '',
  número: '',
  apartamento: '',
  colonia: '',
  ciudad: '',
  códigoPostal: '',
  referenciasAdicionales: '',
  fechaEntrega: '',
  horaPreferida: '',
  ventanaTiempo: '',
  instruccionesEspeciales: '',
  preferenciasContacto: '',
  solicitarUtensilios: false,
  entregaSinContacto: false,
  nombreRepartidor: '',
}

const DeliveryDialog = ({
  open,
  onClose,
  form,
  dataDelivery,
}: {
  open: boolean
  onClose: () => void
  form: any
  dataDelivery: DataDelivery
}) => {
  const { setValue } = form
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>(() =>
    dataDelivery.fromDatabase ? parseDataDelivery(dataDelivery) : initialDeliveryInfo,
  )
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (Object.keys(dataDelivery).length === 0) {
      setDeliveryInfo(initialDeliveryInfo)
    } else if (dataDelivery.fromDatabase) {
      setDeliveryInfo(parseDataDelivery(dataDelivery))
    }
  }, [dataDelivery])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]:
        name === 'solicitarUtensilios' || name === 'entregaSinContacto' ? checked : value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas guardar la información de entrega? Una vez guardada no se podrá modificar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      Swal.fire('Guardado', 'La información de entrega ha sido guardada', 'success')

      setValue(
        'atributo1',
        `${deliveryInfo.nombreRepartidor}|${deliveryInfo.entregaSinContacto}|${deliveryInfo.solicitarUtensilios}`,
      )
      setValue('atributo2', deliveryInfo.referenciasAdicionales)
      setValue('atributo3', deliveryInfo.horaPreferida)
      setValue('atributo4', deliveryInfo.ventanaTiempo)
      setValue(
        'direccionEntrega',
        `${deliveryInfo.calle}|${deliveryInfo.número}|${deliveryInfo.apartamento}|${deliveryInfo.colonia}|${deliveryInfo.ciudad}|${deliveryInfo.códigoPostal}`,
      )
      setValue('fechaEntrega', deliveryInfo.fechaEntrega)
      setValue(
        'terminos',
        `${deliveryInfo.instruccionesEspeciales}|${deliveryInfo.preferenciasContacto}`,
      )
      onClose()
    }
  }

  const handleClose = () => {
    if (dataDelivery.fromDatabase) {
      onClose()
      return
    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Los cambios no guardados se perderán',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeliveryInfo(initialDeliveryInfo)
        onClose()
      }
    })
  }

  const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Información de Entrega
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormTextField
                fullWidth
                label="Nombre del Repartidor"
                name="nombreRepartidor"
                value={deliveryInfo.nombreRepartidor}
                onChange={handleChange}
                margin="dense"
                placeholder='Ej: "Juan Pérez"'
                disabled={dataDelivery.fromDatabase}
              />
            </Grid>
            <Grid item xs={12}>
              <Accordion expanded={expanded} onChange={handleAccordionChange}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Detalles adicionales de entrega</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormTextField
                        fullWidth
                        label="Calle"
                        name="calle"
                        value={deliveryInfo.calle}
                        onChange={handleChange}
                        margin="dense"
                        InputProps={{
                          startAdornment: (
                            <IconButton edge="start">
                              <LocationOnIcon />
                            </IconButton>
                          ),
                        }}
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormTextField
                        fullWidth
                        label="Número"
                        name="número"
                        value={deliveryInfo.número}
                        onChange={handleChange}
                        margin="dense"
                        InputProps={{
                          startAdornment: (
                            <IconButton edge="start">
                              <ApartmentIcon />
                            </IconButton>
                          ),
                        }}
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormTextField
                        fullWidth
                        label="Piso/Apartamento"
                        name="apartamento"
                        value={deliveryInfo.apartamento}
                        onChange={handleChange}
                        margin="dense"
                        placeholder='Ej: "3A"'
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormTextField
                        fullWidth
                        label="Colonia/Barrio"
                        name="colonia"
                        value={deliveryInfo.colonia}
                        onChange={handleChange}
                        margin="dense"
                        InputProps={{
                          startAdornment: (
                            <IconButton edge="start">
                              <LocationCityIcon />
                            </IconButton>
                          ),
                        }}
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        fullWidth
                        label="Ciudad"
                        name="ciudad"
                        value={deliveryInfo.ciudad}
                        onChange={handleChange}
                        margin="dense"
                        InputProps={{
                          startAdornment: (
                            <IconButton edge="start">
                              <LocationCityIcon />
                            </IconButton>
                          ),
                        }}
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        fullWidth
                        label="Código Postal"
                        name="códigoPostal"
                        value={deliveryInfo.códigoPostal}
                        onChange={handleChange}
                        margin="dense"
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        fullWidth
                        label="Referencias Adicionales"
                        name="referenciasAdicionales"
                        value={deliveryInfo.referenciasAdicionales}
                        onChange={handleChange}
                        margin="dense"
                        multiline
                        rows={2}
                        placeholder='Ej: "Frente a la plaza principal"'
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormTextField
                        fullWidth
                        label="Fecha de Entrega"
                        name="fechaEntrega"
                        type="date"
                        value={deliveryInfo.fechaEntrega}
                        onChange={handleChange}
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <IconButton edge="start">
                              <DateRangeIcon />
                            </IconButton>
                          ),
                        }}
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormTextField
                        fullWidth
                        label="Hora Preferida"
                        name="horaPreferida"
                        type="time"
                        value={deliveryInfo.horaPreferida}
                        onChange={handleChange}
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <IconButton edge="start">
                              <AccessTimeIcon />
                            </IconButton>
                          ),
                        }}
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        fullWidth
                        label="Ventana de Tiempo Aceptable"
                        name="ventanaTiempo"
                        value={deliveryInfo.ventanaTiempo}
                        onChange={handleChange}
                        margin="dense"
                        placeholder="Ej: Entre 14:00 y 16:00"
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        fullWidth
                        label="Instrucciones Especiales"
                        name="instruccionesEspeciales"
                        value={deliveryInfo.instruccionesEspeciales}
                        onChange={handleChange}
                        margin="dense"
                        multiline
                        rows={2}
                        placeholder='Ej: "Llamar al timbre 3 veces"'
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        fullWidth
                        label="Preferencias de Contacto"
                        name="preferenciasContacto"
                        value={deliveryInfo.preferenciasContacto}
                        onChange={handleChange}
                        margin="dense"
                        InputProps={{
                          startAdornment: (
                            <IconButton edge="start">
                              <ContactPhoneIcon />
                            </IconButton>
                          ),
                        }}
                        disabled={dataDelivery.fromDatabase}
                      />
                    </Grid>
                    <Grid item container xs={12} spacing={2}>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deliveryInfo.solicitarUtensilios}
                              onChange={handleChange}
                              name="solicitarUtensilios"
                              disabled={dataDelivery.fromDatabase}
                            />
                          }
                          label="Solicitar utensilios/servilletas"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deliveryInfo.entregaSinContacto}
                              onChange={handleChange}
                              name="entregaSinContacto"
                              disabled={dataDelivery.fromDatabase}
                            />
                          }
                          label="Entrega sin contacto"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            disabled={dataDelivery.fromDatabase}
          >
            Confirmar Entrega
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeliveryDialog

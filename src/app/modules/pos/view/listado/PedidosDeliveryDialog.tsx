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
import Select from 'react-select'
import Swal from 'sweetalert2'

import { FormTextField } from '../../../../base/components/Form'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import KeyTipButton from '../../services/keyTips'

interface DeliveryInfo {
  calle: string
  número: string
  apartamento: string
  colonia: string
  ciudad: string
  referenciasAdicionales: string
  tituloDireccion?: string
  tipoPedido: { value: string; label: string } | null
  tipoPedidoPersonalizado: string
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
  fechaEntrega: Date | null
  terminos: string
}

// Función para parsear la dirección a partir del string cliente
const parseClienteDireccion = (cliente: string) => {
  const parts = cliente.split(',').map((item) => item.trim())
  const direccion = {
    calle: '',
    número: '',
    apartamento: '',
    colonia: '',
    ciudad: '',
    referenciasAdicionales: '',
    tituloDireccion: '',
  }

  parts.forEach((part) => {
    const [key, ...rest] = part.split(':')
    const value = rest.join(':').trim()
    const keyUpper = key.toUpperCase()

    if (keyUpper === 'CALLE') direccion.calle = value
    else if (keyUpper === 'NUMERO') direccion.número = value
    else if (['PISO', 'APARTAMENTO'].includes(keyUpper)) direccion.apartamento = value
    else if (['COLONIA', 'BARRIO'].includes(keyUpper)) direccion.colonia = value
    else if (keyUpper === 'CIUDAD') direccion.ciudad = value
    else if (keyUpper === 'REFERENCIA ADICIONAL') direccion.referenciasAdicionales = value
    else if (keyUpper === 'TITULO') direccion.tituloDireccion = value
  })

  return direccion
}

// Función para parsear los datos de entrega
const parseDataDelivery = (data: DataDelivery, cliente: string): DeliveryInfo => {
  // Obtener dirección del cliente
  const address = cliente
    ? parseClienteDireccion(cliente)
    : {
        calle: '',
        número: '',
        apartamento: '',
        colonia: '',
        ciudad: '',
        referenciasAdicionales: '',
        tituloDireccion: '',
      }

  // Parsear información adicional
  const [
    nombreRepartidor = '',
    entregaSinContacto = 'false',
    solicitarUtensilios = 'false',
  ] = (data.atributo1 || '').split('|')

  // Determinar tipo de pedido
  let tipoPedido = { value: 'PedidosYa', label: 'PedidosYa' }
  let tipoPedidoPersonalizado = ''

  if (data.atributo2) {
    if (['PedidosYa', 'Uber'].includes(data.atributo2)) {
      tipoPedido = { value: data.atributo2, label: data.atributo2 }
    } else {
      tipoPedido = { value: 'Otro', label: 'Otro' }
      tipoPedidoPersonalizado = data.atributo2
    }
  }

  // Obtener instrucciones y preferencias
  const [instruccionesEspeciales = '', preferenciasContacto = ''] = (
    data.terminos || ''
  ).split('|')

  return {
    ...address,
    tipoPedido,
    tipoPedidoPersonalizado,
    fechaEntrega: data.fechaEntrega
      ? new Date(data.fechaEntrega).toISOString().split('T')[0]
      : '',
    horaPreferida: data.atributo3 || '',
    ventanaTiempo: data.atributo4 || '',
    instruccionesEspeciales,
    preferenciasContacto,
    solicitarUtensilios: solicitarUtensilios === 'true',
    entregaSinContacto: entregaSinContacto === 'true',
    nombreRepartidor,
  }
}

const tipoPedidoOptions = [
  { value: 'PedidosYa', label: 'PedidosYa' },
  { value: 'Uber', label: 'Uber' },
  { value: 'Otro', label: 'Otro' },
]

const DeliveryDialog = ({
  open,
  onClose,
  form,
  dataDelivery,
  cliente,
}: {
  open: boolean
  onClose: () => void
  form: any
  dataDelivery: DataDelivery
  cliente: any
}) => {
  const { setValue } = form
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>(() =>
    parseDataDelivery(dataDelivery, cliente),
  )
  const [expanded, setExpanded] = useState(false)
  const [isDataModified, setIsDataModified] = useState(false)

  useEffect(() => {
    // Actualizar estado cuando cambian los props
    if (open) {
      const parsedData = parseDataDelivery(dataDelivery, cliente)
      setDeliveryInfo(parsedData)
      setIsDataModified(false)
    }
  }, [dataDelivery, cliente, open])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target
    const isCheckbox = name === 'solicitarUtensilios' || name === 'entregaSinContacto'

    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }))
    setIsDataModified(true)
  }

  const handleSelectChange = (selectedOption: any) => {
    setDeliveryInfo((prev) => ({
      ...prev,
      tipoPedido: selectedOption,
      tipoPedidoPersonalizado:
        selectedOption.value === 'Otro' ? prev.tipoPedidoPersonalizado : '',
    }))
    setIsDataModified(true)
  }

  const handleCustomOrderTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setDeliveryInfo((prev) => ({
      ...prev,
      tipoPedidoPersonalizado: value,
      tipoPedido: { value: 'Otro', label: 'Otro' },
    }))
    setIsDataModified(true)
  }

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
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

      const tipoPedidoFinal =
        deliveryInfo.tipoPedido?.value === 'Otro'
          ? deliveryInfo.tipoPedidoPersonalizado
          : deliveryInfo.tipoPedido?.value

      // Se guarda en atributo1 la información del repartidor y opciones de contacto
      setValue(
        'atributo1',
        `${deliveryInfo.nombreRepartidor}|${deliveryInfo.entregaSinContacto}|${deliveryInfo.solicitarUtensilios}`,
      )
      // La dirección de entrega ahora contiene: calle | número | apartamento | colonia | ciudad | referencias adicionales
      setValue(
        'direccionEntrega',
        `${deliveryInfo.calle}|${deliveryInfo.número}|${deliveryInfo.apartamento}|${deliveryInfo.colonia}|${deliveryInfo.ciudad}|${deliveryInfo.referenciasAdicionales}`,
      )
      // El tipo de pedido se almacena en atributo2
      setValue('atributo2', tipoPedidoFinal)
      setValue('atributo3', deliveryInfo.horaPreferida)
      setValue('atributo4', deliveryInfo.ventanaTiempo)
      setValue('fechaEntrega', deliveryInfo.fechaEntrega)
      setValue(
        'terminos',
        `${deliveryInfo.instruccionesEspeciales}|${deliveryInfo.preferenciasContacto}`,
      )
      onClose()
    }
  }

  const handleClose = () => {
    if (!isDataModified) {
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
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormTextField
                fullWidth
                label="Núm. Pedido / Nombre Repartidor"
                name="nombreRepartidor"
                value={deliveryInfo.nombreRepartidor}
                onChange={handleChange}
                margin="dense"
                placeholder='Ej: "1234" o "Juan"'
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                styles={reactSelectStyle(
                  Boolean(deliveryInfo.tipoPedido?.value === 'Otro'),
                )}
                options={tipoPedidoOptions}
                value={deliveryInfo.tipoPedido}
                onChange={handleSelectChange}
                placeholder="Seleccione el tipo de pedido"
              />
            </Grid>
            {deliveryInfo.tipoPedido?.value === 'Otro' && (
              <Grid item xs={12}>
                <FormTextField
                  fullWidth
                  label="Especificar Tipo de Pedido"
                  name="tipoPedidoPersonalizado"
                  value={deliveryInfo.tipoPedidoPersonalizado}
                  onChange={handleCustomOrderTypeChange}
                  margin="dense"
                  placeholder="Especifique el tipo de pedido"
                />
              </Grid>
            )}
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

          <KeyTipButton
            type="button"
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            keyTip="G"
            onClick={handleSubmit}
          >
            Guardar
          </KeyTipButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeliveryDialog

import { Close, Print } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { FunctionComponent, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { FormTextField } from '../../../../../base/components/Form'
import SimpleCard from '../../../../../base/components/Template/Cards/SimpleCard'
import { apiListadoProductos } from '../../../../ventas/api/licencias.api'

interface OwnProps {}

type Props = OwnProps

interface Printer {
  name: string
  ip?: string
}

interface PrinterSettings {
  comanda: string
  estadoDeCuenta: string
  facturar: string
  impresionAutomatica: {
    comanda: boolean
    estadoDeCuenta: boolean
    facturar: boolean
  }
  manualPrinters: Printer[]
}

const Impresoras: FunctionComponent<Props> = () => {
  const [printers, setPrinters] = useState<Printer[]>([])
  const [selectedComandaPrinter, setSelectedComandaPrinter] = useState<string>('')
  const [selectedEstadoDeCuentaPrinter, setSelectedEstadoDeCuentaPrinter] =
    useState<string>('')
  const [selectedFacturarPrinter, setSelectedFacturarPrinter] = useState<string>('')
  const [impresionAutomatica, setImpresionAutomatica] = useState({
    comanda: false,
    estadoDeCuenta: false,
    facturar: false,
  })
  const [newPrinterName, setNewPrinterName] = useState('')
  const [newPrinterIP, setNewPrinterIP] = useState('')
  const [manualPrinters, setManualPrinters] = useState<Printer[]>([])
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [errorIP, setErrorIP] = useState(false)
  const [showWarning, setShowWarning] = useState(true)

  const { data } = useQuery({
    queryKey: ['licenciaProductoListado'],
    queryFn: async () => {
      const data = await apiListadoProductos()
      return data || []
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const impresion = data?.find((item) => item.tipoProducto === 'IMPRESION')
  const state = impresion?.state
  const fechaVencimiento = impresion?.fechaVencimiento
  const fechaActual = new Date()

  // Verifica si el estado no es "activado" o si la fecha ya venció
  const mostrarAviso =
    showWarning &&
    (state !== 'ACTIVADO' ||
      (fechaVencimiento && new Date(fechaVencimiento) < fechaActual))

  const showComponent =
    state === 'ACTIVADO' && fechaVencimiento && new Date(fechaVencimiento) > fechaActual

  const scanPrinters = async () => {
    const serverUrl = 'http://localhost:7777/printers'
    const fallbackUrl = 'AdePrint:live'

    try {
      // Verificar si el servidor local está disponible
      const response = await fetch(serverUrl, { method: 'HEAD' })
      if (response.ok) {
        // Continuar con la lógica de obtención de impresoras
        const dataResponse = await fetch(serverUrl)
        const data = await dataResponse.json()
        const availablePrinters = data.printers.map((printerName: string) => ({
          name: printerName,
        }))

        // Combinar impresoras escaneadas con las manuales, eliminando duplicados
        const combinedPrinters = [...availablePrinters, ...manualPrinters]
        const uniquePrinters = Array.from(
          new Set(combinedPrinters.map((p) => p.name)),
        ).map((name) => combinedPrinters.find((p) => p.name === name)!)

        setPrinters(uniquePrinters)
      } else {
        throw new Error('Servidor local no disponible')
      }
    } catch (error) {
      console.error('Error al escanear impresoras:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error al escanear impresoras',
        text: 'No se pudo escanear las impresoras disponibles en la red, verifique que la Aplicación de Impresión esté en ejecución.',
      })

      // Intentar fallback con AdePrint:live
      try {
        window.location.href = fallbackUrl
      } catch (fallbackError) {
        console.error('Error al usar el fallback AdePrint:live:', fallbackError)

        // Mostrar mensaje de error si no es un dispositivo móvil
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
        if (!/android/i.test(userAgent) && !/iPad|iPhone|iPod/.test(userAgent)) {
          Swal.fire({
            icon: 'error',
            title: 'Error al escanear impresoras',
            text: 'No se pudo escanear las impresoras disponibles en la red, verifique que la Aplicación de Impresión esté en ejecución.',
          })
        }
      }
    }
  }

  useEffect(() => {
    const savedPrinters = localStorage.getItem('printers')
    if (savedPrinters) {
      try {
        const parsedPrinters: PrinterSettings = JSON.parse(savedPrinters)
        setSelectedComandaPrinter(parsedPrinters.comanda || '')
        setSelectedEstadoDeCuentaPrinter(parsedPrinters.estadoDeCuenta || '')
        setSelectedFacturarPrinter(parsedPrinters.facturar || '')
        setImpresionAutomatica(
          parsedPrinters.impresionAutomatica || {
            comanda: false,
            estadoDeCuenta: false,
            facturar: false,
          },
        )
        setManualPrinters(parsedPrinters.manualPrinters || [])
      } catch (error) {
        console.error('Error parsing printers from localStorage:', error)
      }
    }

    scanPrinters()

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    if (/android/i.test(userAgent)) {
      setIsMobile(true)
    }
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setIsMobile(true)
    }
  }, [])

  useEffect(() => {
    setPrinters((prevPrinters) => {
      const existingPrinters = prevPrinters.filter((p) => !p.ip)
      return [...existingPrinters, ...manualPrinters]
    })
  }, [manualPrinters])

  const getPrinterValue = (selectedPrinter: string) => {
    const printer = printers.find((p) => p.name === selectedPrinter)
    if (printer && printer.ip) {
      return printer.ip // Devuelve la IP para impresoras manuales
    }
    return selectedPrinter // Devuelve el nombre para impresoras automáticas
  }

  const getPrinterDisplayValue = (selectedPrinter: string) => {
    const printer = printers.find((p) => p.name === selectedPrinter)
    if (printer && printer.ip) {
      return `${printer.name} (${printer.ip})`
    }
    return selectedPrinter
  }

  const handleSave = () => {
    const printerSettings: PrinterSettings = {
      comanda: getPrinterValue(selectedComandaPrinter),
      estadoDeCuenta: getPrinterValue(selectedEstadoDeCuentaPrinter),
      facturar: getPrinterValue(selectedFacturarPrinter),
      impresionAutomatica,
      manualPrinters,
    }
    localStorage.setItem('printers', JSON.stringify(printerSettings))

    Swal.fire({
      icon: 'success',
      title: 'Configuraciones Guardadas',
      text: 'Las configuraciones de impresoras y de impresión automática se han guardado exitosamente.',
    })
  }

  const handleImpresionAutomaticaChange =
    (type: 'comanda' | 'estadoDeCuenta' | 'facturar') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setImpresionAutomatica((prev) => ({
        ...prev,
        [type]: event.target.checked,
      }))
    }

  const handleAddPrinter = () => {
    if (newPrinterName && newPrinterIP) {
      const newPrinter: Printer = {
        name: newPrinterName,
        ip: newPrinterIP,
      }
      setManualPrinters([...manualPrinters, newPrinter])
      setNewPrinterName('')
      setNewPrinterIP('')
    }
  }

  const validateIP = (value: any) => {
    const ipPortPattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$/
    return ipPortPattern.test(value)
  }

  const handleChange = (e: any) => {
    const value = e.target.value
    setNewPrinterIP(value)
    setErrorIP(!validateIP(value) && value !== '')
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Overlay con efecto blur */}
      {mostrarAviso && (
        <Dialog
          open={mostrarAviso}
          BackdropProps={{
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)', // Para compatibilidad con Safari
            },
          }}
          PaperProps={{
            style: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '450px',
              width: '90%',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            },
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* Botón de cierre */}
          <IconButton
            onClick={() => setShowWarning(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'rgba(0,0,0,0.6)',
            }}
          >
            <Close />
          </IconButton>

          <Typography
            id="alert-dialog-title"
            variant="h5"
            style={{
              color: 'red',
              fontWeight: 'bold',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <span>⚠️</span> Atención
          </Typography>
          <Typography
            id="alert-dialog-description"
            variant="body1"
            style={{
              color: 'black',
              marginBottom: '20px',
              lineHeight: '1.6',
            }}
          >
            El estado del producto no está activado o ha vencido. Por favor,Contacte con
            soporte para resolver este inconveniente.
          </Typography>
          <Button
            onClick={() => setShowWarning(false)}
            variant="contained"
            color="primary"
            style={{
              marginTop: '10px',
              backgroundColor: 'red',
            }}
          >
            Entendido
          </Button>
        </Dialog>
      )}

      {/* Contenido principal */}
      {showComponent && (
        <div
          style={{
            opacity: mostrarAviso ? 0.3 : 1,
            pointerEvents: mostrarAviso ? 'none' : 'auto',
            transition: 'opacity 0.3s ease',
          }}
        >
          <SimpleCard title={'IMPRESORAS'} childIcon={<Print />}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button onClick={scanPrinters} variant="contained">
                  Escanear Impresoras
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="comanda-label">Impresora para Comanda</InputLabel>
                  <Select
                    labelId="comanda-label"
                    value={selectedComandaPrinter}
                    onChange={(e) => setSelectedComandaPrinter(e.target.value as string)}
                    fullWidth
                    label="Impresora para Comanda"
                    renderValue={(value) =>
                      getPrinterDisplayValue(value as string) ||
                      'Seleccione una impresora'
                    }
                  >
                    <MenuItem value="">
                      {printers.length > 0
                        ? 'Seleccione impresora para Comanda'
                        : 'No hay impresoras disponibles'}
                    </MenuItem>
                    {printers.map((printer) => (
                      <MenuItem key={printer.name} value={printer.name}>
                        {printer.ip ? `${printer.name} (${printer.ip})` : printer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="estado-cuenta-label">
                    Impresora para Estado de Cuenta
                  </InputLabel>
                  <Select
                    labelId="estado-cuenta-label"
                    value={selectedEstadoDeCuentaPrinter}
                    onChange={(e) =>
                      setSelectedEstadoDeCuentaPrinter(e.target.value as string)
                    }
                    fullWidth
                    label="Impresora para Estado de Cuenta"
                    renderValue={(value) =>
                      getPrinterDisplayValue(value as string) ||
                      'Seleccione una impresora'
                    }
                  >
                    <MenuItem value="">
                      {printers.length > 0
                        ? 'Seleccione impresora para Estado de Cuenta'
                        : 'No hay impresoras disponibles'}
                    </MenuItem>
                    {printers.map((printer) => (
                      <MenuItem key={printer.name} value={printer.name}>
                        {printer.ip ? `${printer.name} (${printer.ip})` : printer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="facturar-label">Impresora para Facturar</InputLabel>
                  <Select
                    labelId="facturar-label"
                    value={selectedFacturarPrinter}
                    onChange={(e) => setSelectedFacturarPrinter(e.target.value as string)}
                    fullWidth
                    label="Impresora para Facturar"
                    renderValue={(value) =>
                      getPrinterDisplayValue(value as string) ||
                      'Seleccione una impresora'
                    }
                  >
                    <MenuItem value="">
                      {printers.length > 0
                        ? 'Seleccione impresora para Facturar'
                        : 'No hay impresoras disponibles'}
                    </MenuItem>
                    {printers.map((printer) => (
                      <MenuItem key={printer.name} value={printer.name}>
                        {printer.ip ? `${printer.name} (${printer.ip})` : printer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {isMobile && (
                <>
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontSize: '1.25rem',
                      }}
                    >
                      Agregar Impresora Manual
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      fullWidth
                      label="Nombre/Modelo de Impresora"
                      value={newPrinterName}
                      onChange={(e) => setNewPrinterName(e.target.value)}
                      placeholder='Ejemplo: "Impresora de Cocina - Epson TM-T20II"'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      fullWidth
                      label="Dirección IP"
                      value={newPrinterIP}
                      onChange={handleChange}
                      placeholder="Ejemplo: 192.168.1.100"
                      error={errorIP}
                      helperText={errorIP ? 'Dirección IP o IP con puerto inválida' : ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button onClick={handleAddPrinter} variant="contained">
                      Agregar Impresora
                    </Button>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={impresionAutomatica.comanda}
                      onChange={handleImpresionAutomaticaChange('comanda')}
                    />
                  }
                  label="Impresión Automática de Comanda"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={impresionAutomatica.estadoDeCuenta}
                      onChange={handleImpresionAutomaticaChange('estadoDeCuenta')}
                    />
                  }
                  label="Impresión Automática de Estado de Cuenta"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={impresionAutomatica.facturar}
                      onChange={handleImpresionAutomaticaChange('facturar')}
                    />
                  }
                  label="Impresión Automática de Factura"
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleSave} variant="contained">
                  Guardar Configuración
                </Button>
              </Grid>
            </Grid>
          </SimpleCard>
        </div>
      )}
    </div>
  )
}

export default Impresoras

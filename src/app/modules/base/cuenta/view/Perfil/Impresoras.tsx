import { Print } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { FunctionComponent, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import SimpleCard from '../../../../../base/components/Template/Cards/SimpleCard'

interface OwnProps {}

type Props = OwnProps

interface Printer {
  name: string
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

  const scanPrinters = async () => {
    try {
      const response = await fetch('http://localhost:7777/printers')
      const data = await response.json()
      const availablePrinters = data.printers.map((printerName: string) => ({
        name: printerName,
      }))
      setPrinters(availablePrinters)
    } catch (error) {
      console.error('Error al escanear impresoras:', error)
    }
  }

  useEffect(() => {
    // Cargar impresoras y configuraciones guardadas en localStorage al iniciar
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
      } catch (error) {
        console.error('Error parsing printers from localStorage:', error)
      }
    }

    scanPrinters()
  }, [])

  const handleSave = () => {
    const printerSettings: PrinterSettings = {
      comanda: selectedComandaPrinter,
      estadoDeCuenta: selectedEstadoDeCuentaPrinter,
      facturar: selectedFacturarPrinter,
      impresionAutomatica,
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

  return (
    <>
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
              >
                <MenuItem value="">
                  {printers.length > 0
                    ? 'Seleccione impresora para Comanda'
                    : 'No hay impresoras disponibles'}
                </MenuItem>
                {printers.map((printer) => (
                  <MenuItem key={printer.name} value={printer.name}>
                    {printer.name}
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
              >
                <MenuItem value="">
                  {printers.length > 0
                    ? 'Seleccione impresora para Estado de Cuenta'
                    : 'No hay impresoras disponibles'}
                </MenuItem>
                {printers.map((printer) => (
                  <MenuItem key={printer.name} value={printer.name}>
                    {printer.name}
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
              >
                <MenuItem value="">
                  {printers.length > 0
                    ? 'Seleccione impresora para Facturar'
                    : 'No hay impresoras disponibles'}
                </MenuItem>
                {printers.map((printer) => (
                  <MenuItem key={printer.name} value={printer.name}>
                    {printer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
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
              Guardar
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
    </>
  )
}

export default Impresoras

/* eslint-disable no-unused-vars */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Grid,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'

interface ColoredSVGProps {
  name: string
  nit: string
  email: string
  form: UseFormReturn<any> // Tipar el useForm [info] media
}

const ColoredSVG = ({ name, nit, email, form }: ColoredSVGProps) => {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = form

  const theme = useTheme()
  const color = theme.palette.primary.main

  const [isCheckedExecpcion, setIsCheckedExecpcion] = useState(false)
  useEffect(() => {
    setValue('codigoExcepcion', 0)
  }, [])

  return (
    <>
      <Accordion
        style={{
          borderRadius: '10px',
          backgroundColor: '#EEF5FB',
          // borde negro
          border: '1px solid black',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          style={{
            borderRadius: '10px',
            borderColor: theme.palette.primary.main,
          }}
        >
          <svg
            width="50px"
            viewBox="0 0 460 460"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="230" cy="230" r="230" fill="#ECEDF4" />
            <circle cx="230" cy="230" r="181" fill={color} />
            <path
              d="M299.802 306.219C248.665 342.15 217.322 341.69 160.544 306.261C158.973 305.28 158 303.539 158 301.687C158 297.455 162.672 294.87 166.325 297.006C216.756 326.493 247.33 327.992 293.717 297.636C297.232 295.336 302 297.794 302 301.995C302 303.668 301.171 305.257 299.802 306.219Z"
              stroke="white"
              strokeWidth="24"
            />
          </svg>

          <Grid item padding={2} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">{name}</Typography>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">
                <span style={{ fontWeight: 'bold' }}>NIT/CI/CEX:</span> {nit}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <span style={{ fontWeight: 'bold' }}>Email:</span> {email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name={'emailCliente'}
                render={({ field }) => (
                  <TextField
                    {...field}
                    style={{
                      backgroundColor: 'white',
                    }}
                    error={Boolean(errors.emailCliente)}
                    fullWidth
                    name={'emailCliente'}
                    size={'small'}
                    label="Correo Electrónico Alternativo"
                    value={field.value || ''}
                    disabled={!getValues('cliente')}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    helperText={errors.emailCliente?.message?.toString() || ''}
                  />
                )}
              />
            </Grid>
            {/* // HAcemos un Checkbox donde dira Permitir Facturación aunque el Nit esté inválido */}
            <Grid item lg={12} xs={12} md={12}>
              <Checkbox
                checked={isCheckedExecpcion}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                style={{ marginRight: '0px' }}
                onClick={() => {
                  setIsCheckedExecpcion((prev) => !prev) // Cambia el estado al valor opuesto
                  setValue('codigoExcepcion', isCheckedExecpcion ? 0 : 1) // Envía 1 si está marcado, 0 si está desmarcado
                }}
              />
              <span
                style={{
                  marginLeft: '8px',
                  marginRight: '8px',
                }}
              >
                Facturación con NIT inválido
              </span>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* Mensaje si el checkbox esta activado */}
      {isCheckedExecpcion && (
        <Typography variant="body2" style={{ color: 'red', marginTop: '8px' }}>
          <strong>Nota:</strong> Se permitirá la facturación aunque el NIT esté inválido
        </Typography>
      )}
    </>
  )
}

export default ColoredSVG

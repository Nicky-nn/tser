import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

import {
  apiActualizarEspacio,
  apiEliminarEspacio,
  apiRegistroEspacio,
} from '../../api/restauranteEspacios.api'

interface EspacioDialogProps {
  open: boolean
  onClose: () => void
  entidad: {
    codigoSucursal: number
    codigoPuntoVenta: number
  }
  onSuccess: () => void
  onEspacioCreado: () => void
  espacio?: {
    _id: string
    descripcion: string
    nroMesas: number
  } | null
}

const NuevoEspacioDialog: React.FC<EspacioDialogProps> = ({
  open,
  onClose,
  entidad,
  onSuccess,
  onEspacioCreado,
  espacio = null,
}) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      descripcion: '',
      nroMesas: 50,
    },
  })

  useEffect(() => {
    if (open) {
      reset(espacio || { descripcion: '', nroMesas: 50 })
    }
  }, [open, espacio, reset])

  const onSubmit = async (data: { descripcion: string; nroMesas: number }) => {
    try {
      const parsedData = {
        descripcion: data.descripcion,
        nroMesas: Number(data.nroMesas),
      }

      if (espacio) {
        await apiActualizarEspacio(espacio._id, parsedData).then((res) => {
          const ubicacionDefault = localStorage.getItem('ubicacion')
          if (ubicacionDefault) {
            const ubicacion = JSON.parse(ubicacionDefault)
            if (ubicacion._id === espacio._id) {
              localStorage.setItem('ubicacion', JSON.stringify(res.restEspacioActualizar))
            }
          }
        })
      } else {
        await apiRegistroEspacio(entidad, parsedData)
        onEspacioCreado()
      }

      Swal.fire({
        icon: 'success',
        title: espacio ? 'Espacio actualizado' : 'Espacio creado',
        showConfirmButton: false,
        timer: 1500,
      })

      onSuccess()
      onClose()
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  const handleDelete = async () => {
    if (!espacio) return

    const confirmResult = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Eliminarás la ubicación y se recargará la página.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    })

    if (!confirmResult.isConfirmed) return

    try {
      await apiEliminarEspacio(espacio._id)

      const ubicacionDefault = localStorage.getItem('ubicacion')
      if (ubicacionDefault) {
        const ubicacion = JSON.parse(ubicacionDefault)
        if (ubicacion._id === espacio._id) {
          localStorage.removeItem('ubicacion')
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Espacio eliminado',
        showConfirmButton: false,
        timer: 1500,
      })

      window.location.reload()
      onSuccess()
      onClose()
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{espacio ? 'Editar Espacio' : 'Crear Nuevo Espacio'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="descripcion"
            control={control}
            rules={{
              required: 'La descripción es obligatoria',
              maxLength: { value: 50, message: 'Máximo 50 caracteres' },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Descripción"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="nroMesas"
            control={control}
            rules={{
              required: 'El número de mesas es obligatorio',
              min: { value: 5, message: 'Mínimo 5 mesas' },
              max: { value: 600, message: 'Máximo 600 mesas' },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Número de Mesas"
                type="number"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {espacio && (
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        )}
        <Button onClick={handleSubmit(onSubmit)}>
          {espacio ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NuevoEspacioDialog

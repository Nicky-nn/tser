/* eslint-disable no-unused-vars */
import { AddCircle, AddShoppingCart, Close } from '@mui/icons-material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import { ReactNode, useEffect, useState } from 'react'

import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import NumberSpinnerInput from '../../../../base/components/NumberSpinnerInput/NumberSpinnerInput'
import { SimpleBox } from '../../../../base/components/Template/Cards/SimpleBox'

interface Complemento {
  codigoArticulo: any
  id: number
  nombre: string
  imagen: string
  descripcion?: string
}

interface Product {
  sigla: ReactNode
  imagen: any
  name: string
  price: number
  quantity: number
  description?: string
  extraDetalle?: string
  discount: number
  extraDescription: string
  codigoAlmacen: string
  codigoArticuloUnidadMedida: string
  codigoArticulo: string
  fromDatabase?: boolean
  nroItem?: number
  complemento?: boolean
  listaComplemento?: Complemento[]
}

interface ComplementosSelectorProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onAddToCart: (product: Product, complementos: Complemento[]) => void
}

const ComplementCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  height: '100%',
  border: selected ? `3px solid ${theme.palette.primary.main}` : '1px solid #ddd',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[8],
  },
}))

const SelectionBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '50%',
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const GroupContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}))

const staticComplementos: Complemento[] = [
  {
    id: 0,
    codigoArticulo: 'SIN',
    nombre: 'Sin Complemento',
    imagen: '/images/sin-complemento.jpg',
    descripcion: 'Sin complemento',
  },
  {
    id: 1,
    codigoArticulo: 'COMP1',
    nombre: 'Papas Fritas',
    imagen: '/images/papas.jpg',
    descripcion: 'Porción de papas fritas',
  },
  {
    id: 2,
    codigoArticulo: 'COMP2',
    nombre: 'Ensalada',
    imagen: '/images/ensalada.jpg',
    descripcion: 'Ensalada fresca',
  },
]

const ComplementosSelector = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: ComplementosSelectorProps) => {
  if (!product) return null

  const theme = useTheme()
  const [quantity, setQuantity] = useState(1)
  const [groups, setGroups] = useState<{
    [key: string]: {
      complementos: Complemento[]
      units: number[]
    }
  }>({
    default: {
      complementos: [],
      units: [0],
    },
  })

  useEffect(() => {
    setGroups({
      default: {
        complementos: [],
        units: Array.from({ length: quantity }, (_, i) => i),
      },
    })
  }, [quantity])

  const handleComplementToggle = (groupKey: string, complemento: Complemento) => {
    setGroups((prev) => {
      const group = prev[groupKey]
      const exists = group.complementos.some((c) => c.id === complemento.id)

      return {
        ...prev,
        [groupKey]: {
          ...group,
          complementos: exists
            ? group.complementos.filter((c) => c.id !== complemento.id)
            : [...group.complementos, complemento],
        },
      }
    })
  }

  const createNewGroup = () => {
    const newGroupKey = `group_${Object.keys(groups).length}`
    setGroups((prev) => ({
      ...prev,
      [newGroupKey]: {
        complementos: [],
        units: [],
      },
    }))
  }

  const moveUnitToGroup = (unitIndex: number, fromGroup: string, toGroup: string) => {
    setGroups((prev) => {
      const newGroups = { ...prev }
      newGroups[fromGroup].units = newGroups[fromGroup].units.filter(
        (u) => u !== unitIndex,
      )
      newGroups[toGroup].units.push(unitIndex)
      return newGroups
    })
  }

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { minHeight: '80vh' },
      }}
    >
      <DialogTitle>
        {product.description}
        <IconButton
          aria-label="close"
          title={'Cerrar o presione la tecla ESC'}
          onClick={() => onClose()}
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
      <DialogContent dividers>
        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={4} lg={5}>
            <Divider textAlign={'left'} sx={{ color: 'primary.main', mb: 0.7 }}>
              <strong>Producto</strong>
            </Divider>
            <SimpleBox>
              <CardHeader
                sx={{ p: 0 }}
                avatar={
                  <Avatar
                    sx={{ bgcolor: blue[500], width: 60, height: 60 }}
                    alt="Producto"
                    src={product.imagen?.variants.thumbnail}
                    aria-label="recipe"
                  >
                    P
                  </Avatar>
                }
                title={
                  <Typography
                    variant={'body1'}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                      mb: 0.6,
                    }}
                  >
                    {product.codigoArticulo} - {product.description}
                  </Typography>
                }
                subheader={
                  <Typography variant={'subtitle2'} color={'primary'}>
                    Precio: {numberWithCommas(product.price, {})} {product.sigla}
                  </Typography>
                }
              />
              <CardContent sx={{ p: 0, mt: 1.6, pb: '0px !important' }}>
                <NumberSpinnerInput
                  min={1}
                  max={10}
                  label={'Cantidad'}
                  value={quantity}
                  step={1}
                  decimalScale={2}
                  fullWidth
                  size={'small'}
                  slotProps={{
                    input: {
                      sx: { fontSize: '1.5rem', fontWeight: 400 },
                    },
                  }}
                  onChange={(value) => {
                    setQuantity(value)
                  }}
                />
              </CardContent>
            </SimpleBox>
          </Grid>
          <Grid item xs={12} md={5} lg={7}>
            <Divider textAlign={'left'} sx={{ color: 'primary.main', mt: -0.7 }}>
              <strong>Complementos</strong>
            </Divider>
            {/* <ListaComplemento lista={lista} complemento={complementos} /> */}
            <Stack spacing={2}>
              {Object.entries(groups).map(([groupKey, group]) => (
                <GroupContainer key={groupKey}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6">
                      Grupo {parseInt(groupKey.split('_')[1] || '1')} (
                      {group.units.length} unidad{group.units.length !== 1 ? 'es' : ''})
                    </Typography>
                    {Object.keys(groups).length < quantity && (
                      <IconButton color="primary" onClick={() => createNewGroup()}>
                        <ContentCopyIcon />
                      </IconButton>
                    )}
                  </Stack>

                  <Grid container spacing={2}>
                    {staticComplementos.map((complemento) => {
                      const isSelected = group.complementos.some(
                        (c) => c.id === complemento.id,
                      )
                      return (
                        <Grid item key={complemento.id}>
                          <ComplementCard
                            selected={isSelected}
                            onClick={() => handleComplementToggle(groupKey, complemento)}
                          >
                            <SimpleBox sx={{ p: 0, m: 0 }}>
                              <CardHeader
                                sx={{ p: 1 }}
                                avatar={
                                  <Avatar
                                    sx={{ bgcolor: blue[500], width: 45, height: 45 }}
                                    alt="C"
                                    src={complemento.imagen}
                                    aria-label="recipe"
                                  >
                                    P
                                  </Avatar>
                                }
                                title={
                                  <Tooltip
                                    title={complemento.nombre}
                                    placement="top"
                                    disableInteractive
                                  >
                                    <Typography
                                      variant={'subtitle1'}
                                      fontSize={'small'}
                                      sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '1',
                                        WebkitBoxOrient: 'vertical',
                                        mb: -0.5,
                                      }}
                                    >
                                      {complemento.codigoArticulo} - {complemento.nombre}
                                    </Typography>
                                  </Tooltip>
                                }
                                subheader={
                                  <Typography
                                    variant={'subtitle1'}
                                    fontSize={'small'}
                                    color={'text.secondary'}
                                    sx={{ textDecoration: 'line-through' }}
                                  >
                                    {numberWithCommas(100, {})}{' '}
                                    {complemento.codigoArticulo}
                                  </Typography>
                                }
                              />
                            </SimpleBox>
                            {isSelected && (
                              <SelectionBadge>
                                <DoneIcon fontSize="small" />
                              </SelectionBadge>
                            )}
                          </ComplementCard>
                        </Grid>
                      )
                    })}
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Unidades en este grupo:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {group.units.map((unitIndex) => (
                        <Button
                          key={unitIndex}
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const availableGroups = Object.keys(groups).filter(
                              (k) => k !== groupKey,
                            )
                            if (availableGroups.length > 0) {
                              moveUnitToGroup(unitIndex, groupKey, availableGroups[0])
                            }
                          }}
                        >
                          Unidad {unitIndex + 1}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                </GroupContainer>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogContent>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              Object.values(groups).forEach((group) => {
                group.units.forEach((unitIndex) => {
                  onAddToCart(product, group.complementos)
                })
              })
              onClose()
            }}
          >
            Confirmar
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          color={'primary'}
          variant={'contained'}
          sx={{ mr: 2 }}
          startIcon={<AddShoppingCart />}
          onClick={() => {
            console.log('entrando')
          }}
        >
          Agregar al carrito
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ComplementosSelector

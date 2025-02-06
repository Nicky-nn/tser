import { AddShoppingCart, Close, Delete } from '@mui/icons-material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { ReactNode, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import NumberSpinnerInput from '../../../../base/components/NumberSpinnerInput/NumberSpinnerInput'
import { SimpleBox } from '../../../../base/components/Template/Cards/SimpleBox'
import useAuth from '../../../../base/hooks/useAuth'
import { articuloInventarioComplementoListadoApi } from '../../api/complementoId.api'

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
  // eslint-disable-next-line no-unused-vars
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

const ComplementosSelector = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: ComplementosSelectorProps) => {
  if (!product) return null

  const {
    user: { sucursal, puntoVenta },
  } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [groups, setGroups] = useState<{
    [key: string]: {
      complementos: Complemento[]
      units: number[]
      nombre: string
    }
  }>({
    default: {
      complementos: [],
      units: [0],
      nombre: 'Grupo 1',
    },
  })

  const { data: complementos, isLoading: isLoadingComplementos } = useQuery<any>({
    queryKey: ['complementos', product?.codigoArticulo],
    queryFn: async () => {
      const entidad = {
        codigoSucursal: sucursal.codigo,
        codigoPuntoVenta: puntoVenta.codigo,
      }

      const codigosQuery =
        product?.listaComplemento?.map((c) => `${c.codigoArticulo}`).join('&') || ''
      const resp = await articuloInventarioComplementoListadoApi(entidad, codigosQuery)
      return resp || []
    },
    refetchOnWindowFocus: false,
  })

  console.log('complementos', complementos)

  useEffect(() => {
    setGroups({
      default: {
        complementos: [],
        units: Array.from({ length: quantity }, (_, i) => i),
        nombre: 'Grupo 1',
      },
    })
  }, [quantity])

  const deleteGroup = (groupKey: string) => {
    if (groupKey === 'default') {
      toast.error('No se puede eliminar el grupo principal')
      return
    }

    setGroups((prev) => {
      const { [groupKey]: deletedGroup, ...remainingGroups } = prev

      // Mover unidades al grupo default
      remainingGroups.default.units = [
        ...remainingGroups.default.units,
        ...deletedGroup.units,
      ]

      return remainingGroups
    })
  }

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
    const newGroupKey = `group_${Object.keys(groups).length + 1}`
    setGroups((prev) => ({
      ...prev,
      [newGroupKey]: {
        complementos: [],
        units: [],
        nombre: `Grupo ${Object.keys(groups).length + 1}`,
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
      {isLoadingComplementos && <DialogContent>Loading...</DialogContent>}
      <DialogContent dividers>
        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={4} lg={5}>
            <Divider textAlign={'left'} sx={{ color: 'primary.main', mt: -0.7 }}>
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
                    {groupKey !== 'default' && (
                      <IconButton color="error" onClick={() => deleteGroup(groupKey)}>
                        <Delete />
                      </IconButton>
                    )}
                  </Stack>

                  <Grid container spacing={2}>
                    {Array.isArray(complementos)
                      ? complementos.map((complemento: any) => {
                          const isSelected = group.complementos.some(
                            (c) => c.id === complemento.id,
                          )
                          return (
                            <Grid item key={complemento._id}>
                              <ComplementCard
                                selected={isSelected}
                                onClick={() =>
                                  handleComplementToggle(groupKey, complemento)
                                }
                              >
                                <SimpleBox sx={{ p: 0, m: 0 }}>
                                  <CardHeader
                                    sx={{ p: 1 }}
                                    avatar={
                                      <Avatar
                                        sx={{ bgcolor: blue[500], width: 45, height: 45 }}
                                        alt="C"
                                        src={complemento.imagen.variants.thumbnail}
                                        aria-label="recipe"
                                      >
                                        P
                                      </Avatar>
                                    }
                                    title={
                                      <Tooltip
                                        title={complemento.nombrArticulo}
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
                                          {complemento.codigoArticulo} -{' '}
                                          {complemento.nombreArticulo}
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
                                        {numberWithCommas(
                                          complemento.articuloPrecioBase.monedaPrimaria
                                            .precio,
                                          {},
                                        )}{' '}
                                        {
                                          complemento.articuloPrecioBase.monedaPrimaria
                                            .moneda.sigla
                                        }
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
                        })
                      : null}
                  </Grid>

                  <Box sx={{ p: 1 }}>
                    <Typography variant="caption" sx={{ mb: 1 }}>
                      Unidades en este grupo:
                    </Typography>
                    <Grid container spacing={1}>
                      {group.units.map((unitIndex) => (
                        <Grid item key={unitIndex} xs="auto">
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={groupKey}
                              size="small"
                              onChange={(e) => {
                                moveUnitToGroup(unitIndex, groupKey, e.target.value)
                              }}
                            >
                              {Object.entries(groups).map(([key, g]) => (
                                <MenuItem key={key} value={key}>
                                  {g.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText sx={{ mt: 0 }}>
                              <Typography variant="caption">
                                Unidad {unitIndex + 1}
                              </Typography>
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </GroupContainer>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          color={'primary'}
          variant={'contained'}
          sx={{ mr: 2 }}
          startIcon={<AddShoppingCart />}
          onClick={() => {
            Object.values(groups).forEach((group) => {
              group.units.forEach(() => {
                onAddToCart(product, group.complementos)
              })
            })
            onClose()
          }}
        >
          Agregar al carrito
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ComplementosSelector

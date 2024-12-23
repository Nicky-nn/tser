/* eslint-disable no-unused-vars */
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'

import useAuth from '../../../../base/hooks/useAuth'
import { articuloInventarioComplementoListadoApi } from '../../api/complementoId.api'
import truncateName from '../../utils/Pedidos/truncateName'

// types/index.ts
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
  extraDetalle?: string
  name: string
  price: number
  description?: string
  quantity: number
  discount: number
  extraDescription: string
  codigoAlmacen: string
  codigoArticuloUnidadMedida: string
  codigoArticulo: string
  fromDatabase?: boolean
  nroItem?: number
  complemento?: boolean
  complementos?: Complemento[]
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '800px',
    width: '100%',
  },
}))

interface ComplementosSelectorProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  complementos: any[]
  onAddToCart: (product: Product, complemento: Complemento) => void
}

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}))

const ComplementosSelector = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: ComplementosSelectorProps) => {
  const {
    user: { sucursal, puntoVenta },
  } = useAuth()

  const theme = useTheme()

  const { data: complementos, isLoading: isLoadingComplementos } = useQuery<any>({
    queryKey: ['complementos', product?.codigoArticulo],
    queryFn: async () => {
      const entidad = {
        codigoSucursal: sucursal.codigo,
        codigoPuntoVenta: puntoVenta.codigo,
      }

      const codigosQuery =
        product?.complementos
          ?.map((c) => `codigoArticulo=${c.codigoArticulo}`)
          .join('&') || ''
      const resp = await articuloInventarioComplementoListadoApi(entidad, codigosQuery)
      return resp || []
    },
    refetchOnWindowFocus: false,
  })

  if (!product) return null

  const LoadingSkeleton = () => (
    <Grid container spacing={2}>
      {[1, 2, 3].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card>
            <Skeleton variant="rectangular" height={120} />
            <CardContent>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={20} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  return (
    <StyledDialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography variant="h5">Seleccione un complemento</Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <ProductCard elevation={3}>
                {product.imagen ? (
                  <CardMedia
                    component="img"
                    height="100"
                    image={product.imagen.variants.medium}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    }}
                  >
                    <Typography variant="h5" align="center" sx={{ p: 2 }}>
                      {product.name}
                    </Typography>
                  </Box>
                )}
              </ProductCard>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                {truncateName(product.name, 40)}
              </Typography>
              {product.description && (
                <Typography variant="body1" color="text.secondary">
                  {truncateName(product.description, 70)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 3 }}>
          Complementos disponibles
        </Typography>

        {isLoadingComplementos ? (
          <LoadingSkeleton />
        ) : complementos?.length > 0 ? (
          <Grid container spacing={3}>
            {complementos.map((complemento: any) => (
              <Grid item xs={12} sm={6} md={4} key={complemento.id}>
                <ProductCard>
                  <CardActionArea
                    onClick={() => onAddToCart(product, complemento)}
                    sx={{ height: '100%' }}
                  >
                    {complemento.imagen && complemento.imagen.variants ? (
                      <CardMedia
                        component="img"
                        height="100"
                        image={complemento.imagen.variants.medium}
                        alt={complemento.name}
                        sx={{
                          objectFit: 'cover',
                          display: 'block',
                          margin: '0 auto',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.common.white,
                        }}
                      ></Box>
                    )}
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '8px !important', // Padding reducido
                        minHeight: '80px', // Altura mínima para el contenido
                      }}
                    >
                      <Tooltip title={complemento.descripcionArticulo} placement="top">
                        <Typography
                          variant="body2"
                          gutterBottom
                          sx={{
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.2em',
                            marginBottom: '4px',
                            height: '2.4em',
                          }}
                        >
                          {complemento.descripcionArticulo}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2">0.00 {product.sigla}</Typography>
                    </CardContent>
                  </CardActionArea>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No hay complementos disponibles
          </Typography>
        )}
      </DialogContent>
    </StyledDialog>
  )
}

export default ComplementosSelector

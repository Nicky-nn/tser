/* eslint-disable no-unused-vars */
import { Card, CardContent, Skeleton, Tooltip, Typography, useTheme } from '@mui/material'
import React from 'react'

interface Option {
  value: string
  tipoPedido: string
  nroOrden?: string
  horaPedido?: string
  cliente?: { razonSocial: string }
  state: 'Libre' | 'Ocupado'
}

interface MosaicoProps {
  isLoading: boolean
  options: any[]
  occupiedCount: number
  focusedIndex: number
  setFocusedIndex: (index: number) => void
  setSelectedOption: (option: any) => void
}

const Mosaico: React.FC<MosaicoProps> = ({
  isLoading,
  options,
  occupiedCount,
  focusedIndex,
  setFocusedIndex,
  setSelectedOption,
}) => {
  const theme = useTheme()

  function getColorSuffix(hexColor: any, adjustment: { r: any; g: any; b: any }) {
    // const adjustment = { r: 186 - 0, g: 225 - 87, b: 187 - 82 }
    // Convertir el color hexadecimal a valores RGB
    let r = parseInt(hexColor.slice(1, 3), 16)
    let g = parseInt(hexColor.slice(3, 5), 16)
    let b = parseInt(hexColor.slice(5, 7), 16)

    // Ajustar el brillo y la saturación del color
    r = Math.min(255, Math.max(0, r + adjustment.r))
    g = Math.min(255, Math.max(0, g + adjustment.g))
    b = Math.min(255, Math.max(0, b + adjustment.b))

    // Convertir los componentes a hexadecimal y concatenar
    return `#${r.toString(16).padStart(2, '0').toUpperCase()}${g.toString(16).padStart(2, '0').toUpperCase()}${b.toString(16).padStart(2, '0').toUpperCase()}`
  }

  const truncateName = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...'
    }
    return name
  }
  function toCamelCase(str: string) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div style={{ overflowX: 'auto', padding: '1px' }}>
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          gap: '8px',
          padding: '0px 0',
          alignItems: 'stretch',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {isLoading
          ? Array.from(new Array(15)).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={110}
                height={90}
                sx={{
                  flexShrink: 0,
                  borderRadius: '4px',
                  backgroundColor: theme.palette.action.hover,
                }}
              />
            ))
          : options.map((option, index) => (
              <Card
                key={index}
                sx={{
                  width: 110,
                  minWidth: 110,
                  height: 90,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundColor:
                    focusedIndex === index
                      ? getColorSuffix(theme.palette.primary.main, {
                          r: 255 - 0,
                          g: 193 - 87,
                          b: 7 - 82,
                        })
                      : option.state === 'Libre'
                        ? getColorSuffix(theme.palette.primary.main, {
                            r: 186 - 0,
                            g: 225 - 87,
                            b: 187 - 82,
                          })
                        : '#EF9999',
                  '&:hover': {
                    backgroundColor:
                      option.state === 'Libre'
                        ? getColorSuffix(theme.palette.primary.main, {
                            r: 140 - 5,
                            g: 207 - 87,
                            b: 155 - 82,
                          })
                        : '#E57373',
                  },
                  overflow: 'hidden',
                }}
                onClick={() => {
                  setFocusedIndex(index)
                  setSelectedOption(option)
                }}
              >
                {option.tipoPedido === 'DELIVERY' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: '#F4E790',
                      color: '#333',
                      padding: '2px 5px',
                      fontSize: '0.7rem',
                      transform: 'rotate(45deg) translate(15%, -50%)',
                      zIndex: 1,
                    }}
                  >
                    DELIVERY
                  </div>
                )}
                {option.tipoPedido === 'LLEVAR' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      backgroundColor: '#C2F490',
                      color: '#333',
                      padding: '2px 5px',
                      fontSize: '0.7rem',
                      transform: 'rotate(-45deg) translate(-15%, -50%)',
                      zIndex: 1,
                    }}
                  >
                    LLEVAR
                  </div>
                )}
                <CardContent
                  sx={{
                    padding: '8px !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Tooltip
                    title={option.cliente ? toCamelCase(option.cliente.razonSocial) : ''}
                    placement="top"
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        style={{
                          fontSize: '1.2rem',
                        }}
                      >
                        {`M.: ${option.value}`}
                      </Typography>
                      {option.nroOrden && (
                        <>
                          <Typography
                            color="textSecondary"
                            variant="body2"
                            style={{
                              lineHeight: 1.3,
                              fontSize: '0.8rem',
                            }}
                          >
                            {`Ped.: ${option.nroOrden}`}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            variant="body2"
                            style={{
                              fontWeight: 'bold',
                              lineHeight: 1.3,
                              fontSize: '0.8rem',
                            }}
                          >
                            {option.horaPedido}
                          </Typography>
                          {option.cliente && (
                            <Typography
                              color="textSecondary"
                              variant="body2"
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%',
                                lineHeight: 1.3,
                                fontSize: '0.75rem',
                              }}
                            >
                              {truncateName(toCamelCase(option.cliente.razonSocial), 7)}
                            </Typography>
                          )}
                        </>
                      )}
                    </div>
                  </Tooltip>
                </CardContent>
              </Card>
            ))}
      </div>
      <Typography component="h2" variant="h6" style={{ fontWeight: 'bold' }}>
        Mesas ocupadas: {occupiedCount}
      </Typography>
    </div>
  )
}

export default Mosaico

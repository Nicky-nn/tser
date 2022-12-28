import { ArrowRight } from '@mui/icons-material'
import { Avatar, Card, CardContent, CardHeader, CSSObject } from '@mui/material'
import { styled } from '@mui/system'
import { FC, PropsWithChildren, ReactNode } from 'react'

import { H4 } from '../Typography'

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '15px 15px',
  overflow: 'inherit', // Cambio realizado para mostrar los hidden selects
  '& .MuiCardHeader-root': {
    paddingLeft: 1,
    paddingRight: 1,
    paddingTop: 1,
    paddingBottom: 25,
  },
  '& .MuiCardContent-root': {
    paddingLeft: 1.5,
    paddingRight: 1,
    paddingTop: 1,
    paddingBottom: 1,
  },
  '& .MuiCardHeader-avatar': {
    marginRight: '8px',
  },
})) as typeof Card

interface CardTitleProps {
  subtitle?: string
}

const CardTitle: FC<PropsWithChildren<CardTitleProps>> = styled('div')(
  ({ subtitle }: CardTitleProps): CSSObject => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: !subtitle ? '22px' : '0px',
  }),
)

export interface SimpleCardProps {
  title?: string
  subtitle?: string
  childIcon?: ReactNode
  children: ReactNode
}

const SimpleCard: FC<SimpleCardProps> = ({
  children,
  title,
  subtitle,
  childIcon,
}: SimpleCardProps) => {
  return (
    <CardRoot elevation={6}>
      {title && (
        <CardHeader
          avatar={
            title &&
            childIcon && (
              <Avatar sx={{ height: 25, width: 25, marginLeft: 0 }} aria-label="">
                {childIcon ? childIcon : <ArrowRight />}
              </Avatar>
            )
          }
          title={title && <H4>{title.toUpperCase()}</H4>}
          subheader={subtitle && subtitle}
        />
      )}

      <CardContent>{children}</CardContent>
    </CardRoot>
  )
}

export default SimpleCard

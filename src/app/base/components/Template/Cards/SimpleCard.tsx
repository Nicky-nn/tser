import {FC, PropsWithChildren, ReactNode} from 'react'
import {Card, CSSObject} from '@mui/material'
import {Box, styled} from '@mui/system'

const CardRoot = styled(Card)(() => ({
    height: '100%',
    padding: '15px 15px',
})) as typeof Card

interface CardTitleProps {
    subtitle?: string
}

const CardTitle: FC<PropsWithChildren<CardTitleProps>> = styled('div')(({subtitle}: CardTitleProps): CSSObject => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: !subtitle ? "22px" : "0px",
}))

export interface SimpleCardProps {
    title: string
    subtitle?: string
    Icon?: JSX.Element
    children: ReactNode
}

const SimpleCard: FC<SimpleCardProps> = ({children, title, subtitle, Icon}: SimpleCardProps) => {
    return (
        <CardRoot elevation={6}>
            <CardTitle subtitle={subtitle}>
                {title}
            </CardTitle>
            {subtitle && <Box sx={{mb: 2}}>{subtitle}</Box>}
            {children}
        </CardRoot>
    )
}

export default SimpleCard

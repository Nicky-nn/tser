import React, {Fragment} from 'react'
import RowCards from './shared/RowCards'
import StatCards from './shared/StatCards'
import {Card, Grid} from '@mui/material'
import StatCards2 from './shared/StatCards2'
import UpgradeCard from './shared/UpgradeCard'
import {styled} from '@mui/system'

const ContentBox = styled('div')(({theme}) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
}))

const SubTitle = styled('span')(({theme}) => ({
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
}))

const H4 = styled('h4')(({theme}) => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '16px',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
}))

const Analytics = () => {
    // const { palette } = useTheme()

    return (
        <Fragment>
            <ContentBox className="analytics">
                <Grid container spacing={3}>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <StatCards/>
                        <StatCards2/>
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Card sx={{px: 3, py: 2, mb: 3}}>
                            <Title>Tráfico en los </Title>
                            <SubTitle>ultimos 30 dias</SubTitle>
                        </Card>
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment>
    )
}

export default Analytics

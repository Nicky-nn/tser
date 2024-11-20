/* eslint-disable no-unused-vars */
import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material'
import { FunctionComponent } from 'react'

interface OwnProps {
  onSelected: (value: string) => void
}

const TipoDeDescarga: FunctionComponent<OwnProps> = ({ onSelected }) => {
  return (
    <Grid container spacing={2} sx={{ mt: 0.5, mb: 1 }}>
      <Grid item xs={6} md={3} lg={3}></Grid>
      <Grid item xs={6} md={3} lg={3}>
        <Card sx={{ height: '100%' }}>
          <CardActionArea onClick={() => onSelected('pdf')}>
            <CardContent sx={{ lineHeight: 0.5, padding: 1 }}>
              <img
                srcSet={`/assets/images/file-types/pdf.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`/assets/images/file-types/pdf.png?w=164&h=164&fit=crop&auto=format`}
                alt={'Pdf Medio Oficio'}
                loading="eager"
                width={'100%'}
              />
              <Typography variant={'caption'} color="text.secondary" gutterBottom>
                Medio Oficio
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={6} md={3} lg={3}>
        <Card sx={{ height: '100%' }}>
          <CardActionArea onClick={() => onSelected('rollo')}>
            <CardContent sx={{ lineHeight: 0.5, padding: 1 }}>
              <img
                srcSet={`/assets/images/file-types/rollo.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`/assets/images/file-types/rollo.png?w=164&h=164&fit=crop&auto=format`}
                alt={'Pdf Rollo'}
                loading="eager"
                width={'100%'}
              />
              <Typography variant={'caption'} color="text.secondary" gutterBottom>
                Pdf Rollo
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  )
}
export default TipoDeDescarga

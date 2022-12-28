import { Alert, LinearProgress } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'

interface OwnProps {
  mensaje?: string
  tipo?: 'error' | 'warning' | 'info' | 'success'
}

type Props = OwnProps

const AlertLoading: FunctionComponent<Props> = (props) => {
  const { mensaje, tipo } = props
  const [progress, setProgress] = React.useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <>
      <Alert icon={false} severity={tipo || 'info'} sx={{ width: '100%' }}>
        <strong>{mensaje || 'Cargando...'}</strong>
      </Alert>
      <LinearProgress variant="determinate" value={progress} />
    </>
  )
}

export default AlertLoading

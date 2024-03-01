import { Button, Snackbar } from '@mui/material'
import React, { FC, Fragment, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

/**
 * Componente que muestra un mensaje de actualización disponible
 * @constructor
 * const updateSW = registerSW({
 *   onNeedRefresh() {
 *     Toast.fire({
 *       icon: "info",
 *       title: "New Content Available",
 *     }).then((result: any) => {
 *       if (result.isConfirmed) {
 *         updateSW();
 *       }
 *     });
 *   },
 *   onOfflineReady() {
 *     Toast2.fire({
 *       icon: "info",
 *       title: "App is Ready To Work Offline",
 *     });
 *   },
 * });
 */
const ReloadPrompt: FC<any> = () => {
  const [open, setOpen] = useState(false)
  const updateSW = registerSW({
    onNeedRefresh() {
      setOpen(true)
    },
  })

  // Cuando se clickea en el botón de actualizar
  const handleClose = () => {
    setOpen(false)
    updateSW(true).then(() => window.location.reload())
    // registerSW({ immediate: true })
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        message="Nueva versión disponible, haga clic en el botón recargar para actualizar el sistema."
        action={
          <Fragment>
            <Button
              variant={'contained'}
              color="secondary"
              size="small"
              onClick={handleClose}
            >
              Recargar
            </Button>
          </Fragment>
        }
      />
    </>
  )
}

export default ReloadPrompt

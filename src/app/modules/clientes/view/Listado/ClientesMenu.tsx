import { Edit, MenuOpen } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { FunctionComponent, useState } from 'react'

import AuditIconButton from '../../../../base/components/Auditoria/AuditIconButton'
import SimpleMenu, { SimpleMenuItem } from '../../../../base/components/MyMenu/SimpleMenu'
import { ClienteProps } from '../../interfaces/cliente'
import Cliente99001ActualizarDialog from '../actualizar/Cliente99001ActualizarDialog'
import ClienteActualizarDialog from '../actualizar/ClienteActualizarDialog'

interface OwnProps {
  row: ClienteProps
  refetch: () => any
}

type Props = OwnProps

/**
 * Menu de opciones para el listado de clientes
 * Si los cuadros de dialogo tienen logica backend, no se recomienda el randerizado por tupla del listado
 * @param props
 * @constructor
 */
const ClientesMenu: FunctionComponent<Props> = (props) => {
  const { row, refetch } = props
  const [openClienteActualizar, setOpenClienteActualizar] = useState(false)
  const [openCliente99001Actualizar, setOpenCliente99001Actualizar] = useState(false)

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem', width: 100 }}>
        <SimpleMenu
          menuButton={
            <>
              <IconButton aria-label="menuGestionRoles">
                <MenuOpen />
              </IconButton>
            </>
          }
        >
          <SimpleMenuItem
            onClick={() => {
              if (row.numeroDocumento === '99001') {
                setOpenCliente99001Actualizar(true)
              } else setOpenClienteActualizar(true)
            }}
          >
            <Edit /> Modificar
          </SimpleMenuItem>
        </SimpleMenu>
        <AuditIconButton row={row} />
      </div>
      <ClienteActualizarDialog
        id={'clienteActualizarDialgo'}
        keepMounted={false}
        open={openClienteActualizar}
        cliente={row}
        onClose={(value?: ClienteProps) => {
          setOpenClienteActualizar(false)
          if (value) refetch().then()
        }}
      />
      <Cliente99001ActualizarDialog
        id={'cliente99001ActualizarDialgo'}
        keepMounted={false}
        open={openCliente99001Actualizar}
        cliente={row}
        onClose={(value?: ClienteProps) => {
          setOpenCliente99001Actualizar(false)
          if (value) refetch().then()
        }}
      />
    </>
  )
}

export default ClientesMenu

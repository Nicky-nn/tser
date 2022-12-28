import { merge } from 'lodash'
import React, { createContext, FC, useState } from 'react'

import {
  MatxLayoutSettings,
  MatxLayoutSettingsProps,
} from '../components/Template/MatxLayout/settings'

interface SettingContextProps {
  settings: MatxLayoutSettingsProps
  updateSettings: any
}

const SettingsContext: React.Context<SettingContextProps> = createContext({
  settings: MatxLayoutSettings,
  updateSettings: () => {},
})

type SettingsProviderProps = {
  children: JSX.Element | JSX.Element[]
  settings?: MatxLayoutSettingsProps
}

export const SettingsProvider: FC<SettingsProviderProps> = ({
  settings,
  children,
}: SettingsProviderProps) => {
  const [currentSettings, setCurrentSettings] = useState<MatxLayoutSettingsProps>(
    settings || MatxLayoutSettings,
  )

  const handleUpdateSettings = (update = {}) => {
    const marged = merge({}, currentSettings, update)
    setCurrentSettings(marged)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        updateSettings: handleUpdateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsContext

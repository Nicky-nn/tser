import React, {createContext, FC, useState} from 'react'

import {merge} from 'lodash'
import {MatxLayoutSettings} from "../components/Template/MatxLayout/settings";


const SettingsContext = createContext({
    settings: MatxLayoutSettings,
    updateSettings: () => {
    },
})

type SettingsProviderProps = {
    children: JSX.Element | JSX.Element[],
    settings: any,
}

export const SettingsProvider: FC<any> = ({settings, children}: SettingsProviderProps) => {
    const [currentSettings, setCurrentSettings] = useState(
        settings || MatxLayoutSettings
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

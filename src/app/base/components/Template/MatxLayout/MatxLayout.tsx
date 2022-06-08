import React, {FC} from 'react'
import {MatxLayouts} from './index'
import useSettings from "../../../hooks/useSettings";
import MatxSuspense from "../MatxSuspense/MatxSuspense";

const MatxLayout: FC<any> = (props) => {
    const {settings} = useSettings()
    const Layout = MatxLayouts[settings.activeLayout]

    return (
        <MatxSuspense>
            <Layout {...props} />
        </MatxSuspense>
    )
}

export default MatxLayout

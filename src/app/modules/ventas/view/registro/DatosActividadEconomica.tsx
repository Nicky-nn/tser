import React, {FunctionComponent, useEffect, useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {setActividadEconomica} from "../../slices/facturacion/factura.slice";
import {useAppSelector} from "../../../../hooks";
import {useDispatch} from "react-redux";
import {SinActividadesProps} from "../../../sin/interfaces/sin.interface";
import {fetchSinActividades} from "../../../sin/api/sinActividadEconomica.api";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";

interface OwnProps {
}

type Props = OwnProps;

const DatosActividadEconomica: FunctionComponent<Props> = () => {
    const factura = useAppSelector(state => state.factura);
    const dispatch = useDispatch();

    const [actividadEconomica, setActividadesEconomicas] = useState<SinActividadesProps[]>([]);

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            await fetchSinActividades().then(res => {
                setActividadesEconomicas(res)
            });
        }
        fetch().then()
    }, []);

    return (
        <>
            <SimpleCard>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Actividad Económica</InputLabel>
                    <Select
                        label="Actividad Económica"
                        value={factura.actividadEconomica}
                        defaultValue={factura.actividadEconomica}
                        onChange={(e) => dispatch(setActividadEconomica(e.target.value))}
                        size={'small'}
                    >
                        {
                            actividadEconomica.map(ae => (
                                <MenuItem key={ae.codigoCaeb} value={ae.codigoCaeb}>
                                    {ae.tipoActividad} - {ae.descripcion}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </SimpleCard>

        </>
    );
};

export default DatosActividadEconomica;

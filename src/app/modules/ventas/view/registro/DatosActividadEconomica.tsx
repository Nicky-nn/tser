import React, {FunctionComponent, useEffect, useState} from 'react';
import {FormControl} from "@mui/material";
import {setFactura} from "../../slices/facturacion/factura.slice";
import {useAppSelector} from "../../../../hooks";
import {useDispatch} from "react-redux";
import {SinActividadesProps} from "../../../sin/interfaces/sin.interface";
import {fetchSinActividades} from "../../../sin/api/sinActividadEconomica.api";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {swalException} from "../../../../utils/swal";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import Select from "react-select";
import {genReplaceEmpty} from "../../../../utils/helper";

interface OwnProps {
}

type Props = OwnProps;

const DatosActividadEconomica: FunctionComponent<Props> = () => {
    const factura = useAppSelector(state => state.factura);
    const dispatch = useDispatch();
    const [actividadEconomica, setActividadesEconomicas] = useState<SinActividadesProps[]>([]);
    const fetchActividades = async () => {
        try {
            const actividades = await fetchSinActividades();
            if (actividades.length > 0) {
                setActividadesEconomicas(actividades)
                dispatch(setFactura({...factura, actividadEconomica: actividades[0]}))
            }
        } catch (e: any) {
            swalException(e)
        }
    }

    useEffect(() => {
        fetchActividades().then()
    }, []);

    return (
        <>
            <SimpleCard>
                <FormControl fullWidth>
                    <SelectInputLabel shrink>
                        Actividad Económica
                    </SelectInputLabel>
                    <Select<SinActividadesProps>
                        styles={reactSelectStyles}
                        menuPosition={'fixed'}
                        name="actividadEconomica"
                        placeholder={'Seleccione la actividad económica'}
                        value={genReplaceEmpty(factura.actividadEconomica, null)}
                        onChange={async (val: any) => {
                            dispatch(setFactura({
                                ...factura,
                                actividadEconomica: val,
                                detalle: []
                            }))
                        }}
                        isSearchable={false}
                        options={actividadEconomica}
                        getOptionValue={(item) => item.codigoCaeb}
                        getOptionLabel={(item) => `${item.tipoActividad} - ${item.codigoCaeb} - ${item.descripcion}`}
                    />
                </FormControl>
            </SimpleCard>

        </>
    );
};

export default DatosActividadEconomica;

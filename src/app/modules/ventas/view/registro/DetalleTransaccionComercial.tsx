import {Grid} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {FC, useState} from "react";
import {ClienteProps} from "../../../../base/api/cliente.api";
import {useAppSelector} from "../../../../hooks";
import {useDispatch} from "react-redux";
import {Multiselect} from "multiselect-react-dropdown";
const data: any = []

export const DetalleTransaccionComercial: FC = () => {
    const factura = useAppSelector(state => state.factura);
    const dispatch = useDispatch();
    const [productos, setProductos] = useState<ClienteProps[]>([]);
    const [options_, setOptions] = useState<String[]>([]);
    const [loading, setLoading] = useState(false);
    const handleSearch = (value: any) => {
        console.log(value)
        setLoading(true);
        const results = value ? data.filter((w: any) => w.toLowerCase().includes(value)) : []
        setTimeout((r: any) => {
            setOptions(r);
            setLoading(false)
        }, 400, results)
    }

    return <>
        <SimpleCard title="Detalle transacción comercial">
            <small>seleccione el producto</small>
            <Multiselect
                options={options_}
                onSearch={handleSearch}
                loading={loading}
                isObject={false}
            />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>

                </Grid>
                <Grid item xs={12}>
                </Grid>
            </Grid>
        </SimpleCard>
    </>
}


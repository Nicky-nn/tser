import './App.css'
import {useRoutes} from "react-router-dom";
import {AllPages} from "./app/routes/routes";
import {Provider} from "react-redux";
import {store} from "./app/store/store";
import {SettingsProvider} from "./app/base/contexts/SettingsContext";
import MatxTheme from "./app/base/components/Template/MatxTheme/MatxTheme";
import {AuthProvider} from "./app/base/contexts/JWTAuthContext";
import {ConfirmProvider} from "material-ui-confirm";

function App() {
    const all_pages = useRoutes(AllPages())

    return (
        <Provider store={store}>
            <SettingsProvider>
                <MatxTheme>
                    <ConfirmProvider
                        defaultOptions={{
                            title: '¿Esta seguro?',
                            confirmationText: 'Confirmar',
                            cancellationText: 'Cancelar',
                        }}
                    >
                        <AuthProvider>{all_pages}</AuthProvider>
                    </ConfirmProvider>
                </MatxTheme>
            </SettingsProvider>
        </Provider>
    )
}

export default App

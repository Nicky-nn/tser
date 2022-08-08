import './App.css'
import {useRoutes} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./app/store/store";
import {SettingsProvider} from "./app/base/contexts/SettingsContext";
import MatxTheme from "./app/base/components/Template/MatxTheme/MatxTheme";
import {AuthProvider} from "./app/base/contexts/JWTAuthContext";
import {appRoutes} from "./app/routes/routes";

function App() {
    const content = useRoutes(appRoutes);
    return (
        <Provider store={store}>
            <SettingsProvider>
                <MatxTheme>
                    <AuthProvider>{content}</AuthProvider>
                </MatxTheme>
            </SettingsProvider>
        </Provider>
    )
}

export default App

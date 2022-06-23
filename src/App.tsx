import './App.css'
import {useRoutes} from "react-router-dom";
import {AllPages} from "./app/routes/routes";
import {Provider} from "react-redux";
import {store} from "./app/store/store";
import {SettingsProvider} from "./app/base/contexts/SettingsContext";
import MatxTheme from "./app/base/components/Template/MatxTheme/MatxTheme";
import {AuthProvider} from "./app/base/contexts/JWTAuthContext";
import ModalProvider from "mui-modal-provider";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

function App() {
    const all_pages = useRoutes(AllPages())
    const client = new ApolloClient({
        uri: import.meta.env.ISI_API_URL,
        cache: new InMemoryCache()
    });
    return (
        <Provider store={store}>
            <SettingsProvider>
                <MatxTheme>
                    <ModalProvider>
                        <ApolloProvider client={client}>

                            <AuthProvider>{all_pages}</AuthProvider>
                        </ApolloProvider>

                    </ModalProvider>
                </MatxTheme>
            </SettingsProvider>
        </Provider>

    )
}

export default App

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'rc-input-number/assets/index.css'
import '@sweetalert2/theme-material-ui/material-ui.min.css'
// import "ka-table/style.css";
// import "./styles/ka.css";
import 'react-toastify/dist/ReactToastify.css';
import {CssBaseline, StyledEngineProvider} from "@mui/material";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <BrowserRouter>
                <QueryClientProvider client={new QueryClient()}>
                    <CssBaseline/>
                    <App/>
                    <ToastContainer limit={3}/>
                </QueryClientProvider>
            </BrowserRouter>
        </StyledEngineProvider>
    </React.StrictMode>
)

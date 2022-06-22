import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import 'rc-input-number/assets/index.css'
import {CssBaseline, StyledEngineProvider} from "@mui/material";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <BrowserRouter>
                <CssBaseline/>
                <App/>
                <ToastContainer limit={3} />
            </BrowserRouter>
        </StyledEngineProvider>
    </React.StrictMode>
)

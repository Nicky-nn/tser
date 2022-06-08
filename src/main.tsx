import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {CssBaseline, StyledEngineProvider} from "@mui/material";
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <BrowserRouter>
                <CssBaseline/>
                <App/>
            </BrowserRouter>
        </StyledEngineProvider>
    </React.StrictMode>
)

# Base template ISI.INVOICE

librerias nesesarias para el `package.json` en fecha 16/02/2024

```json
{
  "name": "isi-*",
  "private": true,
  "version": "2.0.0",
  "scripts": {
    "dev": "vite --port 3002",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint:fix": "eslint ./src --ext .jsx,.js,.ts,.tsx --quiet --fix --ignore-path ./.gitignore",
    "lint:format": "prettier  --loglevel warn --write \"./**/*.{js,jsx,ts,tsx,css,md,json}\" ",
    "lint": "yarn lint:format && yarn lint:fix "
  },
  "author": {
    "name": "Richard Quenta"
  },
  "dependencies": {
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "@hookform/resolvers": "^3.3.4",
    "@mui/icons-material": "^5.15.10",
    "@mui/lab": "^5.0.0-alpha.165",
    "@mui/material": "^5.15.10",
    "@mui/system": "^5.15.9",
    "@mui/x-data-grid": "^6.19.4",
    "@mui/x-date-pickers": "^6.19.4",
    // "@sweetalert2/theme-material-ui": "^5.0.16", desinstalar y quitar de main.tsx
    "@tanstack/react-query": "^5.20.5",
    "@tanstack/react-table": "^8.12.0",
    "@tinymce/tinymce-react": "^4.3.2",
    "axios": "^1.6.7",
    "clsx": "^2.1.0",
    "date-fns": "^3.3.1",
    "dayjs": "^1.11.10",
    "export-from-json": "^1.7.4",
    "graphql": "^16.8.1",
    "graphql-request": "^6.1.0",
    "html-react-parser": "^5.1.5",
    "html-to-text": "^9.0.5",
    "jwt-decode": "^4.0.0",
    "lodash": "^4.17.21",
    "material-react-table": "^2.11.3",
    "nanoid": "^5.0.5",
    "rc-input-number": "^9.0.0",
    "react": "^18.2.0",
    "react-datepicker": "^6.1.0",
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.2.3",
    "react-hook-form": "^7.50.1",
    "react-imask": "^7.4.0",
    "react-is": "^18.2.0",
    "react-movable": "^3.0.4",
    "react-number-format": "^5.3.1",
    "react-perfect-scrollbar": "^1.5.8",
    "react-router-dom": "^6.22.0",
    "react-select": "^5.8.0",
    "react-sortablejs": "^6.1.4",
    "react-toastify": "^10.0.4",
    "react-turnstile": "^1.1.2",
    "sortablejs": "^1.15.2",
    "sweetalert2": "^11.10.5",
    "sweetalert2-react-content": "^5.0.7",
    "yup": "^1.3.3",
    "yup-locales": "^1.2.21"
  },
  "devDependencies": {
    "@babel/runtime": "^7.23.9",
    "@rollup/plugin-terser": "^0.4.4",
    "@types/html-to-text": "^9.0.4",
    "@types/lodash": "^4.14.202",
    "@types/react": "^18.2.55",
    "@types/react-datepicker": "^6.0.1",
    "@types/react-dom": "^18.2.19",
    "@types/sortablejs": "^1.15.7",
    "@typescript-eslint/eslint-plugin": "^7.0.1",
    "@typescript-eslint/parser": "^7.0.1",
    "@vitejs/plugin-react": "^4.2.1",
    "babel-plugin-import": "^1.13.8",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-config-typescript": "^3.0.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-prettier": "^5.1.3",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-simple-import-sort": "^12.0.0",
    "eslint-plugin-sort-keys-fix": "^1.1.2",
    "prettier": "^3.2.5",
    "typescript": "^5.3.3",
    "unplugin-zip-pack": "^1.0.1",
    "vite": "^5.1.3",
    "vite-plugin-pwa": "^0.18.2",
    "workbox-build": "^7.0.0",
    "workbox-window": "^7.0.0"
  }
}
```

Implementación pwa

Modificar el archivo `vite.config.mts`

```typescript
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import ZipPack from 'unplugin-zip-pack/vite'
import pwaOptions from './pwaOptions'
// https://vitejs.dev/config/
/**
 * node_modules es principalmente la razón principal del problema de los fragmentos grandes.
 * Con esto le estás diciendo a Vite que trate los módulos usados por separado
 * */
export default ({ mode }) => {
  // Mapeamos los valores de .env a process.env
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return defineConfig({
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      VitePWA(pwaOptions(process.env)),
      ZipPack({
        enabled: true,
        out: `dist-zip/${process.env.ISI_BASE_URL || 'dist'}.zip`,
      }),
    ],
    envPrefix: 'ISI_',
    build: {
      chunkSizeWarningLimit: 550, // No resuelve el problema de los fragmentos grandes
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
        },
      },
    },
  })
}
```

Crear el archivo `pwaOptions.ts`

```typescript
import { VitePWAOptions } from 'vite-plugin-pwa'

/**
 * Configuración para service worker según la instancia
 */
const pwaOptions = (env: any): Partial<VitePWAOptions> => ({
  registerType: `${env.APP_ENV}` === 'local' ? 'autoUpdate' : 'prompt',
  includeAssets: [`${env.ISI_FAVICON}`],
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,wav,mp3,gltf,bin}'],
  },
  manifest: {
    name: `Módulo de Administración`,
    short_name: 'ADM',
    theme_color: '#ffffff',
    display: 'standalone',
    icons: [
      {
        src: `${env.ISI_ASSETS_URL}/64.png`, // <== don't add slash, for testing
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: `${env.ISI_ASSETS_URL}/128.png`, // <== don't add slash, for testing
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: `${env.ISI_ASSETS_URL}/192.png`, // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `${env.ISI_ASSETS_URL}/512.png`, // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${env.ISI_ASSETS_URL}/512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  devOptions: {
    enabled: `${env.APP_ENV}` === 'local',
  },
})

export default pwaOptions
```

añadir soporte pwa a typescript front-node `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "esnext",
    "moduleResolution": "node",
    "jsxImportSource": "@emotion/react"
  },
  "include": ["vite.config.mts", "./pwaOptions.ts"]
}
```

añadir el tipado ts a `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite-plugin-pwa/client"]
  },
  "include": ["src", "types"],
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

Crear el directorio `dist-zip` y bloquear el commit de git en `.gitignore`

modificar el archivo `.env` y Crear los archivos `.env.sandbox` `.env.integrate`

```bash
APP_ENV=local

ISI_BASE_URL=http://localhost:3002
#ISI_API_URL=https://api.isipass.com.bo/api
#ISI_API_URL=https://sandbox.isipass.net/api
ISI_API_URL=http://localhost:3000/api


#### SANDBOX
ISI_ASSETS_URL=/assets/images/integrate
ISI_FONDO=/assets/images/integrate/fondo-login.jpg
ISI_LOGO_FULL=/assets/images/integrate/logo.png
ISI_LOGO_MINI=/assets/images/integrate/logo-mini.png
ISI_NOMBRE_COMERCIAL=ISI.INVOICE
ISI_URL=https://integrate.com.bo
ISI_FAVICON=/assets/images/integrate/favicon.ico
ISI_THEME=blue
#green, blue, blue1, purple, indigo, default,

ISI_DOCUMENTO_SECTOR=1
ISI_CAPTCHA_KEY=0x4AAAAAAAIR3qJWMFMaFVXX

```

.env.integrate

```bash
APP_ENV=production

ISI_BASE_URL=adm.isipass.net
ISI_API_URL=https://api.isipass.com.bo/api

ISI_DOCUMENTO_SECTOR=1
ISI_CAPTCHA_KEY=0x4AAAAAAAIcp-nx8ps0Ynbv

#### INTEGRATE ISI.INVOICE
ISI_ASSETS_URL=/assets/images/integrate
ISI_FONDO=/assets/images/integrate/fondo-login.jpg
ISI_LOGO_FULL=/assets/images/integrate/logo.png
ISI_LOGO_MINI=/assets/images/integrate/logo-mini.png
ISI_NOMBRE_COMERCIAL=ISI.INVOICE
ISI_URL=https://integrate.com.bo
ISI_FAVICON=/assets/images/integrate/favicon.ico
ISI_THEME=blue1
# green, blue, blue1, purple, indigo, default,

```

.env.production

```bash
APP_ENV=production

ISI_BASE_URL=dev.adm.isipass.com.bo
ISI_API_URL=https://sandbox.isipass.net/api

ISI_DOCUMENTO_SECTOR=1
ISI_CAPTCHA_KEY=0x4AAAAAAAIR3qJWMFMaFVXX

#### INTEGRATE SANDBOX
ISI_ASSETS_URL=/assets/integrate
ISI_FONDO=/assets/integrate/fondo-login.jpg
ISI_LOGO_FULL=/assets/integrate/logo.png
ISI_LOGO_MINI=/assets/integrate/logo-mini.png
ISI_NOMBRE_COMERCIAL=ISI.INVOICE
ISI_URL=https://integrate.com.bo
ISI_FAVICON=/assets/integrate/favicon.ico
ISI_THEME=blue

```

Modificar el archivo `.eslintrc.js` y añadir la siguiente regla para no permitir anidación de dependencias para eslint

```bash
'no-restricted-imports': [
  'error',
  {
    patterns: ['@mui/*/*/*'],
  },
],
```

`.eslintignore`

```bash
node_modules
.idea
dist
dist-zip
dev-dist
```

`src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ISI_TITLE: string
  readonly ISI_API_URL: string
  readonly ISI_BASE_URL: string
  readonly ISI_DOCUMENTO_SECTOR: number
  readonly ISI_CAPTCHA_KEY: string
  readonly ISI_FONDO: string
  readonly ISI_LOGO_FULL: string
  readonly ISI_LOGO_MINI: string
  readonly ISI_NOMBRE_COMERCIAL: string
  readonly ISI_URL: string
  readonly ISI_THEME: string
  readonly ISI_FAVICON: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

`src/App.tsx`

```typescript
import './App.css'

import { CssBaseline } from '@mui/material'
import { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'

import ReloadPrompt from './app/base/components/ReloadPrompt/ReloadPrompt'
import MatxTheme from './app/base/components/Template/MatxTheme/MatxTheme'
import { AuthProvider } from './app/base/contexts/JWTAuthContext'
import { SettingsProvider } from './app/base/contexts/SettingsContext'
import { appRoutes } from './app/routes/routes'

function App() {
  const content = useRoutes(appRoutes)

  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]')
    if (link) {
      if (import.meta.env.ISI_FAVICON) {
        link.setAttribute('href', import.meta.env.ISI_FAVICON)
      }
    }
  }, [])

  return (
    <SettingsProvider>
      <AuthProvider>
        <MatxTheme>
          <CssBaseline />
          {content}
          <ReloadPrompt />
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
  )
}

export default App
```

archivo adjunto estaran los recursos

Migración de las rutas de home

- Se elimina las vistas de `app/base/view` ya que esta será una dependencia de actualización de template.

- eliminar el archivo `src\app\utils\materialReactTableUtils.ts`

- Se migran los modulos de sessión al directorio `app/modules/base/sessions`

- Se migran los modulos de home (**antes llamado dashboard**) `app/modules/base/home`

- Eliminar los directorios `src\app\base/` dashboard y session

- Modificar el archivo `\src\app/navigations.tsx` y añadir lo siguiente

  ```typescript
  // modificar la ruta de la pagina princiap
  ;[
    {
      name: homeRoutesMap.home.name,
      path: homeRoutesMap.home.path,
      icon: 'dashboard',
    },
  ]
  ```

  modificar `\src\app\routes\routes.tsx` y reemplazar `dashboardRoutes` por `homeRoutes`

  Cambiar `{ path: '/', element: <Navigate to="dashboard/default" /> }` por `{ path: '/', element: <Navigate to={homeRoutesMap.home.path} /> },`

- Se adjunta codigo fuente

- Se quita todo rastro relacionado a redux y redux-toolkit. En caso de querer usar una libreria de estados globales se recomienda `zustand`

- Se debe migrar material-react-table a su nueva estructura basado en la versión 2.0.0

- Se debe migrar react-query a su nueva estructura

- Adicionar `<LayoutRestriccion />` en `src/app/base/components/Template/MatxLayout/Layout1/Layout1.tsx` y modificar para que coincida con el documento sector al que corresponda

- Se ha cambiado el componente `StyledMenuItem` por `SimpleMenuItem`

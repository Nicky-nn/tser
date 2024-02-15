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

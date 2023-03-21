/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ISI_TITLE: string
  readonly ISI_API_URL: string
  readonly ISI_BASE_URL: string
  readonly ISI_DOCUMENTO_SECTOR: number
  readonly ISI_FONDO: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

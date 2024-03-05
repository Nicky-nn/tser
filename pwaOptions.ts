import { VitePWAOptions } from 'vite-plugin-pwa'

/**
 * Configuración para service worker según la instancia
 */
const pwaOptions = (env: any): Partial<VitePWAOptions> => ({
  registerType: `${env.APP_ENV}` === 'local' ? 'autoUpdate' : 'prompt',
  includeAssets: [`${env.ISI_FAVICON}`],
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp}'],
  },
  manifest: {
    name: `Módulo de Administración`,
    short_name: 'ADM',
    theme_color: '#ffffff',
    display: 'minimal-ui',
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

import react from '@vitejs/plugin-react'
import {defineConfig, splitVendorChunkPlugin} from 'vite'

// https://vitejs.dev/config/
/**
 * node_modules es principalmente la razón principal del problema de los fragmentos grandes.
 * Con esto le estás diciendo a Vite que trate los módulos usados por separado
 * */
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  envPrefix: 'ISI_',

  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // @ts-ignore
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      }
    }
  },
})

/*
{
        jsxImportSource: "@emotion/react",
        babel: {
            plugins: ["@emotion/babel-plugin"],
        },
    }
    build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // @ts-ignore
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
 */

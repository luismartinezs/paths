import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['sql.js']
  },
  build: {
    commonjsOptions: {
      include: [/sql\.js/, /node_modules/]
    }
  },
  resolve: {
    alias: {
      'sql.js': 'sql.js/dist/sql-wasm.js',
    },
  },
})

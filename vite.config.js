import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Asegúrate de que la salida se haga en la carpeta 'dist'
  },
  resolve: {
    alias: {
      '@': '/src'  // Esto configura '@' para que apunte a la carpeta 'src'
    }
  }
})

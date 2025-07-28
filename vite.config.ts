import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
   server: {
    allowedHosts: [
      'a7e4e04c6099.ngrok-free.app', // tu host de ngrok
      // puedes agregar más hosts aquí si quieres
    ],
  },
  plugins: [react()],
})

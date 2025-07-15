import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
   server: {
    allowedHosts: [
      'c7e5-187-190-174-203.ngrok-free.app', // tu host de ngrok
      // puedes agregar más hosts aquí si quieres
    ],
  },
  plugins: [react()],
})

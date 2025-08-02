import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
   server: {
    allowedHosts: [    
    ],
  },
  plugins: [react()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// host: true => the "Network" URL works on your phone (same WiFi)
export default defineConfig({ plugins: [react()], server: { host: true, port: 5173 } })

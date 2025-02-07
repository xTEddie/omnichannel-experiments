import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'acs_webchat-chat-adapter': path.resolve(__dirname, 'node_modules', 'acs_webchat-chat-adapter', 'dist', 'chat-adapter.js')
    }
  }
})

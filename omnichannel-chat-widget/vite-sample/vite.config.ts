import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@microsoft/botframework-webchat-adapter-azure-communication-chat/package.json': path.resolve(__dirname, 'node_modules', '@microsoft', 'botframework-webchat-adapter-azure-communication-chat', 'package.json'),
      '@microsoft/botframework-webchat-adapter-azure-communication-chat': path.resolve(__dirname, 'node_modules', '@microsoft', 'botframework-webchat-adapter-azure-communication-chat', 'dist', 'chat-adapter.js'),
      '@fluentui/react': path.resolve(__dirname, 'node_modules', '@microsoft', 'omnichannel-chat-components', 'node_modules', '@fluentui', 'react')
    }
  }
})

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Note: botframework-webchat is not compatible with StrictMode
createRoot(document.getElementById('root')!).render(
  <App />
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ProveedorAutenticacion } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProveedorAutenticacion>
      <App />
    </ProveedorAutenticacion>
  </StrictMode>,
)
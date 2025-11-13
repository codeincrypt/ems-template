import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Tell TypeScript that this side-effect CSS import is intentional
// If you prefer a project-wide fix, add a "declare module '*.css';" in a .d.ts file.
 // @ts-ignore
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

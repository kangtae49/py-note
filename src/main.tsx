import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {PyProvider} from "@/components/PyProvider.tsx";
import PyMenuListener from "@/listeners/PyMenuListener.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PyProvider>
      <PyMenuListener />
      <App />
    </PyProvider>
  </StrictMode>,
)

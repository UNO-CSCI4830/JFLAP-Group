import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Grammars from './Grammars.tsx'
import BruteForceParse from './BruteForceParse'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/grammars" element={<Grammars />} />
        <Route path="/bruteforce" element={<BruteForceParse />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

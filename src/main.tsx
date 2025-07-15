import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import Home from './pages/Home'
import Game from './pages/Game'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/game/:gameId" element={<Game />} />
  </Routes>
  </BrowserRouter>
  </StrictMode>,
)

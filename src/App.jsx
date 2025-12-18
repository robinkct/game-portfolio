import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game2048 from './games/game-2048/Game2048'

import Games from './pages/Games'
import Tetris from './games/tetris/Tetris'
import Pikachu from './games/pikachu/Pikachu'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/2048" element={<Game2048 />} />
        <Route path="/games/tetris" element={<Tetris />} />
        <Route path="/games/pikachu" element={<Pikachu />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

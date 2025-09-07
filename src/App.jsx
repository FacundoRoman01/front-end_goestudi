
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx';

function App() {
  

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Aquí puedes añadir más rutas para otras páginas */}
      </Routes>
    </Router>

    </>
  )
}

export default App

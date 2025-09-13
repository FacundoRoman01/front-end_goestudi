
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user/account" element={<UserProfile />} />
        <Route path="/user/profile" element={<Profile />} />

        {/* Aquí puedes añadir más rutas para otras páginas */}
      </Routes>
    </Router>

    </>
  )
}

export default App


import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Profile from './pages/Profile.jsx';
import CompanyProfile from './pages/CompanyProfile.jsx';
import JobCreateForm from './pages/JobCreateForm.jsx';
import CompanyProfileForm from './pages/CompanyProfileForm.jsx';

function App() {
  

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user/account" element={<UserProfile />} />
        <Route path="/user/profile" element={<Profile />} />

          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/profile/new" element={<CompanyProfileForm />} />
          <Route path="/company/profile/edit" element={<CompanyProfileForm />} />

          <Route path="/company/profile" element={<CompanyProfile />} />
        {/* Rutas para trabajos */}
        <Route path="/company/job/new" element={<JobCreateForm />} />
        <Route path="/company/job/edit/:jobId" element={<JobCreateForm />} />

        {/* Aquí puedes añadir más rutas para otras páginas */}
      </Routes>
    </Router>

    </>
  )
}

export default App

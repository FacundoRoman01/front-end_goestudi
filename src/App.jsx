
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Profile from './pages/Profile.jsx';
import CompanyProfile from './pages/CompanyProfile.jsx';
import JobCreateForm from './pages/JobCreateForm.jsx';
import CompanyProfileForm from './pages/CompanyProfileForm.jsx';
import UserApplications from './pages/UserApplications.jsx';
import CandidatesApplication from './pages/CandidatesApplication.jsx';

function App() {
  

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user/account" element={<UserProfile />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/applications" element={<UserApplications />} />

          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/profile/new" element={<CompanyProfileForm />} />
          <Route path="/company/profile/edit" element={<CompanyProfileForm />} />

          <Route path="/company/profile" element={<CompanyProfile />} />
      
          <Route path="/company/job/edit/:jobId" element={<JobCreateForm />} />

           <Route path="/company/candidates" element={<CandidatesApplication />} />

        {/* Aquí puedes añadir más rutas para otras páginas */}
      </Routes>
    </Router>


     <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          success: {
            duration: 4000,
          },
          error: {
            duration: 5000,
          },
        }}
      />



    </>
  )
}

export default App

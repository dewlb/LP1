//import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.tsx';
// Used 2 have <LoginPage />
import './App.css'
import Dashboard from './pages/Dashboard.tsx';

function App() {
  return (
    <>
         <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
        
    </>
  )
}

export default App

import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage.tsx';
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <LoginPage />
          <Route path='/login' element={<Login />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage.tsx';
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App

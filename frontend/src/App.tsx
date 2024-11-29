import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import Settings from './pages/Settings';
import Connect from './pages/Connect';
import AboutUs from './pages/AboutUs';
import AboutPage from './pages/AboutPage';
import CreateTournament from './pages/CreateTournament';


function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

// MainContent handles the logic for conditionally rendering Navbar
function MainContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/dashboard', '/aboutus', '/MyProfile', '/Settings', '/connect', '/createTournament']; // Add other routes where Navbar should be hidden

  return (
    <>
      {/* Conditionally render Navbar based on the current route */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      {/* Define your Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element = {<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element = {<Dashboard />} />
        <Route path="/createTournament" element = {<CreateTournament />} />
        <Route path="/MyProfile" element = {<MyProfile />} />
        <Route path="/Settings" element = {<Settings />} />
        <Route path="/connect" element = {<Connect />} />
        <Route path="/aboutus" element = {<AboutUs />} />
      </Routes>
    </>
  );
}

export default App;

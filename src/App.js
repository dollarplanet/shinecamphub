import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import LoginB from './pages/login-berhasil'
import { useState } from 'react';
import './App.css'; // Assuming you have some global CSS for your app

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  return (
    
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            <Route path="/login/login-berhasil" element={<LoginB setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          </Routes>
        </Router>
      </div>
    
  );
}

export default App;

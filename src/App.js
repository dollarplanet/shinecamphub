import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import LoginB from './pages/login-berhasil'
import RoomChat from './pages/room_chat'
import ForumChat from './pages/forum_chat'
import Membership from './pages/membership'
import Feedback from './pages/feedback'
import Setting from './pages/setting'
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
            <Route path="/login/login-berhasil" element={<LoginB />} />
            <Route path="/home" element={<Home  />} />
            <Route path="/room-chat" element={<RoomChat />} />
            <Route path="/forum-chat" element={<ForumChat />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/setting" element={<Setting />} />

            
          </Routes>
        </Router>
      </div>
    
  );
}

export default App;

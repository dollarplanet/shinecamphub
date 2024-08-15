import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import RegisterUser from './pages/register_user';
import RegisterHealer from './pages/register_healer';
import Login from './pages/login';
import LoginB from './pages/login-berhasil';
import RoomChat from './pages/room_chat';
import ForumChat from './pages/forum_chat';
import Membership from './pages/membership';
import Feedback from './pages/feedback';
import Setting from './pages/setting';
import PilihBahasa from "./pages/pilihBahasa";
import Panduan from "./pages/panduan";
import PusatBantuan from './pages/pusatBantuan';
import Logout from "./pages/logout";
import { useState } from 'react';
import './App.css'; // Assuming you have some global CSS for your app

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [healerId, setHealerId] = useState(''); // Add userId state

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} setUserId={setUserId} setHealerId={setHealerId} />} />
          <Route path="/register_user" element={<RegisterUser />} />
          <Route path="/register_healer" element={<RegisterHealer />} />
          <Route path="/login/login-berhasil" element={<LoginB />} />
          <Route path="/home" element={<Home />} />
          <Route path="/room-chat" element={<RoomChat />} />
          <Route path="/forum-chat" element={<ForumChat />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/setting/pilih-bahasa" element={<PilihBahasa />} />
          <Route path="/setting/panduan" element={<Panduan />} />
          <Route path="/setting/pusat-bantuan" element={<PusatBantuan />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


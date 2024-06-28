import React, { useState } from 'react';
import "./home.css"
import Sidebar from '../component/sidebar';
import Logo from "../images/logo.png";
import Hiasan1 from "../images/hiasan-1.png"
import Hiasan2 from "../images/hiasan-2.png"
import RoomChat from "../images/chat.png"
import ForumChat from "../images/forum_chat.png"
import Membership from "../images/membership.png"
import PitaImage from "../images/pita_2-removebg-preview 2.png"
import Whatsapp from "../images/ic_baseline-whatsapp.png"
import Facebook from "../images/ic_baseline-facebook.png"
import Email from "../images/mdi_email.png"
import Instagram from "../images/mdi_instagram.png"
import Twitter from "../images/mdi_twitter.png"

import Navbar from "../component/navbar"

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <Navbar />
        <div>
        <main className="main-content">
        <section className="intro">
          <div className='intro-hiasan'>
            <img className='intro-logo' src={Logo} alt='logo-intro'/>
            <img className='hiasan-1' src={Hiasan1} alt='hiasan-1'/>
            <img className='hiasan-2' src={Hiasan2} alt='hiasan-2'/>
          </div>
          <p>SHINE CAMPUS HUB mencerminkan fokus pada dukungan, penyembuhan, inspirasi, jaringan, dan pemberdayaan di setiap kampus. serta, memberikan akses untuk berkomunikasi dengan Admin Healer.</p>
        </section>
        <section className="features">
          <button className="feature-button">
            <img src={RoomChat} alt='logo-chat'/>
            <p>Room Chat</p>
          </button>
          <button className="feature-button">
            <img src={ForumChat} alt='logo-forum' />
            <p>Forum Chat Global</p>
          </button>
          <button className="feature-button">
           <img src={Membership} alt='logo-membership'/>
           <p>Membership</p> 
          </button>
        </section>
        <div className='flex-container-1'>
        <section className="content">
          <div className="education">
            <div className="bg-hiasan" style={{ backgroundImage: `url(${PitaImage})` }}>
              <p>Konten Edukasi</p>
            </div>  
            <div className="education-content">
              <div className="content-box">
                <p>Jadikan Kesehatan Jiwa Prioritas</p>
                <button className='btn-content'>Cek Selengkapnya</button>
              </div>
              <div className="content-box">
                <p>4 Kebiasaan Buruk yang Merusak Otak</p>
                <button className='btn-content'>Cek Selengkapnya</button>
              </div>
              <div className="content-box">
                <p>9 Tips Memperkuat Mental</p>
                <button className='btn-content'>Cek Selengkapnya</button>
              </div>
              <div className="content-box">
                <p>Seseorang Terkena Panic Attack??</p>
                <button className='btn-content'>Cek Selengkapnya</button>
              </div>
            </div>
          </div>
          <div className="news">
          <div className="bg-hiasan" style={{ backgroundImage: `url(${PitaImage})` }}>
              <p>Berita</p>
            </div> 
            <div className="news-content">
              <div className="news-box">
                <h3>Kesepian Menjadi Ancaman yang Serius Bagi Dunia</h3>
                <p>F.Reinaldo Nugraham. Sabtu, 18 November 2023</p>
                <p>Organisasi Kesehatan Dunia (WHO) menyatakan kesepian sebagai ancaman kesehatan global yang serius. WHO meluncurkan Komisi Hubungan Sosial untuk mengatasi kekhawatiran tersebut.</p>
              </div>
              <div className="news-box">
                <h3>IPB Punya Tim Khusus Untuk Kesehatan Mental. Kenapa Mahasiswa Baru Diprioritaskan?</h3>
                <p>Neneng Zubaidah. Jum’at, 03 November 2023</p>
                <p>JAKARTA - IPB University memberikan perhatian penuh kepada Kesehatal Mental di kalangan mahasiswa. Bahkan sejak 1974, IPB University mempunyai unit khusus, Tim Bimbingan dan Konseling (TBK).  </p>
              </div>
            </div>
          </div>
        </section>
        <div className='flex-container-2'>
        <div className="bg-hiasan" style={{ backgroundImage: `url(${PitaImage})` }}>
              <p>Hubungi Kami</p>
            </div> 
        <aside className="contact">
        <div className='flex-container2'>
          <img src={Whatsapp} alt='icon WA'/>
          <p>0821-4563-21<br/>0812-3459-78</p>
        </div>
          
          <div className='flex-container2'>
            <img src={Email} alt=''/>
            <p>SHINECampusHUB@gmail.com</p>
          </div>
          
          <div className="social-media">
            <div className='flex-container2'>
              <img src={Instagram} alt='icon IG'/>
            <span>@SHINECampus_HUB</span>
            </div>
            <div className='flex-container2'>
              <img src={Twitter} alt=''/>
              <span>SHINE Campus Hub Support</span>
            </div>
            <div className='flex-container2'>
              <img src={Facebook} alt=''/>
              <span>SHINE Campus Hub Official</span>
            </div>
          </div>
        </aside>
        </div>
        </div>
      </main>
        </div>
      </div>
    </div>

  );
};

export default Home;



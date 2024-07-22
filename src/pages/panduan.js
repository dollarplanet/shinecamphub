import React, { useState } from 'react';
import './room_chat.css';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Barbox from '../component/barbox';

const ForumChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title] = useState('Panduan');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div style={{ flexGrow: 1 }}>
        <Navbar />
        <Barbox title={title}/>
        <div style={{ border: '1px solid #c0c0c0', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Cara Mengakses SHINE CAMPUS HUB</h2>
            <ol>
                <li>Masuk ke website SHINE CAMPUS HUB.</li>
                <li>Daftar akun dengan mengisi Username dan Password.</li>
                <li>Masukkan password dan konfirmasi password.</li>
                <li>Kirim verifikasi.</li>
                <li>Login dengan akun yang sudah di konfirmasi.</li>
                <li>Masuk ke beranda.</li>
                <li>Buka Profil untuk mengisi data diri pengguna.</li>
                <li>Buka Room Chat untuk memulai obrolan dengan Healer atau Helper.</li>
                <li>Buka Forum Chat Global untuk memulai obrolan dengan sesama pengguna lainnya.</li>
                <li>Gabung Membership untuk melakukan konsultasi langsung dengan Healer secara Online atau Offline.</li>
                <li>Berikan Feedback untuk menuliskan ulasan pengguna terkait website SHINE CAMPUS HUB.</li>
                <li>Buka Pengaturan untuk mengatur halaman website pengguna.</li>
                <li>Jika mengalami masalah, hubungi kontak kami atau klik Pusat Bantuan.</li>
                <li>Jika ingin keluar, Klik Log-out.</li>
            </ol>
        </div>
      </div>
    </div>
  );
};
export default ForumChat;
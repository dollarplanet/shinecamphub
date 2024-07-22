import React from 'react';
import './optonLogout.css';

const OptionsLogout = () => {
  const handleCancel = () => {
    // Navigate back to settings page
    window.location.pathname = '/setting';
  };

  const handleConfirm = () => {
    // Navigate to login page
    window.location.pathname = '/login';
  };

  return (
    <div className="options-logout">
      <div className="logout-dialog">
        <div className="logout-icon">🔓</div>
        <div className="logout-text">Apakah anda ingin Log-out akun?</div>
        <div className="buttons">
          <button className="cancel-button" onClick={handleCancel}>Batal</button>
          <button className="confirm-button" onClick={handleConfirm}>Ya</button>
        </div>
      </div>
    </div>
  );
};

export default OptionsLogout;



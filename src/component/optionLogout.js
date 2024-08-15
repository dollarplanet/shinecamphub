import React from 'react';
import './optonLogout.css';
import { useAuth } from '../component/AuthContent'; // Import useAuth for logout
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const OptionsLogout = () => {
  const { logout } = useAuth(); // Get the logout function from AuthContext
  const navigate = useNavigate(); // Get the navigate function

  const handleCancel = () => {
    // Navigate back to settings page
    navigate('/setting');
  };

  const handleConfirm = () => {
    // Call logout function and navigate to login page
    logout(); // Perform the logout action
    navigate('/login'); // Redirect to the login page
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



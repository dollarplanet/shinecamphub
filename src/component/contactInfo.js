import React from 'react';
import './contactInfo.css';

const ContactInfo = () => {
  return (
    <div className="contact-info-container">
      <h2>Kontak Kami</h2>
      <div className="contact-info">
        <p>
          <strong>WhatsApp:</strong> <br />
          0821-4563-21 <br />
          0812-3459-78
        </p>
        <p>
          <strong>Email:</strong> <br />
          SHINECAMPUSHUB@gmail.com
        </p>
        <div className="social-media">
          <p><strong>Social Media:</strong></p>
          <ul>
            <li>Instagram: @SHINECampus_HUB</li>
            <li>Twitter: @SHINECampus_HUB</li>
            <li>Facebook: SHINE Campus Hub Support</li>
            <li>LinkedIn: SHINE Campus Hub Official</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;

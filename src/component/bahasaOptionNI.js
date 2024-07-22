import React, { useState } from 'react';
import './bahasaOptionNI.css';

// Membership Form Component
const MembershipForm = ({ selectedLanguage }) => {
  // Define the form fields here
  const formFields = {
    "Nama Lengkap": "Jack Dawson",
    "Nomor Telepon": "0821-2345-0098",
    "Jenis Kelamin": "Laki-laki",
    "Umur": "20 Tahun",
    "Asal Instansi": "Mercu Buana",
    "Fakultas": "Teknik Informatika"
  };

  return (
    <div className="membership-form-container">
      <h2>Isi Formulir - {selectedLanguage}</h2>
      <table className="membership-form-table">
        <tbody>
          {Object.entries(formFields).map(([field, value]) => (
            <tr key={field}>
              <td>{field}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="save-button">Simpan</button>
    </div>
  );
}

// Language Selection Component
const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="language-selection-container">
      {!selectedLanguage ? (
        <>
          <button className="language-button" onClick={() => handleLanguageClick('Bahasa Normal')}>
            Bahasa Normal
          </button>
          <button className="language-button" onClick={() => handleLanguageClick('Bahasa Isyarat')}>
            Bahasa Isyarat
          </button>
        </>
      ) : (
        <MembershipForm selectedLanguage={selectedLanguage} />
      )}
    </div>
  );
}

export default LanguageSelection;


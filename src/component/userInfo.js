import React, { useState } from 'react';
import './userInfo.css';

const UserInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [name, setName] = useState('Jack Dawson');
  const [university, setUniversity] = useState('Universitas Mercu Buana');
  const [avatar, setAvatar] = useState('user-avatar.png');

  const handleEditPhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    setIsEditingPhoto(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handlePhotoClick = () => {
    setIsEditingPhoto(true);
  };

  return (
    <div className="user-info">
      <img src={avatar} alt="User Avatar" onClick={handlePhotoClick} />
      <h2>{name}</h2>
      <p>{university}</p>
      <button onClick={handlePhotoClick}>Edit Photo</button>
      <button onClick={handleEditProfile}>Edit Profile</button>

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <input 
              type="text" 
              value={university} 
              onChange={(e) => setUniversity(e.target.value)} 
            />
            <button onClick={handleSaveProfile}>Save Profile</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isEditingPhoto && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Photo</h3>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleEditPhoto} 
            />
            <button onClick={() => setIsEditingPhoto(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;

import React from 'react';
import './actionItem.css'; // Ensure you have appropriate styles

const ActionItem = ({ iconSrc, title, description, onClick }) => {
  return (
    <div className="action-item" onClick={onClick} role="button" tabIndex={0}>
      <img className="icon" src={iconSrc} alt={title} />
      <div className="action-text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <i className="icon chevron-right"></i>
    </div>
  );
};

export default ActionItem;


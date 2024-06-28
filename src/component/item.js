import React from 'react';

const Item = ({ button1Text, button2Text, onButtonClick }) => {
  return (
    <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
      <button
        style={{ display: 'block', margin: '5px 0' }}
        onClick={() => onButtonClick(button1Text)}
      >
        {button1Text}
      </button>
      <button
        style={{ display: 'block', margin: '5px 0' }}
        onClick={() => onButtonClick(button2Text)}
      >
        {button2Text}
      </button>
    </div>
  );
};

export default Item;

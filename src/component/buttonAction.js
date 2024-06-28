import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './buttonAction.css';

const ButtonActions = ({ data, onButtonClick, onChangeTitle }) => {
  const [showFirstButtons, setShowFirstButtons] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleFirstButtonClick = (text, explanation) => {
    setSelectedCategory(text);
    setShowFirstButtons(false);
    onChangeTitle(text); // Call onChangeTitle when a button is clicked
  };

  const handleSecondButtonClick = (text, explanation) => {
    setSelectedCategory(text);
    setShowFirstButtons(true);
    onChangeTitle(text); // Call onChangeTitle when a button is clicked
  };

  return (
    <div className="button-actions">
      {data.map((item, index) => (
        <div key={index} className="button-group">
          {selectedCategory === null ? (
            <>
              <button
                onClick={() => handleFirstButtonClick(item.button1Text, item.explanation)}
              >
                {item.button1Text}
              </button>
              <button
                onClick={() => handleFirstButtonClick(item.button2Text, item.explanation)}
              >
                {item.button2Text}
              </button>
            </>
          ) : (
            <>
              {selectedCategory === 'Sch Chat' && (
                <>
                  <button
                    onClick={() => handleSecondButtonClick('Helper', item.explanation)}
                  >
                    Helper
                  </button>
                  <button
                    onClick={() => handleSecondButtonClick('Helpe', item.explanation)}
                  >
                    Helpe
                  </button>
                </>
              )}
              {selectedCategory === 'Helper' && (
                <>
                  <button
                    onClick={() => handleSecondButtonClick('Sch Chat', item.explanation)}
                  >
                    Sch Chat
                  </button>
                  <button
                    onClick={() => handleSecondButtonClick('Pengaduan', item.explanation)}
                  >
                    Pengaduan
                  </button>
                </>
              )}
              {selectedCategory === 'Helpe' && (
                <>
                  <button
                    onClick={() => handleSecondButtonClick('Sch Chat', item.explanation)}
                  >
                    Sch Chat
                  </button>
                  <button
                    onClick={() => handleSecondButtonClick('Pengaduan', item.explanation)}
                  >
                    Pengaduan
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

ButtonActions.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      button1Text: PropTypes.string.isRequired,
      button2Text: PropTypes.string.isRequired,
      explanation: PropTypes.string.isRequired,
    })
  ).isRequired,
  onButtonClick: PropTypes.func.isRequired,
  onChangeTitle: PropTypes.func.isRequired, // Add onChangeTitle prop
};

export default ButtonActions;


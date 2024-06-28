import React from 'react';

const ExplanationItem = ({ Explanation = "../images/iconoir_question-mark-circle.png" }) => {
  return (
    <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
      <img src={Explanation} alt="Explanation" style={{ maxWidth: '100%' }} />
    </div>
  );
};

export default ExplanationItem;
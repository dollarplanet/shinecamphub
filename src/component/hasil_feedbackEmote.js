// HasilFeedbackClickEmote.js
import React from 'react';

const HasilFeedbackClickEmote = ({ feedbackStats }) => {
    return (
        <div className="hasilFeedbackClickEmote">
            {feedbackStats.map((stat, index) => (
                <div key={index} className="stat">
                    <p>{stat.label}</p>
                    <div className="progress">
                        <div 
                            className="progress-bar" 
                            style={{ width: `${stat.percentage}%` }}
                        ></div>
                    </div>
                    <p>{stat.percentage}%</p>
                </div>
            ))}
        </div>
    );
};

export default HasilFeedbackClickEmote;

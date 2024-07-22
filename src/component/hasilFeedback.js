// HasilFeedback.js
import React from 'react';
import HasilFeedbackComment from './hasil_feedbackComment';
import HasilFeedbackClickEmote from './hasil_feedbackEmote';
import './hasilFeedback.css';

const HasilFeedback = ({ comments, feedbackStats }) => {
    return (
        <div className="hasilFeedbackContainer">
            <div className="commentsSection">
                <h2>Responsif dari pengguna lainnya</h2>
                <HasilFeedbackComment comments={comments} />
            </div>
            <div className="statsSection">
                <h2>Persentase tingkat kepuasan para pengguna dengan SHINE</h2>
                <HasilFeedbackClickEmote feedbackStats={feedbackStats} />
            </div>
        </div>
    );
};

export default HasilFeedback;

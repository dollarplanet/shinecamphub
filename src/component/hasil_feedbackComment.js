// HasilFeedbackComment.js
import React from 'react';

const HasilFeedbackComment = ({ comments }) => {
    return (
        <div className="hasilFeedbackComment">
            {comments.map((comment, index) => (
                <div key={index} className="comment">
                    <p><strong>{comment.name}</strong></p>
                    <p>{comment.message}</p>
                </div>
            ))}
        </div>
    );
};

export default HasilFeedbackComment;

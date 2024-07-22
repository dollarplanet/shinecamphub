import React, { useState } from 'react';
import './isiFeedback.css';

const IsiFeedback = () => {
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(null);

    const handleRatingChange = (ratingValue) => {
        setRating(ratingValue);
    };

    return (
        <div className='isiFeedbackContainer'>
            <h2>Tulis Kesan dan Pesan kamu untuk SHINE</h2>
            <div className="feedbackRatingRow">
                <textarea 
                    placeholder="Tuliskan disini..." 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="rating">
                    <p>Seberapa Memuaskan SHINE untuk mu?</p>
                    <div className="ratingOptions">
                        {[1, 2, 3, 4, 5].map(value => (
                            <label key={value} className="ratingLabel">
                                <input 
                                    type="radio" 
                                    name="rating" 
                                    value={value} 
                                    onChange={() => handleRatingChange(value)}
                                />
                                <span className={`ratingIcon rating-${value}`}>
                                    {value === 1 ? '😠' :
                                     value === 2 ? '🙁' :
                                     value === 3 ? '😐' :
                                     value === 4 ? '😊' :
                                     '😁'}
                                </span>
                                <p>{value === 1 ? 'Sangat Tidak Puas' :
                                   value === 2 ? 'Tidak Puas' :
                                   value === 3 ? 'Cukup' :
                                   value === 4 ? 'Puas' :
                                   'Sangat Puas'}</p>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <button disabled={!feedback || rating === null}>Kirim</button>
        </div>
    );
};

export default IsiFeedback;

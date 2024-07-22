import React from 'react';
import './questionForm.css';

const QuestionForm = () => {
  return (
    <div className="question-form-container">
      <h2>Apa yang bisa kami bantu?</h2>
      <textarea placeholder="Tuliskan pertanyaan mu..."></textarea>
      <div className="general-questions">
        <strong>Pertanyaan umum</strong>
        <ul>
          <li>Apakah akun saya bisa di hapus?</li>
          <li>Jika sudah lulus, apakah akun ini masih bisa digunakan?</li>
          <li>Bagaimana mengakses website dengan 2 akun?</li>
          <li>Bagaimana mencari konten edukasi yang sudah lama?</li>
          <li>Apakah Healer disini bisa di percaya?</li>
          <li>Apakah kemanan akun data kami terjamin dengan baik?</li>
          <li>Apa manfaat website ini?</li>
        </ul>
      </div>
      <button className="submit-button">Kirim</button>
    </div>
  );
}

export default QuestionForm;
